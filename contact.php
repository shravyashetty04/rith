<?php
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/helpers.php';

$success = false;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = sanitize($_POST['name'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $phone = sanitize($_POST['phone'] ?? '');
    $subject = sanitize($_POST['subject'] ?? '');
    $message = sanitize($_POST['message'] ?? '');

    if (!empty($name) && !empty($email) && !empty($message)) {
        if ($GLOBALS['db_connected']) {
            try {
                $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$name, $email, $phone, $subject, $message]);
                $success = true;
            } catch (Exception $e) {
                $error = "Error saving message. Please try again.";
            }
        } else {
            $success = true;
        }

        if ($success) {
            $_SESSION['success_msg'] = "Thank you, <strong>$name</strong>! Your message has been sent. We will respond within 24 hours.";
            header("Location: contact.php");
            exit;
        }
    } else {
        $error = "Please fill in all required fields (Name, Email, Message).";
    }
}

require_once __DIR__ . '/includes/header.php';
?>
<style>
  .site-footer { margin-top: 0 !important; }
</style>

<div class="organic-backdrop-section">
    <div class="spice-wheat-backdrop"></div>
    
    <div class="container organic-backdrop-content" style="text-align: center; padding-top: 20px; padding-bottom: 20px;">
        <h1 style="font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 15px; color: #fff; text-shadow: 0 2px 15px rgba(0,0,0,0.6);">Contact Us & Get In Touch</h1>
        <p style="font-size: clamp(1rem, 2vw, 1.15rem); color: #fff; text-shadow: 0 2px 15px rgba(0,0,0,0.6); margin-bottom: 50px;">Have questions about our organic products or custom order inquiries? We'd love to hear from you!</p>
        <?php if (!empty($error)): ?>
            <div class="alert alert-danger"><?= $error ?></div>
        <?php endif; ?>

        <div class="contact-grid">
            <!-- Contact Form -->
            <div class="dark-card" style="max-width: 480px; margin: 0 auto; width: 100%; text-align: left;">
            <h2 style="font-size: 1.6rem; margin-bottom: 20px;">Send Us A Message</h2>

            <form action="contact.php" method="POST" style="flex: 1; display: flex; flex-direction: column;">
                <div class="form-group">
                    <label class="form-label">Your Name *</label>
                    <input type="text" name="name" class="form-control" required placeholder="Enter full name">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Email Address *</label>
                        <input type="email" name="email" class="form-control" required placeholder="name@example.com">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Phone Number</label>
                        <input type="tel" name="phone" class="form-control" placeholder="+91 98765 43210">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Subject</label>
                    <input type="text" name="subject" class="form-control" placeholder="e.g. Bulk Order Inquiry / Product Question">
                </div>

                <div class="form-group">
                    <label class="form-label">Your Message *</label>
                    <textarea name="message" rows="5" class="form-control" required placeholder="Write your message here..."></textarea>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: auto;">
                    <i class="fas fa-paper-plane"></i> Send Message
                </button>
            </form>
        </div>

        <!-- Contact Information & Address -->
        <div style="margin: 0 auto; width: 100%; max-width: 400px; height: 100%; text-align: left;">
            <div class="dark-card" style="margin-bottom: 0; justify-content: center;">
                <h3 style="color: #fff; font-size: 1.7rem; margin-bottom: 36px; text-align: center;">Store Information</h3>
                
                <div style="display: flex; gap: 20px; margin-bottom: 36px;">
                    <i class="fas fa-map-marker-alt" style="font-size: 1.6rem; color: var(--secondary-color); margin-top: 4px;"></i>
                    <div>
                        <h4 style="color: #fff; font-size: 1.15rem; margin-bottom: 8px;">Our Office & Kitchen</h4>
                        <p style="color: #d8f3dc; font-size: 1rem; line-height: 1.5;">Rithamaya Food Products<br>Bengaluru, Karnataka - 560001, India</p>
                    </div>
                </div>

                <div style="display: flex; gap: 20px; margin-bottom: 36px;">
                    <i class="fas fa-phone-alt" style="font-size: 1.6rem; color: var(--secondary-color); margin-top: 4px;"></i>
                    <div>
                        <h4 style="color: #fff; font-size: 1.15rem; margin-bottom: 8px;">Call / WhatsApp Us</h4>
                        <p style="color: #d8f3dc; font-size: 1rem;">+91 98765 43210<br>+91 98765 43211</p>
                    </div>
                </div>

                <div style="display: flex; gap: 20px;">
                    <i class="fas fa-envelope" style="font-size: 1.6rem; color: var(--secondary-color); margin-top: 4px;"></i>
                    <div>
                        <h4 style="color: #fff; font-size: 1.15rem; margin-bottom: 8px;">Email Support</h4>
                        <p style="color: #d8f3dc; font-size: 1rem;">support@rithamaya.com</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
