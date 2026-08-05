<?php
require_once __DIR__ . '/includes/header.php';

$order = $_SESSION['last_order'] ?? null;
$order_number = isset($_GET['order']) ? sanitize($_GET['order']) : ($order['order_number'] ?? 'RM-ORDER');

if ($order && isset($order['order_number']) && $GLOBALS['db_connected']) {
    $stmt = $pdo->prepare("SELECT order_status FROM orders WHERE order_number = ?");
    $stmt->execute([$order['order_number']]);
    $db_status = $stmt->fetchColumn();
    if ($db_status) {
        $order['order_status'] = $db_status;
    }
}
?>

<style>
    .tracker-text { font-size: 0.8rem; }
    @media (max-width: 480px) {
        .tracker-text { font-size: 0.6rem; word-break: break-word; }
    }
</style>
<div class="container" style="margin-top: 60px; margin-bottom: 80px;">
    <div style="max-width: 680px; margin: 0 auto; background: #fff; padding: 40px; border-radius: var(--radius-lg); box-shadow: var(--shadow-md); text-align: center;">
        <div style="width: 70px; height: 70px; background: #e8f5e9; color: #2e7d32; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 20px;">
            <i class="fas fa-check"></i>
        </div>

        <h1 style="font-size: 2rem; color: var(--primary-color); margin-bottom: 8px;">Order Placed Successfully!</h1>
        <p style="color: var(--text-muted); font-size: 1rem; margin-bottom: 24px;">
            Thank you for shopping with Rithamaya. Your order reference number is: <strong style="color: var(--secondary-color);"><?= $order_number ?></strong>
        </p>

        <?php if ($order): ?>
            <div style="background: #fdfbf7; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; text-align: left; margin-bottom: 20px;">
                <h3 style="font-size: 1.1rem; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Order Details</h3>
                <p style="font-size: 0.9rem; margin-bottom: 6px;"><strong>Recipient:</strong> <?= sanitize($order['full_name']) ?></p>
                <p style="font-size: 0.9rem; margin-bottom: 6px;"><strong>Phone:</strong> <?= sanitize($order['phone']) ?></p>
                <p style="font-size: 0.9rem; margin-bottom: 6px;"><strong>Shipping Address:</strong> <?= sanitize($order['address']) ?></p>
                <p style="font-size: 0.9rem; margin-bottom: 6px;"><strong>Payment Method:</strong> <?= sanitize($order['payment_method']) ?></p>
                <p style="font-size: 0.9rem; font-weight: 700; color: var(--primary-color); margin-top: 10px;">Total Paid / Due: <?= format_price($order['total_amount']) ?></p>
            </div>

            <!-- Estimated Delivery Tracker -->
            <?php
            $est_start = date('l, d F Y', strtotime('+3 days'));
            $est_end = date('l, d F Y', strtotime('+5 days'));
            $placed_date_short = date('M d');
            ?>
            <div style="background: #fff; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; text-align: left; margin-bottom: 30px;">
                <h3 style="font-size: 1.1rem; margin-bottom: 12px; color: #000;">Estimated Delivery</h3>
                <p style="font-size: 1.05rem; color: #b77b3b; font-weight: 600; margin-bottom: 30px; line-height: 1.4;">
                    <?= $est_start ?> - <?= $est_end ?>
                </p>
                
                <!-- Timeline Tracker -->
                <?php
                $status = strtolower($order['order_status'] ?? 'processing');
                $t_width = '0%';
                $t_processing = false;
                $t_shipped = false;
                $t_delivered = false;
                
                if ($status === 'processing') {
                    // When order is just placed, it's technically in 'processing' state in DB
                    // But visually we only want 'Order Placed' to be lit up.
                    $t_width = '0%';
                    $t_processing = false;
                } else if ($status === 'shipped') {
                    $t_width = '66%';
                    $t_processing = true;
                    $t_shipped = true;
                } else if ($status === 'delivered') {
                    $t_width = '100%';
                    $t_processing = true;
                    $t_shipped = true;
                    $t_delivered = true;
                }
                ?>
                <div style="display: flex; align-items: flex-start; justify-content: space-between; position: relative; margin-bottom: 10px; padding: 0;">
                    <!-- Line background -->
                    <div style="position: absolute; top: 12px; left: 12%; right: 12%; height: 3px; background: #e0e0e0; z-index: 1;"></div>
                    <!-- Active Line background -->
                    <div style="position: absolute; top: 12px; left: 12%; width: <?= $t_width ?>; max-width: 76%; height: 3px; background: var(--primary-color); z-index: 1; transition: width 0.3s;"></div>

                    <!-- Step 1: Order Placed -->
                    <div style="position: relative; z-index: 2; text-align: center; flex: 1;">
                        <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--primary-color); border: 3px solid #fff; box-shadow: 0 0 0 2px var(--primary-color); margin: 0 auto 8px;"></div>
                        <div class="tracker-text" style="font-weight: 700; color: var(--primary-color); line-height: 1.2;">Order<br>Placed</div>
                        <div style="font-size: 0.65rem; color: #888; margin-top: 4px;"><?= $placed_date_short ?></div>
                    </div>
                    
                    <!-- Step 2: Processing -->
                    <div style="position: relative; z-index: 2; text-align: center; flex: 1;">
                        <?php if ($t_processing): ?>
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--primary-color); border: 3px solid #fff; box-shadow: 0 0 0 2px var(--primary-color); margin: 0 auto 8px;"></div>
                            <div class="tracker-text" style="font-weight: 700; color: var(--primary-color); line-height: 1.2;">Processing</div>
                        <?php else: ?>
                            <div style="width: 20px; height: 20px; border-radius: 50%; background: #e0e0e0; margin: 4px auto 10px;"></div>
                            <div class="tracker-text" style="font-weight: 500; color: #555; line-height: 1.2;">Processing</div>
                        <?php endif; ?>
                    </div>
                    
                    <!-- Step 3: Shipped -->
                    <div style="position: relative; z-index: 2; text-align: center; flex: 1;">
                        <?php if ($t_shipped): ?>
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--primary-color); border: 3px solid #fff; box-shadow: 0 0 0 2px var(--primary-color); margin: 0 auto 8px;"></div>
                            <div class="tracker-text" style="font-weight: 700; color: var(--primary-color); line-height: 1.2;">Shipped</div>
                        <?php else: ?>
                            <div style="width: 20px; height: 20px; border-radius: 50%; background: #e0e0e0; margin: 4px auto 10px;"></div>
                            <div class="tracker-text" style="font-weight: 500; color: #555; line-height: 1.2;">Shipped</div>
                        <?php endif; ?>
                    </div>
                    
                    <!-- Step 4: Delivered -->
                    <div style="position: relative; z-index: 2; text-align: center; flex: 1;">
                        <?php if ($t_delivered): ?>
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--primary-color); border: 3px solid #fff; box-shadow: 0 0 0 2px var(--primary-color); margin: 0 auto 8px;"></div>
                            <div class="tracker-text" style="font-weight: 700; color: var(--primary-color); line-height: 1.2;">Delivered</div>
                        <?php else: ?>
                            <div style="width: 20px; height: 20px; border-radius: 50%; background: #e0e0e0; margin: 4px auto 10px;"></div>
                            <div class="tracker-text" style="font-weight: 500; color: #555; line-height: 1.2;">Delivered</div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <?php if ($order && $order['payment_method'] === 'UPI / Online Payment'): ?>
            <div style="background: #fffcf2; border: 1px dashed #f5b041; border-radius: var(--radius-md); padding: 24px; text-align: center; margin-bottom: 30px;">
                <h3 style="color: #d68910; margin-bottom: 12px; font-size: 1.2rem;"><i class="fas fa-qrcode"></i> Complete Your Payment</h3>
                <p style="font-size: 0.95rem; color: #555; margin-bottom: 16px;">
                    Scan the QR code using any UPI app (GPay, PhonePe, Paytm) to pay <strong><?= format_price($order['total_amount']) ?></strong>.
                </p>
                <?php
                    // Dynamic UPI String Generation
                    $upi_id = "merchant@upi"; // Replace with actual business UPI ID
                    $upi_name = "Rithamaya";
                    $amount = $order['total_amount'];
                    $order_note = "Order " . $order_number;
                    $upi_string = "upi://pay?pa={$upi_id}&pn=" . urlencode($upi_name) . "&am={$amount}&cu=INR&tn=" . urlencode($order_note);
                    $qr_url = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" . urlencode($upi_string);
                ?>
                <img src="<?= $qr_url ?>" alt="UPI QR Code" style="width: 200px; height: 200px; border: 10px solid #fff; box-shadow: var(--shadow-sm); border-radius: 12px; margin-bottom: 15px;">
                <p style="font-size: 0.85rem; color: var(--text-muted);">
                    Once paid, we will verify the transaction and process your order immediately.<br>
                    <strong>UPI ID:</strong> <?= $upi_id ?>
                </p>
            </div>
        <?php endif; ?>

        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <a href="shop.php" class="btn btn-primary"><i class="fas fa-store"></i> Continue Shopping</a>
            <a href="index.php" class="btn btn-outline">Back to Home</a>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
