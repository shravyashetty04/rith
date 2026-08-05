<?php
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/helpers.php';

$cart_items = $_SESSION['cart'] ?? [];
if (empty($cart_items)) {
    header("Location: shop.php");
    exit;
}

$subtotal = get_cart_total();
$shipping = $subtotal > 499 ? 0.00 : 50.00;
$grand_total = $subtotal + $shipping;

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name = sanitize($_POST['full_name'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $phone = sanitize($_POST['phone'] ?? '');
    $address = sanitize($_POST['address'] ?? '');
    $payment_method = sanitize($_POST['payment_method'] ?? 'Cash on Delivery');

    if (empty($full_name)) $errors[] = "Full Name is required.";
    if (empty($email)) $errors[] = "Email address is required.";
    if (empty($phone)) $errors[] = "Phone number is required.";
    if (empty($address)) $errors[] = "Delivery address is required.";

    if (empty($errors)) {
        $order_number = 'RM-' . strtoupper(uniqid());
        $user_id = $_SESSION['user_id'] ?? null;

        if ($GLOBALS['db_connected']) {
            try {
                $stmt = $pdo->prepare("INSERT INTO orders (user_id, order_number, full_name, email, phone, address, total_amount, payment_method, payment_status, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'Processing')");
                $stmt->execute([$user_id, $order_number, $full_name, $email, $phone, $address, $grand_total, $payment_method]);
                $order_id = $pdo->lastInsertId();

                $item_stmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)");
                foreach ($cart_items as $item) {
                    $item_stmt->execute([$order_id, $item['id'], $item['name'], $item['quantity'], $item['price']]);
                }
            } catch (Exception $e) {
                // Fallback handle
                $order_id = time();
            }
        } else {
            $order_id = time();
        }

        // Save order details to session for confirmation page & clear cart
        $_SESSION['last_order'] = [
            'order_number' => $order_number,
            'full_name' => $full_name,
            'email' => $email,
            'phone' => $phone,
            'address' => $address,
            'total_amount' => $grand_total,
            'payment_method' => $payment_method,
            'items' => $cart_items
        ];

        $_SESSION['cart'] = [];
        header("Location: order_success.php?order=" . urlencode($order_number));
        exit;
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="page-banner">
    <div class="container">
        <h1>Checkout & Delivery</h1>
        <p>Enter your delivery details to complete your order</p>
    </div>
</div>

<div class="container" style="margin-bottom: 70px;">
    <?php if (!empty($errors)): ?>
        <div class="alert alert-danger">
            <ul>
                <?php foreach ($errors as $err): ?>
                    <li><?= $err ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <form action="checkout.php" method="POST" class="checkout-grid">
        <!-- Customer Delivery Form -->
        <div style="background: #fff; padding: 30px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
            <h3 style="margin-bottom: 20px; font-size: 1.3rem;">1. Shipping Information</h3>

            <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input type="text" name="full_name" class="form-control" required placeholder="e.g. Ramesh Kumar" value="<?= sanitize($_SESSION['user_name'] ?? '') ?>">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="form-group">
                    <label class="form-label">Email Address *</label>
                    <input type="email" name="email" class="form-control" required placeholder="you@example.com" value="<?= sanitize($_SESSION['user_email'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label class="form-label">Phone Number *</label>
                    <input type="tel" name="phone" class="form-control" required placeholder="+91 98765 43210">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Complete Shipping Address *</label>
                <textarea name="address" rows="4" class="form-control" required placeholder="House No, Street, Landmark, City, State, Pincode"></textarea>
            </div>

            <style>
                .payment-option {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    padding: 16px 20px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    cursor: pointer;
                    background: #fff;
                    transition: all 0.2s ease;
                }
                .payment-option.active {
                    border: 1px solid #1b4332;
                    background: #f5f6f1;
                }
                .payment-option input[type="radio"] {
                    margin-top: 4px;
                    accent-color: #1b4332;
                    transform: scale(1.2);
                }
                .payment-content strong {
                    display: block;
                    font-size: 1.05rem;
                    color: #222;
                    margin-bottom: 4px;
                }
                .payment-content p {
                    font-size: 0.85rem;
                    color: #666;
                    margin: 0;
                }
                .payment-icons {
                    display: flex;
                    gap: 8px;
                    margin-top: 10px;
                    align-items: center;
                }
                .payment-icons i {
                    font-size: 1.5rem;
                }
                .payment-icons .fa-google-pay { color: #4285f4; }
                .payment-icons .fa-cc-visa { color: #1a1f71; }
                .payment-icons .fa-cc-mastercard { color: #eb001b; }
            </style>

            <h3 style="margin: 30px 0 20px; font-size: 1.3rem; display: flex; align-items: center; gap: 10px;">
                <span style="background: #1b4332; color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem;">2</span> 
                Payment Method
            </h3>
            <div style="display: flex; flex-direction: column; gap: 12px;" id="payment-methods-container">
                
                <label class="payment-option active">
                    <input type="radio" name="payment_method" value="UPI" checked onchange="updatePaymentUI()">
                    <div class="payment-content">
                        <strong>UPI (Google Pay, PhonePe, Paytm, BHIM)</strong>
                        <p>Pay instantly using your favorite UPI app</p>
                        <div class="payment-icons">
                            <span style="color: #4285f4; font-weight: bold; font-size: 0.9rem;">GPay</span>
                            <span style="color: #5e35b1; font-weight: bold; font-size: 0.9rem; margin-left: 8px;">PhonePe</span>
                            <span style="color: #00baf2; font-weight: bold; font-size: 0.9rem; margin-left: 8px;">Paytm</span>
                        </div>
                    </div>
                </label>

                <label class="payment-option">
                    <input type="radio" name="payment_method" value="Card" onchange="updatePaymentUI()">
                    <div class="payment-content">
                        <strong>Credit / Debit Card</strong>
                        <p>Visa, MasterCard, RuPay, Maestro</p>
                        <div class="payment-icons">
                            <i class="fab fa-cc-visa"></i>
                            <i class="fab fa-cc-mastercard"></i>
                        </div>
                    </div>
                </label>

                <label class="payment-option">
                    <input type="radio" name="payment_method" value="Net Banking" onchange="updatePaymentUI()">
                    <div class="payment-content">
                        <strong>Net Banking</strong>
                        <p>All major Indian banks supported</p>
                    </div>
                </label>

                <label class="payment-option">
                    <input type="radio" name="payment_method" value="Wallets" onchange="updatePaymentUI()">
                    <div class="payment-content">
                        <strong>Wallets (Amazon Pay, MobiKwik, etc.)</strong>
                    </div>
                </label>

                <label class="payment-option">
                    <input type="radio" name="payment_method" value="Cash on Delivery" onchange="updatePaymentUI()">
                    <div class="payment-content">
                        <strong>Cash on Delivery (COD)</strong>
                        <p>Pay in cash when your order arrives</p>
                    </div>
                </label>
            </div>

            <script>
                function updatePaymentUI() {
                    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('active'));
                    const selected = document.querySelector('input[name="payment_method"]:checked');
                    if(selected) {
                        selected.closest('.payment-option').classList.add('active');
                    }
                }
            </script>
        </div>

        <!-- Order Summary Box -->
        <div>
            <div class="cart-summary-card">
                <h3 style="margin-bottom: 20px; font-size: 1.3rem;">Order Overview</h3>

                <div style="max-height: 240px; overflow-y: auto; margin-bottom: 20px;">
                    <?php foreach ($cart_items as $item): ?>
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed var(--border-color);">
                            <div>
                                <h4 style="font-size: 0.88rem;"><?= sanitize($item['name']) ?></h4>
                                <span style="font-size: 0.78rem; color: var(--text-muted);">Qty: <?= $item['quantity'] ?> × <?= format_price($item['price']) ?></span>
                            </div>
                            <span style="font-weight: 600; font-size: 0.9rem;"><?= format_price((float)$item['price'] * (int)$item['quantity']) ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="summary-row">
                    <span>Subtotal</span>
                    <span><?= format_price($subtotal) ?></span>
                </div>

                <div class="summary-row">
                    <span>Shipping</span>
                    <span><?= $shipping == 0 ? '<span style="color:green; font-weight:600;">FREE</span>' : format_price($shipping) ?></span>
                </div>

                <div class="summary-row total" style="color: var(--accent-color);">
                    <span>Order Total:</span>
                    <span><?= format_price($grand_total) ?></span>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 24px;">
                    <i class="fas fa-lock"></i> Place Your Order
                </button>
            </div>
        </div>
    </form>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
