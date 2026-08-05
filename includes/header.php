<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/helpers.php';
$cart_count = get_cart_count();
$current_page = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rithamaya Food Products | 100% Organic & Healthy</title>
    <meta name="description" content="Pure organic masalas, health mixes, baby ragi sari, and homemade traditional spices. Shop Rithamaya for fresh nutrition.">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Main Style CSS -->
    <link rel="stylesheet" href="assets/css/style.css?v=<?= time() ?>">
</head>
<body>

    <!-- Single Moving Announcement Ticker Bar -->
    <div class="top-ticker-bar">
        <div class="ticker-track">
            <div class="ticker-content">
                <span>🌿 100% Pure Organic & Homemade</span>
                <span>📞 Call / WhatsApp: <a href="tel:+919876543210">+91 98765 43210</a></span>
                <span>🔥 Get <strong>10% OFF</strong> on 35+ Multigrain Health Mix! Code: <strong>RITHAMAYA10</strong></span>
                <span>🚚 Free Delivery Above ₹499</span>
                <span>📜 FSSAI Lic. No: <strong>21223000000000</strong></span>
                <span>👶 Natural Sprouted Baby Ragi Sari</span>
            </div>
            <div class="ticker-content">
                <span>🌿 100% Pure Organic & Homemade</span>
                <span>📞 Call / WhatsApp: <a href="tel:+919876543210">+91 98765 43210</a></span>
                <span>🔥 Get <strong>10% OFF</strong> on 35+ Multigrain Health Mix! Code: <strong>RITHAMAYA10</strong></span>
                <span>🚚 Free Delivery Above ₹499</span>
                <span>📜 FSSAI Lic. No: <strong>21223000000000</strong></span>
                <span>👶 Natural Sprouted Baby Ragi Sari</span>
            </div>
        </div>
    </div>

    <!-- Main Header Navbar -->
    <header class="main-header">
        <div class="container" style="max-width: 1200px;">
            <div class="header-wrapper">
                <!-- Brand Logo -->
                <a href="index.php" class="logo">
                    <img src="assets/images/logo.png?v=<?= time() ?>" alt="Rithamaya Logo" class="brand-logo-img">
                </a>

                <!-- Navigation Links -->
                <ul class="nav-menu">
                    <li><a href="index.php" class="nav-link <?= $current_page == 'index.php' ? 'active' : '' ?>">Home</a></li>
                    <li><a href="shop.php" class="nav-link <?= $current_page == 'shop.php' ? 'active' : '' ?>">Shop Products</a></li>
                    <li><a href="about.php" class="nav-link <?= $current_page == 'about.php' ? 'active' : '' ?>">About Us</a></li>
                    <li><a href="contact.php" class="nav-link <?= $current_page == 'contact.php' ? 'active' : '' ?>">Contact Us</a></li>
                    
                    <?php if (isset($_SESSION['user_id'])): ?>
                        <li class="mobile-only-nav"><a href="account.php" class="nav-link <?= $current_page == 'account.php' ? 'active' : '' ?>"><i class="fas fa-user-check nav-icon"></i> My Account</a></li>
                        <li class="mobile-only-nav"><a href="logout.php" class="nav-link"><i class="fas fa-sign-out-alt nav-icon"></i> Logout</a></li>
                    <?php else: ?>
                        <li class="mobile-only-nav"><a href="login.php" class="nav-link <?= $current_page == 'login.php' ? 'active' : '' ?>"><i class="fas fa-user nav-icon"></i> Login / Register</a></li>
                    <?php endif; ?>
                </ul>

                <!-- Header Action Icons -->
                <div class="header-actions">
                    <form action="shop.php" method="GET" class="search-form">
                        <input type="text" name="q" placeholder="Search masalas..." class="search-input">
                        <button type="submit" class="search-btn"><i class="fas fa-search"></i></button>
                    </form>

                    <?php if (isset($_SESSION['user_id'])): ?>
                        <a href="account.php" class="action-btn desktop-only-action" title="My Account">
                            <i class="fas fa-user-check"></i>
                        </a>
                        <a href="logout.php" class="action-btn desktop-only-action" title="Logout">
                            <i class="fas fa-sign-out-alt"></i>
                        </a>
                    <?php else: ?>
                        <a href="login.php" class="action-btn desktop-only-action" title="Login / Register">
                            <i class="fas fa-user"></i>
                        </a>
                    <?php endif; ?>

                    <a href="cart.php" class="action-btn" title="Shopping Cart">
                        <i class="fas fa-shopping-basket"></i>
                        <span class="badge-count"><?= $cart_count ?></span>
                    </a>

                    <div class="mobile-toggle">
                        <i class="fas fa-bars"></i>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Flash Message Container -->
    <?php if (isset($_SESSION['success_msg']) || isset($_SESSION['error_msg']) || !$GLOBALS['db_connected']): ?>
    <div class="container flash-message-wrapper">
        <?php if (isset($_SESSION['success_msg'])): ?>
            <div class="alert alert-success" style="margin-top: 20px;">
                <span><i class="fas fa-check-circle"></i> <?= $_SESSION['success_msg']; ?></span>
                <i class="fas fa-times" style="cursor:pointer;" onclick="this.closest('.flash-message-wrapper').remove();"></i>
            </div>
            <?php unset($_SESSION['success_msg']); ?>
        <?php endif; ?>

        <?php if (isset($_SESSION['error_msg'])): ?>
            <div class="alert alert-danger" style="margin-top: 20px;">
                <span><i class="fas fa-exclamation-circle"></i> <?= $_SESSION['error_msg']; ?></span>
                <i class="fas fa-times" style="cursor:pointer;" onclick="this.closest('.flash-message-wrapper').remove();"></i>
            </div>
            <?php unset($_SESSION['error_msg']); ?>
        <?php endif; ?>

        <?php if (!$GLOBALS['db_connected']): ?>
            <div class="alert alert-info" style="margin-top: 20px;">
                <span><i class="fas fa-info-circle"></i> <strong>Note:</strong> Running in fallback preview mode. To connect live MySQL, start XAMPP MySQL and import <code>database.sql</code> into database <code>rithamaya_db</code>.</span>
            </div>
        <?php endif; ?>
    </div>
    <?php endif; ?>
