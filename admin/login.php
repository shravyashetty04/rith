<?php
session_start();
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/helpers.php';

if (isset($_SESSION['user_id']) && isset($_SESSION['user_role']) && in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    header("Location: index.php");
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitize($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (!empty($email) && !empty($password)) {
        if ($GLOBALS['db_connected']) {
            try {
                // Auto-create admin & superadmin users for testing if they don't exist
                $test_accounts = [
                    'admin@rithamaya.com' => ['name' => 'Admin User', 'role' => 'admin'],
                    'superadmin@rithamaya.com' => ['name' => 'Super Admin', 'role' => 'superadmin']
                ];
                
                if (isset($test_accounts[$email])) {
                    $check = $pdo->prepare("SELECT * FROM users WHERE email = ?");
                    $check->execute([$email]);
                    if (!$check->fetch()) {
                        $insert = $pdo->prepare("INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)");
                        $insert->execute([$test_accounts[$email]['name'], $email, password_hash('admin123', PASSWORD_DEFAULT), $test_accounts[$email]['role']]);
                    }
                }

                $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND role IN ('admin', 'superadmin')");
                $stmt->execute([$email]);
                $user = $stmt->fetch();

                if ($user && password_verify($password, $user['password'])) {
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['user_name'] = $user['full_name'];
                    $_SESSION['user_email'] = $user['email'];
                    $_SESSION['user_role'] = $user['role'];
                    $_SESSION['success_msg'] = "Welcome back to the Admin Dashboard!";
                    header("Location: index.php");
                    exit;
                } else {
                    $error = "Invalid admin credentials or you do not have permission.";
                }
            } catch (Exception $e) {
                $error = "Database authentication error: " . $e->getMessage();
            }
        } else {
            // Mock Login
            if (strpos($email, 'superadmin') !== false) {
                $_SESSION['user_id'] = 2;
                $_SESSION['user_name'] = "Super Admin";
                $_SESSION['user_email'] = $email;
                $_SESSION['user_role'] = 'superadmin';
                $_SESSION['success_msg'] = "Logged into Super Admin (Preview Mode).";
                header("Location: index.php");
                exit;
            } elseif (strpos($email, 'admin') !== false) {
                $_SESSION['user_id'] = 1;
                $_SESSION['user_name'] = "Admin User";
                $_SESSION['user_email'] = $email;
                $_SESSION['user_role'] = 'admin';
                $_SESSION['success_msg'] = "Logged into Admin (Preview Mode).";
                header("Location: index.php");
                exit;
            } else {
                $error = "Please use an admin email address (e.g. admin@rithamaya.com or superadmin@rithamaya.com).";
            }
        }
    } else {
        $error = "Please fill in both email and password.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login | Ritahamaya</title>
    <link rel="stylesheet" href="../assets/css/admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .admin-login-wrapper {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .admin-login-card {
            background: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.9);
            border-radius: 30px;
            padding: 50px 40px;
            width: 100%;
            max-width: 450px;
            box-shadow: 0 15px 50px rgba(27, 94, 32, 0.1);
            position: relative;
            z-index: 10;
        }
        .admin-login-logo {
            text-align: center;
            margin-bottom: 10px;
        }
        .admin-login-logo img {
            width: 160px;
            margin-bottom: 0;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        .admin-login-logo h2 {
            margin-top: 5px;
            margin-bottom: 5px;
        }
        .form-group {
            margin-bottom: 25px;
        }
        .form-label {
            display: block;
            margin-bottom: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--forest-green);
        }
        .form-control {
            width: 100%;
            padding: 14px 20px;
            border: 2px solid rgba(27, 94, 32, 0.1);
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.9);
            font-size: 1rem;
            transition: all 0.3s;
            outline: none;
            color: var(--text-main);
        }
        .form-control:focus {
            border-color: var(--champagne-gold);
            box-shadow: 0 0 0 4px rgba(200, 155, 60, 0.1);
        }
        .btn-primary {
            width: 100%;
            padding: 15px;
            background: var(--forest-green);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.05rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(27, 94, 32, 0.2);
        }
        .alert-danger {
            background: rgba(244, 67, 54, 0.1);
            color: #d32f2f;
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 25px;
            font-size: 0.9rem;
            font-weight: 500;
            border: 1px solid rgba(244, 67, 54, 0.2);
        }
    </style>
</head>
<body>
    <div class="bg-particles"></div>
    
    <div class="admin-login-wrapper">
        <div class="admin-login-card">
            <div class="admin-login-logo">
                <img src="../assets/images/logo.png" alt="Ritahamaya Logo">
                <h2 style="color: var(--forest-green); font-size: 1.8rem; font-weight: 700;">Admin Portal</h2>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 5px;">Sign in to manage your store</p>
            </div>

            <?php if (!empty($error)): ?>
                <div class="alert-danger"><i class="fas fa-exclamation-circle"></i> <?= $error ?></div>
            <?php endif; ?>

            <form action="login.php" method="POST">
                <div class="form-group">
                    <label class="form-label">Admin Email</label>
                    <input type="email" name="email" class="form-control" value="admin@rithamaya.com" placeholder="admin@rithamaya.com" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" name="password" class="form-control" value="admin123" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn-primary">
                    Sign In <i class="fas fa-arrow-right"></i>
                </button>
                <div style="text-align: center; margin-top: 25px;">
                    <a href="../index.php" style="color: var(--text-muted); font-size: 0.9rem; text-decoration: none; font-weight: 500;"><i class="fas fa-store"></i> Back to Main Website</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
