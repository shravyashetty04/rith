<?php
require __DIR__ . '/config/db.php';
$stmt = $pdo->query("SELECT id, name, price, weight FROM products WHERE id=11");
print_r($stmt->fetchAll());
