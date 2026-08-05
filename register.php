<?php
require_once __DIR__ . '/includes/header.php';

if (isset($_SESSION['user_id'])) {
    header("Location: account.php");
    exit;
}

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name = sanitize($_POST['full_name'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $phone = sanitize($_POST['phone'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    if (empty($full_name)) $errors[] = "Full name is required.";
    if (empty($email)) $errors[] = "Email address is required.";
    if (strlen($password) < 6) $errors[] = "Password must be at least 6 characters.";
    if ($password !== $confirm_password) $errors[] = "Passwords do not match.";

    if (empty($errors)) {
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);

        if ($GLOBALS['db_connected']) {
            try {
                // Check if email exists
                $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
                $check->execute([$email]);
                if ($check->fetch()) {
                    $errors[] = "EMAIL ALREADY EXIST KINDLY LOGIN";
                } else {
                    $stmt = $pdo->prepare("INSERT INTO users (full_name, email, phone, password, role) VALUES (?, ?, ?, ?, 'customer')");
                    $stmt->execute([$full_name, $email, $phone, $hashed_password]);
                    $user_id = $pdo->lastInsertId();

                    $_SESSION['user_id'] = $user_id;
                    $_SESSION['user_name'] = $full_name;
                    $_SESSION['user_email'] = $email;
                    $_SESSION['user_role'] = 'customer';
                    $_SESSION['success_msg'] = "Registration successful! Welcome to Rithamaya.";
                    header("Location: account.php");
                    exit;
                }
            } catch (Exception $e) {
                $errors[] = "Registration failed. Please try again.";
            }
        } else {
            $_SESSION['user_id'] = time();
            $_SESSION['user_name'] = $full_name;
            $_SESSION['user_email'] = $email;
            $_SESSION['user_role'] = 'customer';
            $_SESSION['success_msg'] = "Account registered (Preview Mode).";
            header("Location: account.php");
            exit;
        }
    }
}
?>

<div class="container" style="margin-top: 50px; margin-bottom: 80px;">
    <div style="max-width: 480px; margin: 0 auto; background: #fff; padding: 40px; border-radius: var(--radius-lg); box-shadow: var(--shadow-md);">
        <h2 style="font-size: 1.8rem; text-align: center; margin-bottom: 8px;">Create New Account</h2>
        <p style="text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 28px;">Join Rithamaya for easy ordering and exclusive offers</p>

        <?php if (!empty($errors)): ?>
            <div class="alert alert-danger">
                <ul>
                    <?php foreach ($errors as $err): ?>
                        <li><?= $err ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <form action="register.php" method="POST">
            <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input type="text" name="full_name" class="form-control" required placeholder="e.g. Ramesh Kumar">
            </div>

            <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input type="email" name="email" class="form-control" required placeholder="name@example.com">
            </div>

            <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="tel" name="phone" class="form-control" placeholder="+91 98765 43210">
            </div>

            <div class="form-group">
                <label class="form-label">Password *</label>
                <input type="password" name="password" class="form-control" required placeholder="Minimum 6 characters">
            </div>

            <div class="form-group">
                <label class="form-label">Confirm Password *</label>
                <input type="password" name="confirm_password" class="form-control" required placeholder="Repeat password">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
                <i class="fas fa-user-plus"></i> Create Account
            </button>
        </form>

        <div style="text-align: center; margin-top: 24px; font-size: 0.9rem; color: var(--text-muted);">
            Already registered? <a href="login.php" style="color: var(--primary-color); font-weight: 700;">Login Here</a>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
