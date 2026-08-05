<?php
session_start();

// Destroy all session variables
$_SESSION = [];
session_destroy();

// Redirect back to admin login
header("Location: login.php");
exit;
