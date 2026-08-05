<?php
session_start();
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/helpers.php';

// Check Admin Auth
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    header("Location: login.php");
    exit;
}
if ($_SESSION['user_role'] === 'superadmin') {
    header("Location: index.php");
    exit;
}

$admin_name = $_SESSION['user_name'] ?? 'Admin User';

// Handle status updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_status') {
    $order_id = (int)$_POST['order_id'];
    $new_status = sanitize($_POST['status']);
    if ($GLOBALS['db_connected']) {
        $stmt = $pdo->prepare("UPDATE orders SET order_status = ? WHERE id = ?");
        $stmt->execute([$new_status, $order_id]);
    }
    header("Location: orders.php");
    exit;
}

// Fetch real orders from database
$orders = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Orders | Admin Panel</title>
    <link rel="stylesheet" href="../assets/css/admin.css?v=4">
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
                
                <a href="index.php" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="nav-text">Dashboard</div>
                </a>
                
                <a href="products.php" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-boxes"></i></div>
                    <div class="nav-text">Products</div>
                </a>
                
                <a href="orders.php" class="nav-item active">
                    <div class="nav-icon"><i class="fas fa-shopping-cart"></i></div>
                    <div class="nav-text">Customer Orders</div>
                </a>
                
                <a href="messages.php" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-envelope"></i></div>
                    <div class="nav-text">Contact Messages</div>
                </a>

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
            <div class="orders-header">
                <h1 class="page-title">Customer Orders Management</h1>
                <p class="page-subtitle">View customer order details and update shipping status</p>
            </div>

            <!-- Table Card (Desktop Only) -->
            <div class="table-card desktop-orders-table">
                <table class="admin-table orders-table">
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Date</th>
                            <th>Customer Name & Contact</th>
                            <th>Shipping Address</th>
                            <th>Payment</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Update Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach($orders as $o): ?>
                        <tr>
                            <td class="td-order-id"><?= htmlspecialchars($o['order_number']) ?></td>
                            <td class="td-date-stack">
                                <?= date('d M Y', strtotime($o['created_at'])) ?><br>
                                <span><?= date('h:i A', strtotime($o['created_at'])) ?></span>
                            </td>
                            <td class="td-customer-stack">
                                <div class="cust-name"><?= htmlspecialchars($o['full_name']) ?></div>
                                <div class="cust-contact"><?= htmlspecialchars($o['phone']) ?> | <?= htmlspecialchars($o['email']) ?></div>
                            </td>
                            <td class="td-gray"><?= htmlspecialchars($o['address']) ?></td>
                            <td class="td-gray-stack">
                                <?= htmlspecialchars($o['payment_method']) ?>
                            </td>
                            <td class="td-amount"><?= format_price($o['total_amount']) ?></td>
                            <td><span class="badge-processing" style="<?= strtoupper($o['order_status']) == 'DELIVERED' ? 'background:#E8F5E9;color:#2E7D32;' : '' ?>"><?= strtoupper($o['order_status']) ?></span></td>
                            <td>
                                <form method="POST" style="margin: 0;">
                                    <input type="hidden" name="action" value="update_status">
                                    <input type="hidden" name="order_id" value="<?= $o['id'] ?>">
                                    <select name="status" class="status-select" onchange="this.form.submit()">
                                        <option value="Processing" <?= $o['order_status'] == 'Processing' ? 'selected' : '' ?>>Processing</option>
                                        <option value="Shipped" <?= $o['order_status'] == 'Shipped' ? 'selected' : '' ?>>Shipped</option>
                                        <option value="Delivered" <?= $o['order_status'] == 'Delivered' ? 'selected' : '' ?>>Delivered</option>
                                        <option value="Cancelled" <?= $o['order_status'] == 'Cancelled' ? 'selected' : '' ?>>Cancelled</option>
                                    </select>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <!-- Mobile Cards (Mobile Only) -->
            <div class="mobile-orders-list">
                <?php foreach($orders as $o): ?>
                <div class="mobile-order-card">
                    <div class="moc-header">
                        <div class="moc-id"><?= htmlspecialchars($o['order_number']) ?></div>
                        <div class="moc-status" style="<?= strtoupper($o['order_status']) == 'DELIVERED' ? 'background:#E8F5E9;color:#2E7D32;' : '' ?>"><?= strtoupper($o['order_status']) ?></div>
                    </div>
                    <div class="moc-date">
                        <?= date('d M Y, h:i A', strtotime($o['created_at'])) ?>
                    </div>
                    <div class="moc-customer">
                        <div class="moc-cust-name"><?= htmlspecialchars($o['full_name']) ?></div>
                        <div class="moc-cust-contact"><?= htmlspecialchars($o['phone']) ?> &bull; <?= htmlspecialchars($o['email']) ?></div>
                    </div>
                    <div class="moc-section">
                        <div class="moc-label">SHIPPING ADDRESS</div>
                        <div class="moc-box"><?= htmlspecialchars($o['address']) ?></div>
                    </div>
                    <div class="moc-grid">
                        <div class="moc-section">
                            <div class="moc-label">AMOUNT</div>
                            <div class="moc-box moc-amount"><?= format_price($o['total_amount']) ?></div>
                        </div>
                        <div class="moc-section">
                            <div class="moc-label">PAYMENT</div>
                            <div class="moc-box moc-payment"><?= htmlspecialchars($o['payment_method']) ?></div>
                        </div>
                    </div>
                    <div class="moc-update">
                        <span style="font-weight:700; color:#333; font-size:0.95rem;">Update Status:</span>
                        <form method="POST" style="margin: 0; flex-grow: 1;">
                            <input type="hidden" name="action" value="update_status">
                            <input type="hidden" name="order_id" value="<?= $o['id'] ?>">
                            <select name="status" class="status-select" onchange="this.form.submit()" style="width: 100%;">
                                <option value="Processing" <?= $o['order_status'] == 'Processing' ? 'selected' : '' ?>>Processing</option>
                                <option value="Shipped" <?= $o['order_status'] == 'Shipped' ? 'selected' : '' ?>>Shipped</option>
                                <option value="Delivered" <?= $o['order_status'] == 'Delivered' ? 'selected' : '' ?>>Delivered</option>
                                <option value="Cancelled" <?= $o['order_status'] == 'Cancelled' ? 'selected' : '' ?>>Cancelled</option>
                            </select>
                        </form>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </main>
    </div>
</body>
</html>
