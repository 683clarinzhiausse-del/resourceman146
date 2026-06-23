// Cloudflare Worker with D1 Database
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok', message: 'ResourceMan Cloudflare Worker is running' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // API Routes
    const apiPath = url.pathname.replace('/api', '');

    try {
      // Customers
      if (url.pathname === '/api/customers' && request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM customers ORDER BY createdAt DESC').all();
        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname === '/api/customers' && request.method === 'POST') {
        const customers = await request.json();
        if (!Array.isArray(customers)) {
          return new Response(JSON.stringify({ error: 'Invalid data format' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Bulk insert/update
        for (const customer of customers) {
          await env.DB.prepare(`
            INSERT OR REPLACE INTO customers (id, name, email, password, role, phone, address, isBlocked, purchaseHistory)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            customer.id,
            customer.name,
            customer.email,
            customer.password,
            customer.role || 'client',
            customer.phone || '',
            customer.address || '',
            customer.isBlocked ? 1 : 0,
            JSON.stringify(customer.purchaseHistory || [])
          ).run();
        }

        return new Response(JSON.stringify({ success: true, message: 'Customers saved' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Get single customer
      if (url.pathname.match(/^\/api\/customers\/[^\/]+$/) && request.method === 'GET') {
        const email = url.pathname.split('/').pop();
        const { results } = await env.DB.prepare('SELECT * FROM customers WHERE email = ?').bind(email).all();
        
        if (results.length === 0) {
          return new Response(JSON.stringify({ error: 'Customer not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const customer = results[0];
        customer.purchaseHistory = JSON.parse(customer.purchaseHistory || '[]');
        
        return new Response(JSON.stringify(customer), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Delete customer
      if (url.pathname.match(/^\/api\/customers\/[^\/]+$/) && request.method === 'DELETE') {
        const email = url.pathname.split('/').pop();
        const result = await env.DB.prepare('DELETE FROM customers WHERE email = ?').bind(email).run();
        
        if (result.changes === 0) {
          return new Response(JSON.stringify({ error: 'Customer not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({ success: true, message: 'Customer deleted' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Inquiries
      if (url.pathname === '/api/inquiries' && request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM inquiries ORDER BY createdAt DESC').all();
        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname === '/api/inquiries' && request.method === 'POST') {
        const inquiry = await request.json();
        
        await env.DB.prepare(`
          INSERT OR REPLACE INTO inquiries (id, name, email, subject, message, date, replied)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
          inquiry.id,
          inquiry.name,
          inquiry.email,
          inquiry.subject,
          inquiry.message,
          inquiry.date,
          inquiry.replied ? 1 : 0
        ).run();

        return new Response(JSON.stringify({ success: true, message: 'Inquiry saved' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Catalog
      if (url.pathname === '/api/catalog' && request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM products ORDER BY createdAt DESC').all();
        
        const catalog = {
          shoes: results.filter(p => p.type === 'shoe'),
          shoelanders: results.filter(p => p.type === 'shoelander'),
          marikinaCollection: results.filter(p => p.type === 'marikina'),
          techProducts: results.filter(p => p.type === 'technology')
        };

        return new Response(JSON.stringify(catalog), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname === '/api/catalog' && request.method === 'POST') {
        const catalog = await request.json();
        
        // Clear existing products
        await env.DB.prepare('DELETE FROM products').run();

        // Insert new products
        const allProducts = [
          ...(catalog.shoes || []).map(p => ({ ...p, type: 'shoe' })),
          ...(catalog.shoelanders || []).map(p => ({ ...p, type: 'shoelander' })),
          ...(catalog.marikinaCollection || []).map(p => ({ ...p, type: 'marikina' })),
          ...(catalog.techProducts || []).map(p => ({ ...p, type: 'technology' }))
        ];

        for (const product of allProducts) {
          await env.DB.prepare(`
            INSERT INTO products (id, type, name, price, image, desc)
            VALUES (?, ?, ?, ?, ?, ?)
          `).bind(product.id, product.type, product.name, product.price, product.image, product.desc || '').run();
        }

        return new Response(JSON.stringify({ success: true, message: `Catalog updated with ${allProducts.length} products` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Orders
      if (url.pathname === '/api/orders' && request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname === '/api/orders' && request.method === 'POST') {
        const order = await request.json();
        
        await env.DB.prepare(`
          INSERT OR REPLACE INTO orders (id, customerEmail, customerName, item, cost, payment, status, deliveryDays, deliveryDate)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          order.id,
          order.customerEmail,
          order.customerName,
          order.item,
          order.cost,
          order.payment || 'N/A',
          order.status || 'Pending',
          order.deliveryDays || null,
          order.deliveryDate || null
        ).run();

        return new Response(JSON.stringify({ success: true, message: 'Order saved' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Staff
      if (url.pathname === '/api/staff' && request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM staff ORDER BY createdAt DESC').all();
        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname === '/api/staff' && request.method === 'POST') {
        const staff = await request.json();
        
        await env.DB.prepare(`
          INSERT OR REPLACE INTO staff (id, name, position, salary)
          VALUES (?, ?, ?, ?)
        `).bind(staff.id, staff.name, staff.position, staff.salary).run();

        return new Response(JSON.stringify({ success: true, message: 'Staff saved' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname.match(/^\/api\/staff\/[^\/]+$/) && request.method === 'DELETE') {
        const id = url.pathname.split('/').pop();
        const result = await env.DB.prepare('DELETE FROM staff WHERE id = ?').bind(id).run();
        
        if (result.changes === 0) {
          return new Response(JSON.stringify({ error: 'Staff not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({ success: true, message: 'Staff deleted' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Payroll History
      if (url.pathname === '/api/payroll-history' && request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM payroll_history ORDER BY createdAt DESC').all();
        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname === '/api/payroll-history' && request.method === 'POST') {
        const entry = await request.json();
        
        await env.DB.prepare(`
          INSERT OR REPLACE INTO payroll_history (id, date, count, total, status)
          VALUES (?, ?, ?, ?, ?)
        `).bind(entry.id, entry.date, entry.count, entry.total, entry.status).run();

        return new Response(JSON.stringify({ success: true, message: 'Payroll history saved' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 404 for unmatched routes
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};