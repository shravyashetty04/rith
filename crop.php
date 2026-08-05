<?php
$images = [
    'assets/images/products/health-mix-powder-400g-front.jpg',
    'assets/images/products/health-mix-powder-400g-back.jpg',
    'assets/images/products/health-mix-powder-400g-Side 1.jpg',
    'assets/images/products/health-mix-powder-400g-side2.jpg'
];

foreach ($images as $img_path) {
    if (file_exists($img_path)) {
        echo "Processing $img_path...\n";
        $img = imagecreatefromjpeg($img_path);
        if ($img !== false) {
            // Auto crop the white background
            // IMG_CROP_WHITE or IMG_CROP_THRESHOLD
            $cropped = imagecropauto($img, IMG_CROP_THRESHOLD, 0.1, 16777215); // 16777215 is white
            
            // If imagecropauto fails (sometimes happens with JPG artifacts), let's fallback to manual bounding box
            if ($cropped === false || (imagesx($cropped) == imagesx($img) && imagesy($cropped) == imagesy($img))) {
                echo "Auto crop didn't work well or wasn't needed, trying manual scan...\n";
                $width = imagesx($img);
                $height = imagesy($img);
                
                $min_x = $width; $max_x = 0;
                $min_y = $height; $max_y = 0;
                
                for ($y = 0; $y < $height; $y++) {
                    for ($x = 0; $x < $width; $x++) {
                        $rgb = imagecolorat($img, $x, $y);
                        $r = ($rgb >> 16) & 0xFF;
                        $g = ($rgb >> 8) & 0xFF;
                        $b = $rgb & 0xFF;
                        
                        // If pixel is NOT white (tolerance)
                        if ($r < 250 || $g < 250 || $b < 250) {
                            if ($x < $min_x) $min_x = $x;
                            if ($x > $max_x) $max_x = $x;
                            if ($y < $min_y) $min_y = $y;
                            if ($y > $max_y) $max_y = $y;
                        }
                    }
                }
                
                if ($min_x < $max_x && $min_y < $max_y) {
                    $rect = ['x' => $min_x, 'y' => $min_y, 'width' => $max_x - $min_x + 1, 'height' => $max_y - $min_y + 1];
                    $cropped = imagecrop($img, $rect);
                }
            }

            if ($cropped !== false) {
                imagejpeg($cropped, $img_path, 100); // Overwrite original with cropped
                imagedestroy($cropped);
                echo "Cropped and saved $img_path!\n";
            } else {
                echo "Could not crop $img_path\n";
            }
            imagedestroy($img);
        } else {
            echo "Failed to load $img_path\n";
        }
    } else {
        echo "File not found: $img_path\n";
    }
}
?>
