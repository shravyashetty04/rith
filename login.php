<?php
require_once __DIR__ . '/includes/header.php';

if (isset($_SESSION['user_id'])) {
    if (isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin') {
        header("Location: admin/index.php");
    } else {
        header("Location: account.php");
    }
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitize($_POST['customer_email_input'] ?? '');
    $password = $_POST['customer_pass_input'] ?? '';

    if (!empty($email) && !empty($password)) {
        if ($GLOBALS['db_connected']) {
            try {
                $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
                $stmt->execute([$email]);
                $user = $stmt->fetch();

                if ($user) {
                    if ($user['role'] === 'admin') {
                        $error = "Admin accounts must log in via the Admin Portal.";
                    } elseif (password_verify($password, $user['password'])) {
                        $_SESSION['user_id'] = $user['id'];
                        $_SESSION['user_name'] = $user['full_name'];
                        $_SESSION['user_email'] = $user['email'];
                        $_SESSION['user_role'] = $user['role'];
                        $_SESSION['success_msg'] = "Welcome back, <strong>" . sanitize($user['full_name']) . "</strong>!";
                        
                        header("Location: account.php");
                        exit;
                    } else {
                        $error = "Invalid password.";
                    }
                } else {
                    $error = "EMAIL DOESN'T EXIST KINDLY REGISTER";
                }
            } catch (Exception $e) {
                $error = "Database authentication error.";
            }
        } else {
            // Mock Login for customers only
            if (strpos($email, 'admin') !== false) {
                $error = "Admin accounts must log in via the Admin Portal.";
            } else {
                $_SESSION['user_id'] = 1;
                $_SESSION['user_name'] = "Ramesh Kumar";
                $_SESSION['user_email'] = $email;
                $_SESSION['user_role'] = 'customer';
                $_SESSION['success_msg'] = "Logged in (Preview Mode).";
                
                header("Location: account.php");
                exit;
            }
        }
    } else {
        $error = "Please fill in both email and password.";
    }
}
?>

<div class="container" style="margin-top: 50px; margin-bottom: 80px;">
    <div style="max-width: 440px; margin: 0 auto; background: #fff; padding: 40px; border-radius: var(--radius-lg); box-shadow: var(--shadow-md);">
        <h2 style="font-size: 1.8rem; text-align: center; margin-bottom: 8px;">Account Login</h2>
        <p style="text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 28px;">Log in to manage orders and track shipments</p>

        <?php if (!empty($error)): ?>
            <div class="alert alert-danger"><?= $error ?></div>
        <?php endif; ?>

        <form action="login.php" method="POST" autocomplete="off">
            <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input type="email" name="customer_email_input" class="form-control" required placeholder="Email address" autocomplete="off">
            </div>

            <div class="form-group">
                <label class="form-label">Password *</label>
                <input type="password" name="customer_pass_input" class="form-control" required placeholder="Password" autocomplete="new-password">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
                <i class="fas fa-sign-in-alt"></i> Login To Account
            </button>
        </form>

        <div style="text-align: center; margin-top: 24px; font-size: 0.9rem; color: var(--text-muted);">
            Don't have an account yet? <a href="register.php" style="color: var(--primary-color); font-weight: 700;">Register Here</a>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
