<?php
session_start();
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/helpers.php';

// Check Admin Auth
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    header("Location: login.php");
    exit;
}

$admin_name = $_SESSION['user_name'] ?? 'Admin User';

// Fetch KPIs
$total_revenue = $pdo->query("SELECT SUM(total_amount) FROM orders")->fetchColumn() ?: 0;
$total_orders = $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
$total_customers = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'customer'")->fetchColumn();
$pending_orders = $pdo->query("SELECT COUNT(*) FROM orders WHERE order_status = 'Pending' OR order_status = 'Processing'")->fetchColumn();
$low_stock = $pdo->query("SELECT COUNT(*) FROM products WHERE stock < 10")->fetchColumn();

// Fetch Recent Orders
$recent_orders = $pdo->query("
    SELECT o.*, u.full_name as user_name 
    FROM orders o 
    LEFT JOIN users u ON o.user_id = u.id 
    ORDER BY o.id DESC LIMIT 5
")->fetchAll(PDO::FETCH_ASSOC);

// Fetch Top Products (Assuming based on highest price or most recently added if no sales tracking)
$top_products = $pdo->query("
    SELECT name, price 
    FROM products 
    ORDER BY id DESC LIMIT 5
")->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel | Ritahamaya</title>
    <link rel="stylesheet" href="../assets/css/admin.css?v=2">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <input type="checkbox" id="mobile-menu" class="mobile-menu-toggle">
    <div class="mobile-top-bar">
        <label for="mobile-menu" class="mobile-menu-btn"><i class="fas fa-bars"></i></label>
    </div>
    <div class="admin-layout">
        <!-- Sidebar -->
        <aside class="admin-sidebar">
            <div class="sidebar-header">
                <img src="../assets/images/logo.png" alt="Logo" class="sidebar-logo">
                <div class="sidebar-title">Admin Panel</div>
            </div>
            
            <nav class="sidebar-nav">
                <a href="#" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-sync-alt"></i></div>
                    <div class="nav-text">Clear Site Cache</div>
                </a>
                
                <a href="index.php" class="nav-item active">
                    <div class="nav-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="nav-text">Dashboard</div>
                </a>
                
                <a href="products.php" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-boxes"></i></div>
                    <div class="nav-text">Products</div>
                </a>
                
                <?php if ($_SESSION['user_role'] === 'admin'): ?>
                <a href="orders.php" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-shopping-cart"></i></div>
                    <div class="nav-text">Customer Orders</div>
                </a>
                
                <a href="messages.php" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-envelope"></i></div>
                    <div class="nav-text">Contact Messages</div>
                </a>
                <?php endif; ?>
                <!-- Footer Links -->
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);"></div>
                <a href="../index.php" class="nav-item" target="_blank">
                    <div class="nav-icon"><i class="fas fa-external-link-alt"></i></div>
                    <div class="nav-text">View Live Site</div>
                </a>
                <a href="logout.php" class="nav-item nav-logout">
                    <div class="nav-icon"><i class="fas fa-sign-out-alt"></i></div>
                    <div class="nav-text">Admin Logout</div>
                </a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="admin-main">
            <!-- Header -->
            <header class="admin-header">
                <h1 class="page-title">Dashboard</h1>
                
                <div class="header-search">
                    <i class="fas fa-search text-muted"></i>
                    <input type="text" placeholder="Search orders, products, or customers...">
                </div>

                <div class="header-right">
                    <button class="icon-btn"><i class="fas fa-sync-alt"></i></button>
                    <div class="profile-dropdown">
                        <div class="admin-avatar"><i class="fas fa-user"></i></div>
                        <div class="profile-text">
                            <div class="name"><?= sanitize($admin_name) ?></div>
                            <div class="role"><?= $_SESSION['user_role'] === 'admin' ? 'Admin' : 'Super Admin' ?></div>
                        </div>
                        <i class="fas fa-chevron-down text-muted" style="margin-left: 8px; font-size: 0.8rem;"></i>
                    </div>
                </div>
            </header>

            <!-- Hero Banner -->
            <div class="hero-banner">
                <div class="hero-content">
                    <div class="hero-welcome">Welcome back,</div>
                    <div class="hero-name">Admin <i class="fas fa-leaf"></i></div>
                    <div class="hero-desc">Here's what's happening <br>with your store today.</div>
                </div>
            </div>

            <!-- KPI Cards -->
            <div class="kpi-grid">
                <!-- Revenue -->
                <?php if ($_SESSION['user_role'] === 'admin'): ?>
                <div class="kpi-card">
                    <div class="kpi-header">
                        <div class="kpi-icon bg-green-light"><i class="fas fa-wallet text-green"></i></div>
                        <div class="kpi-label">TOTAL REVENUE</div>
                    </div>
                    <div class="kpi-value">₹<?= number_format($total_revenue, 2) ?></div>
                </div>
                <?php endif; ?>

                <!-- Orders -->
                <div class="kpi-card">
                    <div class="kpi-header">
                        <div class="kpi-icon bg-orange-light"><i class="fas fa-shopping-bag text-orange"></i></div>
                        <div class="kpi-label">ORDERS</div>
                    </div>
                    <div class="kpi-value"><?= number_format($total_orders) ?></div>
                </div>

                <!-- Customers -->
                <div class="kpi-card">
                    <div class="kpi-header">
                        <div class="kpi-icon bg-green-light"><i class="fas fa-users text-green"></i></div>
                        <div class="kpi-label">CUSTOMERS</div>
                    </div>
                    <div class="kpi-value"><?= number_format($total_customers) ?></div>
                </div>

                <!-- Pending Orders -->
                <div class="kpi-card">
                    <div class="kpi-header">
                        <div class="kpi-icon bg-orange-light"><i class="fas fa-glasses text-orange"></i></div>
                        <div class="kpi-label">PENDING ORDERS</div>
                    </div>
                    <div class="kpi-value"><?= number_format($pending_orders) ?></div>
                    <div class="kpi-status status-orange"><i class="far fa-clock"></i> To process</div>
                </div>

                <!-- Low Stock -->
                <div class="kpi-card">
                    <div class="kpi-header">
                        <div class="kpi-icon bg-red-light"><i class="fas fa-exclamation-triangle text-red"></i></div>
                        <div class="kpi-label">LOW STOCK</div>
                    </div>
                    <div class="kpi-value text-red"><?= $low_stock ?></div>
                    <div class="kpi-status status-red"><i class="fas fa-exclamation-circle"></i> Needs batch</div>
                </div>
            </div>

            <!-- Bottom Row -->
            <div class="dashboard-row grid-2-1">
                <!-- Recent Orders -->
                <div class="widget-card">
                    <div class="widget-header">
                        <div class="widget-title">Recent Orders</div>
                        <button class="pill-btn light-green">View All</button>
                    </div>
                    <div class="recent-orders">
                        <?php foreach($recent_orders as $order): ?>
                            <div class="order-item">
                                <div class="order-icon"><i class="fas fa-shopping-bag"></i></div>
                                <div class="order-details">
                                    <div class="order-name"><?= sanitize($order['user_name']) ?></div>
                                    <div class="order-meta">Order #<?= sanitize($order['order_number']) ?> • <?= date('M j, g:i A', strtotime($order['created_at'])) ?></div>
                                </div>
                                <div class="order-amount-status">
                                    <div class="order-amount">₹<?= number_format($order['total_amount'], 2) ?></div>
                                    <div class="badge badge-processing"><?= strtoupper($order['order_status']) ?></div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="right-column">
                    <!-- Low Stock Alert -->
                    <div class="widget-card">
                        <div class="widget-header">
                            <div class="widget-title">Low Stock Alert</div>
                            <button class="pill-btn outline-green">Restock</button>
                        </div>
                        <div class="empty-state">
                            <p>Inventory is healthy.</p>
                        </div>
                    </div>

                    <!-- Top Products -->
                    <div class="widget-card">
                        <div class="widget-header" style="margin-bottom: 15px;">
                            <div class="widget-title">Top Products</div>
                        </div>
                        <div class="top-products-list">
                            <?php foreach($top_products as $product): ?>
                                <div class="top-product-item">
                                    <div class="tp-name"><?= sanitize($product['name']) ?></div>
                                    <div class="tp-price">₹<?= number_format($product['price'], 2) ?></div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    </div>
</body>
</html>
