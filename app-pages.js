// Minimal page bodies for Option B (single shell).
// r4.js will render into #app-page-container via navigateTo(pageId).

(function () {
  const pageBodies = {
    1: `
      <div class="page active">
        <h1 style="margin-bottom: 32px;">Welcome to My ResourceMan</h1>
        <div class="grid-split-2">
          <div class="panel-box">
            <img src="https://picsum.photos/id/1015/800/600" alt="Gibson Shoes" class="hero-img">
            <div class="panel-padding">
              <h2>Gibson Elite Collection Safety Shoes</h2>
              <p style="color: var(--text-muted); margin-top: 12px; margin-bottom: 24px; line-height: 1.6;">Discover our latest collection of premium footwear designed for comfort and style.</p>
              <button onclick="navigateTo(3)" class="btn-action">Shop Collection <i class="fas fa-arrow-right"></i></button>
            </div>
          </div>
          <div class="space-stack">
            <div class="panel-box panel-padding">
              <h3>Featured This Week</h3>
              <div class="thumbnail-row">
                <div onclick="viewShoe(1)" class="thumb-item">
                  <img src="https://picsum.photos/id/201/300/300">
                  <p class="thumb-title">Urban Runner X1</p>
                </div>
                <div onclick="viewShoe(2)" class="thumb-item">
                  <img src="https://picsum.photos/id/237/300/300">
                  <p class="thumb-title">Trail Master Pro</p>
                </div>
              </div>
            </div>
            <div class="gradient-banner">
              <h3 style="font-weight: 800;">Join the ResourceMan Community</h3>
              <p style="margin-top: 12px; font-weight: 500; line-height: 1.5;">Get exclusive access, early drops, and member-only discounts.</p>
              <button onclick="handleProfileWidgetClick()" class="btn-action">Sign Up Free</button>
            </div>
          </div>
        </div>
      </div>
    `,

    2: `
      <div class="page active">
        <h1 style="text-align: center; margin-bottom: 48px;">Our Vision & Mission</h1>
        <div class="grid-split-2">
          <div class="panel-box panel-padding">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
              <span style="font-size: 40px;">🌍</span>
              <h2>Vision</h2>
            </div>
            <p style="font-size: 18px; line-height: 1.7; color: #d4d4d8;">To be the global leader in intelligent, sustainable footwear that empowers every individual to move with confidence, comfort, and purpose.</p>
          </div>
          <div class="panel-box panel-padding">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
              <span style="font-size: 40px;">🎯</span>
              <h2>Mission</h2>
            </div>
            <p style="font-size: 18px; line-height: 1.7; color: #d4d4d8;">We craft premium shoes using cutting-edge technology and ethical materials, delivering unmatched performance while protecting our planet for future generations.</p>
          </div>
        </div>
      </div>
    `,

    3: `
      <div class="page active">
        <h1 style="margin-bottom: 32px;">Gibson's Elite Shoes Collection</h1>
        <div id="shoes-grid" class="grid-shoes"></div>
      </div>
    `,

    4: `
      <div class="page active">
        <h1 style="margin-bottom: 48px;">Technologies</h1>
        <div id="tech-grid" class="grid-split-2"></div>
      </div>
    `,

    5: `
      <div class="page active">
        <h1 style="margin-bottom: 32px;">Other Products</h1>
        <div id="other-grid" class="grid-split-3"></div>
      </div>
    `,

    6: `
      <div class="page active">
        <h1 style="margin-bottom: 32px;">Shoelanders Best Collection</h1>
        <div id="shoelanders-grid" class="grid-shoes"></div>
      </div>
    `,

    7: `
      <div class="page active">
        <h1 style="margin-bottom: 32px;">Marikina's Premium Collection</h1>
        <div id="marikina-grid" class="grid-shoes"></div>
      </div>
    `,

    8: `
      <div class="page active">
        <h1 style="margin-bottom: 32px;">PPE's Personal Protective Equipment</h1>
        <div id="ppe-grid" class="grid-shoes"></div>
      </div>
    `,

    9: `
      <div class="page active">
        <h1 style="margin-bottom: 32px;">More Products & Services</h1>
        <div id="more-products-grid" class="grid-split-3"></div>
      </div>
    `,

    10: `
      <div class="page active">
        <div id="customer-empty-view" class="panel-box">
          <div class="panel-padding" style="padding: 24px;">
            <h2 style="margin-bottom: 12px;">Guest Access Only</h2>
            <p style="color: var(--text-muted); line-height: 1.6;">Please log in first to view your profile data and transaction history.</p>
          </div>
        </div>

        <div style="margin-bottom: 24px; display:flex; justify-content:center;">
          <a href="https://www.paylrm.com" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:10px; padding: 14px 22px; border-radius: 16px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.12); color: #fff; font-weight: 800;">
            <i class="fas fa-wallet"></i> Pay via GCash
          </a>
        </div>

        <div id="customer-view" class="hidden">
          <div class="hub-banner">
            <div>
              <h2 id="customer-profile-title" style="margin-top: 8px; font-weight: 900;">Welcome Back!</h2>
              <p id="customer-profile-subtitle" style="color: var(--text-muted); margin-top: 4px;">customer@resourceman.com</p>
            </div>
            <button onclick="logout()" class="btn-signout">Sign Out</button>
          </div>

          <div class="panel-box panel-padding" style="padding: 24px; margin-bottom: 24px;">
            <h3 style="font-size: 20px; margin-bottom: 16px; color: var(--primary);"><i class="fas fa-user-circle"></i> Profile Information</h3>
            <div style="display: grid; gap: 12px;">
              <div><strong>Name:</strong> <span id="profile-name-text"></span></div>
              <div><strong>Email:</strong> <span id="profile-email-text"></span></div>
              <div><strong>Phone:</strong> <span id="profile-phone-text"></span></div>
              <div><strong>Address:</strong> <span id="profile-address-text"></span></div>
              <div><strong>Account Status:</strong> <span id="profile-status-text"></span></div>
              <div><strong>Orders:</strong> <span id="profile-orders-count"></span></div>
            </div>
          </div>

          <div class="dashboard-split">
            <div class="panel-box panel-padding" style="padding: 24px;">
              <h3 style="font-size: 20px; margin-bottom: 16px; color: var(--primary);"><i class="fas fa-id-card"></i> Shipping Matrix</h3>
              <label class="form-label">Contact Handset</label>
              <input id="contact-phone" placeholder="+63 900 000 0000" class="form-input">
              <label class="form-label">Fulfillment Address</label>
              <textarea id="contact-address" placeholder="Unit/Building, Street City, Province" rows="3" class="form-input form-textarea"></textarea>
              <button onclick="saveProfile()" class="btn-sync">Sync Metadata updates</button>
            </div>

            <div class="panel-box panel-padding" style="padding: 24px;">
              <h3 style="font-size: 20px; margin-bottom: 16px; color: var(--primary);"><i class="fas fa-history"></i> Personal Purchase History</h3>
              <div class="history-split">
                <div>
                  <h4 style="margin-bottom: 12px;">Cart History</h4>
                  <button id="checkout-all-btn" onclick="checkoutCart()" class="btn-action" style="margin-bottom: 12px; width: 100%; display: none;">Checkout All Items</button>
                  <div class="table-container admin-table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Reference ID</th>
                          <th>Shoe Line Model</th>
                          <th>Invoice Pricing</th>
                          <th>Status Line</th>
                          <th style="text-align: right;">Action</th>
                        </tr>
                      </thead>
                      <tbody id="customer-cart-rows"></tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 style="margin-bottom: 12px;">Purchase History</h4>
                  <div class="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Reference ID</th>
                          <th>Shoe Line Model</th>
                          <th>Invoice Pricing</th>
                          <th>Status Line</th>
                          <th style="text-align: right;">Action</th>
                        </tr>
                      </thead>
                      <tbody id="customer-purchase-rows"></tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,

    11: `
      <div class="page active">
        <div id="admin-view" class="hidden">
          <div class="hub-banner admin-banner">
            <div>
              <span class="hub-tag admin-hub-tag"><i class="fas fa-shield-alt"></i> Root Administrator Terminal</span>
              <h2 style="margin-top: 8px; font-weight: 900;">ResourceMan Admin Dashboard</h2>
              <p style="color: var(--text-muted); margin-top: 4px;">Cross-checking site database registers, transactional logs, and system passwords metrics</p>
            </div>
            <button onclick="logout()" class="btn-action" style="background-color: var(--danger); color: #ffffff;">Kill Active Session</button>
          </div>

          <div class="admin-metrics-row">
            <div class="metric-card"><p class="metric-label">Active Profiles Counter</p><h3 id="stat-profiles" class="metric-value text-yellow">0</h3></div>
            <div class="metric-card"><p class="metric-label">Cumulative Transactions</p><h3 id="stat-orders" class="metric-value text-yellow">0</h3></div>
            <div class="metric-card"><p class="metric-label">Flagged / Blocked Users</p><h3 id="stat-blocked" class="metric-value" style="color: var(--danger);">0</h3></div>
          </div>

          <div class="panel-box panel-padding">
            <h3 style="margin-bottom: 24px;"><i class="fas fa-users-cog text-yellow"></i> Customer Master Databases & Firewalls</h3>
            <div class="table-container">
              <table>
                <thead><tr>
                  <th>Full Profile Name</th>
                  <th>Secure System Email</th>
                  <th>Plaintext Password Metric</th>
                  <th>Contact / Shipping Profile</th>
                  <th>Invoiced History Records</th>
                  <th style="text-align: center;">System Override Actions</th>
                </tr></thead>
                <tbody id="admin-customer-rows"></tbody>
              </table>
            </div>
          </div>

          <div class="panel-box panel-padding" style="margin-top: 24px;">
            <h3 style="margin-bottom: 24px;"><i class="fas fa-shopping-bag text-yellow"></i> Global Purchase History</h3>
            <div class="table-container">
              <table>
                <thead><tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Item(s)</th>
                  <th>Cost</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr></thead>
                <tbody id="admin-orders-rows"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `,

    12: `
      <div class="page active">
        <div id="admin-product-view" class="hidden">
          <div class="hub-banner admin-banner">
            <div>
              <span class="hub-tag admin-hub-tag"><i class="fas fa-bag-shopping"></i> Admin Product Manager</span>
              <h2 style="margin-top: 8px; font-weight: 900;">Change Pricing & Add Products</h2>
              <p style="color: var(--text-muted); margin-top: 4px;">Update prices and manage product catalog.</p>
            </div>
          </div>

          <div class="panel-box panel-padding" style="margin-top: 18px;">
            <h3 style="margin-bottom: 12px; color: var(--primary);"><i class="fas fa-wrench"></i> Update Pricing</h3>

            <div class="grid-split-2">
              <div>
                <label class="form-label">Product Type</label>
                <select id="admin-price-type" class="form-input">
                  <option value="shoe">Gibson Elite Collection</option>
                  <option value="shoelander">Shoelanders Best Collection</option>
                  <option value="marikina">Marikina's Premium Shoe Collection</option>
                  <option value="ppe">PPE's Personal Protective</option>
                  <option value="technology">Technologies</option>
                  <option value="product">Other Products</option>
                  <option value="more-products">More Products & Services</option>
                </select>
              </div>

              <div>
                <label class="form-label">Lookup by (ID or Name)</label>
                <select id="admin-price-lookup-mode" class="form-input">
                  <option value="id">ID</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <div style="grid-column: 1 / -1;">
                <label class="form-label">Lookup Value</label>
                <input id="admin-price-lookup-value" class="form-input" placeholder="e.g., 1 or 'Urban Runner X1'">
              </div>

              <div>
                <label class="form-label">New Price</label>
                <input id="admin-price-new" class="form-input" placeholder="e.g., 2499 or ₱2,499">
              </div>

              <div>
                <label class="form-label">New Description (optional)</label>
                <textarea id="admin-price-desc-new" class="form-input form-textarea" rows="3" placeholder="Optional."></textarea>
              </div>

              <div style="grid-column: 1 / -1;">
                <label class="form-label">New Image URL (optional)</label>
                <input id="admin-price-image-new" class="form-input" placeholder="Optional.">
              </div>

              <div style="grid-column: 1 / -1;">
                <button onclick="adminUpdateProductPrice()" class="btn-action" style="width: 100%;">Update</button>
              </div>
            </div>
          </div>

          <div class="panel-box panel-padding" style="margin-top: 18px;">
            <h3 style="margin-bottom: 12px; color: var(--primary);"><i class="fas fa-plus-circle"></i> Add New Product</h3>
            <div class="grid-split-2">
              <div>
                <label class="form-label">Product Type</label>
                <select id="admin-add-type" class="form-input">
                  <option value="shoe">Gibson Elite Collection</option>
                  <option value="shoelander">Shoelanders Best Collection</option>
                  <option value="marikina">Marikina's Premium Shoe Collection</option>
                  <option value="ppe">PPE's Personal Protective</option>
                  <option value="technology">Technologies</option>
                  <option value="product">Other Products</option>
                  <option value="more-products">More Products & Services</option>
                </select>
              </div>

              <div>
                <label class="form-label">New ID</label>
                <input id="admin-add-id" class="form-input" placeholder="Optional (auto-generate if blank)">
              </div>

              <div style="grid-column: 1 / -1;">
                <label class="form-label">New Name</label>
                <input id="admin-add-name" class="form-input" placeholder="Product name">
              </div>

              <div>
                <label class="form-label">New Price</label>
                <input id="admin-add-price" class="form-input" placeholder="e.g., 2999">
              </div>

              <div>
                <label class="form-label">New Image URL</label>
                <input id="admin-add-image" class="form-input" placeholder="Optional URL">
              </div>

              <div style="grid-column: 1 / -1;">
                <label class="form-label">New Description (optional)</label>
                <textarea id="admin-add-desc" class="form-input form-textarea" rows="3" placeholder="Optional."></textarea>
              </div>

              <div style="grid-column: 1 / -1;">
                <button onclick="adminAddProduct()" class="btn-action" style="width: 100%;">Add</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,

    20: `
      <div class="page active">
        <div class="auth-card">
          <h2 class="auth-title">Account Login</h2>
          <p class="auth-subtitle">Sign in to reveal member pricing and track orders</p>
          <input id="login-email" type="email" placeholder="Email Address" class="auth-input">
          <input id="login-pass" type="password" placeholder="Password" class="auth-input">
          <button onclick="login()" class="btn-action">Login</button>
          <p onclick="navigateTo(21)" class="toggle-auth-prompt">Don't have an account? Create one here</p>
        </div>
      </div>
    `,

    21: `
      <div class="page active">
        <div class="auth-card">
          <h2 class="auth-title">Create Account</h2>
          <p class="auth-subtitle">Join ResourceMan to purchase footwear and track order history</p>
          <input id="reg-name" type="text" placeholder="Full Name" class="auth-input">
          <input id="reg-email" type="email" placeholder="Email Address" class="auth-input">
          <input id="reg-pass" type="password" placeholder="Secure Password" class="auth-input">
          <input id="reg-phone" type="tel" placeholder="Phone Number" class="auth-input">
          <input id="reg-address" type="text" placeholder="Address" class="auth-input">
          <button onclick="register()" class="btn-action">Complete Registration</button>
          <p onclick="navigateTo(20)" class="toggle-auth-prompt">Already have an account? Log in instead</p>
        </div>
      </div>
    `
  };

  window.__RM_PAGES__ = pageBodies;
})();

