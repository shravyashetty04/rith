<?php
$files = [
    'terms.php',
    'shop.php',
    'register.php',
    'product.php',
    'order_success.php',
    'index.php',
    'includes/helpers.php',
    'includes/header.php',
    'includes/footer.php',
    'contact.php',
    'about.php'
];

foreach ($files as $file) {
    $path = "c:/xampp/htdocs/RT-main/RT-main/" . $file;
    if (file_exists($path)) {
        $content = file_get_contents($path);
        
        // Handle specific redundancy first
        $content = str_replace("RM's Sampoorna Food Products (Rithamaya)", "Rithamaya Food Products", $content);
        
        // Replace combinations
        $content = str_replace("RM's Sampoorna", "Rithamaya", $content);
        $content = str_replace("RM Sampoorna", "Rithamaya", $content);
        $content = str_replace("SAMPOORNA10", "RITHAMAYA10", $content);
        
        // Any lingering standalone Sampoorna (maybe lowercase or uppercase)
        $content = str_replace("Sampoorna", "Rithamaya", $content);
        
        file_put_contents($path, $content);
        echo "Updated $file\n";
    }
}
