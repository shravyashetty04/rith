<?php
$host = 'localhost';
$username = 'root';
$password = 'tiger'; // User provided password
$dbname = 'rithamaya_db';

$GLOBALS['db_connected'] = false;

try {
    // Attempt to connect to the database via PDO
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, $username, $password, $options);
    
    $GLOBALS['db_connected'] = true;
} catch (PDOException $e) {
    // Connection failed, fallback mode will be active
    $GLOBALS['db_connected'] = false;
}
?>
