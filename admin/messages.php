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

// Handle delete
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete_msg') {
    $msg_id = (int)$_POST['msg_id'];
    $stmt = $pdo->prepare("DELETE FROM contact_messages WHERE id = ?");
    $stmt->execute([$msg_id]);
    header("Location: messages.php");
    exit;
}

// Fetch real messages from database
$messages = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Messages | Admin Panel</title>
    <link rel="stylesheet" href="../assets/css/admin.css?v=5">
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
                
                <a href="orders.php" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-shopping-cart"></i></div>
                    <div class="nav-text">Customer Orders</div>
                </a>
                
                <a href="messages.php" class="nav-item active">
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
                <h1 class="page-title">Customer Support Messages</h1>
                <p class="page-subtitle">View and respond to inquiries from the contact form</p>
            </div>

            <!-- Table Card (Desktop Only) -->
            <div class="table-card desktop-messages-table">
                <table class="admin-table messages-table">
                    <thead>
                        <tr>
                            <th>Msg ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Subject</th>
                            <th>Message Preview</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach($messages as $m): ?>
                        <tr>
                            <td class="td-order-id">#<?= $m['id'] ?></td>
                            <td class="td-gray-stack">
                                <?= date('d M Y', strtotime($m['created_at'])) ?><br>
                                <span><?= date('h:i A', strtotime($m['created_at'])) ?></span>
                            </td>
                            <td class="td-customer-stack">
                                <div class="cust-name"><?= htmlspecialchars($m['name']) ?></div>
                                <div class="cust-contact"><?= htmlspecialchars($m['email']) ?></div>
                            </td>
                            <td class="td-name" style="max-width: 150px;"><?= htmlspecialchars($m['subject']) ?></td>
                            <td class="td-gray" style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                <?= htmlspecialchars($m['message']) ?>
                            </td>
                            <td>
                                <span class="badge-processing" style="background:#E3F2FD; color:#1565C0;">UNREAD</span>
                            </td>
                            <td class="td-actions" style="flex-direction: row; width: auto;">
                                <button type="button" class="btn-action-edit" title="View" onclick="viewMessage(this.dataset.name, this.dataset.email, this.dataset.subject, this.dataset.message)" data-name="<?= htmlspecialchars($m['name']) ?>" data-email="<?= htmlspecialchars($m['email']) ?>" data-subject="<?= htmlspecialchars($m['subject']) ?>" data-message="<?= htmlspecialchars($m['message']) ?>"><i class="fas fa-eye"></i></button>
                                <form method="POST" style="display:inline;" onsubmit="return confirm('Are you sure you want to delete this message?');">
                                    <input type="hidden" name="action" value="delete_msg">
                                    <input type="hidden" name="msg_id" value="<?= $m['id'] ?>">
                                    <button type="submit" class="btn-action-delete" title="Delete"><i class="fas fa-trash-alt"></i></button>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <!-- Mobile Cards (Mobile Only) -->
            <div class="mobile-messages-list">
                <?php foreach($messages as $m): ?>
                <div class="mobile-message-card">
                    <div class="mmc-header">
                        <div class="mmc-id">#<?= $m['id'] ?></div>
                        <div class="mmc-status">UNREAD</div>
                    </div>
                    <div class="mmc-date">
                        <?= date('d M Y, h:i A', strtotime($m['created_at'])) ?>
                    </div>
                    <div class="mmc-customer">
                        <div class="mmc-name"><?= htmlspecialchars($m['name']) ?></div>
                        <div class="mmc-email"><?= htmlspecialchars($m['email']) ?></div>
                    </div>
                    <div class="mmc-section">
                        <div class="mmc-label">SUBJECT</div>
                        <div class="mmc-box"><?= htmlspecialchars($m['subject']) ?></div>
                    </div>
                    <div class="mmc-section">
                        <div class="mmc-label">MESSAGE</div>
                        <div class="mmc-box mmc-preview"><?= htmlspecialchars($m['message']) ?></div>
                    </div>
                    <div class="mmc-actions">
                        <button type="button" class="mmc-btn mmc-view" onclick="viewMessage(this.dataset.name, this.dataset.email, this.dataset.subject, this.dataset.message)" data-name="<?= htmlspecialchars($m['name']) ?>" data-email="<?= htmlspecialchars($m['email']) ?>" data-subject="<?= htmlspecialchars($m['subject']) ?>" data-message="<?= htmlspecialchars($m['message']) ?>"><i class="fas fa-eye"></i> View</button>
                        <form method="POST" style="margin: 0;">
                            <input type="hidden" name="action" value="delete_msg">
                            <input type="hidden" name="msg_id" value="<?= $m['id'] ?>">
                            <button type="submit" class="mmc-btn mmc-delete"><i class="fas fa-trash-alt"></i> Delete</button>
                        </form>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </main>
    </div>

    <!-- Message View Modal -->
    <dialog id="viewMessageModal" style="border: none; border-radius: 12px; padding: 25px; max-width: 550px; width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; color: var(--forest-green); font-size: 1.4rem;"><i class="fas fa-envelope-open-text"></i> Message Details</h3>
            <button onclick="document.getElementById('viewMessageModal').close()" style="background: rgba(0,0,0,0.05); border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; color: #555; display: flex; align-items: center; justify-content: center;"><i class="fas fa-times"></i></button>
        </div>
        <div style="margin-bottom: 12px; font-size: 0.95rem;"><strong>From:</strong> <span id="modal-name"></span> &lt;<a href="#" id="modal-email" style="color: var(--forest-green); text-decoration: none;"></a>&gt;</div>
        <div style="margin-bottom: 20px; font-size: 0.95rem;"><strong>Subject:</strong> <span id="modal-subject"></span></div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #eee; white-space: pre-wrap; font-size: 0.95rem; color: #444; line-height: 1.6;" id="modal-body"></div>
    </dialog>

    <script>
    function viewMessage(name, email, subject, message) {
        document.getElementById('modal-name').textContent = name;
        document.getElementById('modal-email').textContent = email;
        document.getElementById('modal-email').href = "mailto:" + email;
        document.getElementById('modal-subject').textContent = subject;
        document.getElementById('modal-body').textContent = message;
        document.getElementById('viewMessageModal').showModal();
    }
    </script>
</body>
</html>
