<?php
require_once __DIR__ . '/includes/header.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$user_id = $_SESSION['user_id'];
$user_name = $_SESSION['user_name'] ?? 'Customer';
$user_email = $_SESSION['user_email'] ?? '';

$user_orders = [];
if ($GLOBALS['db_connected']) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? OR email = ? ORDER BY id DESC");
        $stmt->execute([$user_id, $user_email]);
        $user_orders = $stmt->fetchAll();
    } catch (Exception $e) {
        $user_orders = [];
    }
}
?>

<div class="page-banner">
    <div class="container">
        <h1>My Account Dashboard</h1>
        <p>Manage your account profile and view your previous orders</p>
    </div>
</div>

<div class="container" style="margin-bottom: 80px;">
    <div class="account-grid">
        <!-- User Sidebar Profile -->
        <div style="background: #fff; padding: 30px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); text-align: center; height: fit-content;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: bold; margin: 0 auto 16px;">
                <?= strtoupper(substr($user_name, 0, 1)) ?>
            </div>
            <h3 style="font-size: 1.2rem; margin-bottom: 4px;"><?= sanitize($user_name) ?></h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;"><?= sanitize($user_email) ?></p>

            <hr style="border: 0; border-top: 1px solid var(--border-color); margin-bottom: 20px;">

            <div style="display: flex; flex-direction: column; gap: 10px;">
                <a href="shop.php" class="btn btn-outline" style="font-size: 0.88rem;"><i class="fas fa-store"></i> Browse Catalog</a>
                <a href="logout.php" class="btn" style="background: #ffebee; color: #c62828; font-size: 0.88rem;"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </div>
        </div>

        <!-- Orders Section -->
        <div style="max-width: 100%; overflow-x: hidden;">
            <div style="background: #fff; padding: 30px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); max-width: 100%; overflow-x: auto;">
                <h3 style="font-size: 1.4rem; margin-bottom: 20px;">My Order History</h3>

                <?php if (count($user_orders) > 0): ?>
                    <table class="cart-table responsive-table" style="box-shadow: none; margin-bottom: 0;">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($user_orders as $order): ?>
                                <tr>
                                    <td data-label="Order #" style="font-weight: 700; color: var(--primary-color);">
                                        <span class="mobile-label">Order #</span>
                                        <?= sanitize($order['order_number']) ?>
                                    </td>
                                    <td data-label="Date" style="font-size: 0.85rem; color: var(--text-muted);">
                                        <span class="mobile-label">Date</span>
                                        <?= date('d M Y, h:i A', strtotime($order['created_at'])) ?>
                                    </td>
                                    <td data-label="Status">
                                        <span class="mobile-label">Status</span>
                                        <span class="badge" style="background: #e8f5e9; color: #2e7d32;">
                                            <?= sanitize($order['order_status']) ?>
                                        </span>
                                    </td>
                                    <td data-label="Total" style="font-weight: 700;">
                                        <span class="mobile-label">Total</span>
                                        <?= format_price($order['total_amount']) ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php else: ?>
                    <div style="text-align: center; padding: 40px 0;">
                        <i class="fas fa-box" style="font-size: 2.5rem; color: var(--secondary-color); margin-bottom: 12px;"></i>
                        <p style="color: var(--text-muted);">You haven't placed any orders yet.</p>
                        <a href="shop.php" class="btn btn-primary" style="margin-top: 16px;">Explore Products</a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
