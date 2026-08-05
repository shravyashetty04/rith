<?php
require 'c:\xampp\htdocs\RT-main\RT-main\config\db.php';
$pdo->query("UPDATE products SET image = 'assets/images/products/baby-ragi-sari-powder.jpg' WHERE name = 'Baby Ragi Sari Powder'");
echo "Updated back to baby-ragi-sari-powder.jpg";
