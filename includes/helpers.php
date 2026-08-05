<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Initialize cart if not set
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Sanitize user inputs
function sanitize($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Format Currency
function format_price($price) {
    return '₹' . number_format((float)$price, 2);
}

// Get Cart Item Count
function get_cart_count() {
    $count = 0;
    if (isset($_SESSION['cart']) && is_array($_SESSION['cart'])) {
        foreach ($_SESSION['cart'] as $item) {
            $count += (int)($item['quantity'] ?? 1);
        }
    }
    return $count;
}

// Get Cart Total Amount
function get_cart_total() {
    $total = 0;
    if (isset($_SESSION['cart']) && is_array($_SESSION['cart'])) {
        foreach ($_SESSION['cart'] as $item) {
            $total += ((float)$item['price'] * (int)$item['quantity']);
        }
    }
    return $total;
}

// Fallback Mock Data if MySQL DB is not connected yet
function get_mock_products() {
    return [
        [
            'id' => 1,
            'category_id' => 1,
            'category_name' => 'Health Mixes',
            'name' => '35+ Multigrain Health Mix Powder (800g)',
            'slug' => '35-multigrain-health-mix-powder',
            'short_description' => '35+ natural grains, millets, nuts, and natural herbs for daily family nourishment.',
            'description' => 'Rithamaya 35+ Multigrain Health Mix is expertly crafted using 35 nutrient-rich natural ingredients including finger millet (ragi), bajra, jowar, almonds, walnuts, green gram, cardamom, and lotus seeds. Free from preservatives, artificial flavors, and added sugars.',
            'price' => 699.00,
            'weight' => '800g',
            'badge' => 'Bestseller',
            'stock' => 120,
            'image' => 'assets/images/products/Health mix powder.jpg',
            'is_featured' => 1
        ],
        [
            'id' => 11,
            'category_id' => 1,
            'category_name' => 'Health Mixes',
            'name' => '35+ Multigrain Health Mix Powder (400g)',
            'slug' => '35-multigrain-health-mix-powder-400g',
            'short_description' => '35+ natural grains, millets, nuts, and natural herbs for daily family nourishment.',
            'description' => 'Rithamaya 35+ Multigrain Health Mix is expertly crafted using 35 nutrient-rich natural ingredients including finger millet (ragi), bajra, jowar, almonds, walnuts, green gram, cardamom, and lotus seeds. Free from preservatives, artificial flavors, and added sugars.',
            'price' => 349.00,
            'weight' => '400g',
            'badge' => 'New Size',
            'stock' => 100,
            'image' => 'assets/images/products/health-mix-powder-400.jpg',
            'is_featured' => 1
        ],
        [
            'id' => 2,
            'category_id' => 3,
            'category_name' => 'Baby Food',
            'name' => 'Baby Ragi Sari Powder',
            'slug' => 'baby-ragi-sari-powder',
            'short_description' => 'Traditional sprouted ragi baby cereal for healthy digestion and bone growth.',
            'description' => 'Handcrafted sprouted Ragi Sari specially prepared for infants and toddler nutrition. Rich in natural calcium, iron, and dietary fiber, promoting easy digestion and natural weight gain.',
            'price' => 399.00,
            'weight' => '500g',
            'badge' => 'Organic',
            'stock' => 85,
            'image' => 'assets/images/products/baby ragi sari powder.jpg',
            'is_featured' => 1
        ],
        [
            'id' => 3,
            'category_id' => 2,
            'category_name' => 'Masala Powders',
            'name' => 'Bisibele Bath Powder',
            'slug' => 'bisibele-bath-powder',
            'short_description' => 'Authentic aroma & flavor for traditional Karnataka-style Bisibele Bath.',
            'description' => 'Made from roasted coriander, chana dal, urad dal, dried red chillies, cinnamon, cloves, and kapok buds. Delivers restaurant-style authentic taste to your homemade rice dishes.',
            'price' => 140.00,
            'weight' => '250g',
            'badge' => 'Traditional',
            'stock' => 95,
            'image' => 'assets/images/products/bisibele-bath-powder.png',
            'is_featured' => 1
        ],
        [
            'id' => 4,
            'category_id' => 2,
            'category_name' => 'Masala Powders',
            'name' => 'Dhaniya Powder (Coriander Powder)',
            'slug' => 'dhaniya-powder',
            'short_description' => 'Freshly ground premium coriander seeds with intense natural fragrance.',
            'description' => '100% pure sun-dried coriander seeds slow-ground to preserve volatile essential oils. Elevates every curry, gravy, and dal with fresh aromatic warmth.',
            'price' => 95.00,
            'weight' => '250g',
            'badge' => 'Pure',
            'stock' => 150,
            'image' => 'assets/images/products/dhaniya-powder.png',
            'is_featured' => 0
        ],
        [
            'id' => 5,
            'category_id' => 2,
            'category_name' => 'Masala Powders',
            'name' => 'Red Chilli Powder',
            'slug' => 'red-chilli-powder',
            'short_description' => 'Rich vibrant red color with mild authentic heat from select chillies.',
            'description' => 'Blended from handpicked Byadgi and Guntur chillies giving vibrant red color without synthetic colors or chemicals.',
            'price' => 120.00,
            'weight' => '250g',
            'badge' => 'Spicy',
            'stock' => 110,
            'image' => 'assets/images/products/red-chilli-powder.png',
            'is_featured' => 0
        ],
        [
            'id' => 6,
            'category_id' => 2,
            'category_name' => 'Masala Powders',
            'name' => 'Authentic Sambar Powder',
            'slug' => 'sambar-powder',
            'short_description' => 'Classic South Indian aromatic spice mix for comforting homemade sambar.',
            'description' => 'A balanced blend of roasted spices, roasted lentils, fenugreek, cumin, and asafoetida. Perfect for daily vegetable sambars.',
            'price' => 130.00,
            'weight' => '250g',
            'badge' => 'Karnataka Special',
            'stock' => 140,
            'image' => 'assets/images/products/sambar-powder.png',
            'is_featured' => 1
        ],
        [
            'id' => 7,
            'category_id' => 2,
            'category_name' => 'Masala Powders',
            'name' => 'Mutton Sambar Powder',
            'slug' => 'mutton-sambar-powder',
            'short_description' => 'Special secret blend for rich, spicy non-vegetarian sambars & gravies.',
            'description' => 'Traditional homemade Mutton Sambar Powder expertly blended with exotic spices to bring out the authentic taste of Karnataka non-veg cuisine.',
            'price' => 160.00,
            'weight' => '250g',
            'badge' => 'Authentic',
            'stock' => 75,
            'image' => 'assets/images/products/mutton-sambar-powder.png',
            'is_featured' => 1
        ],
        [
            'id' => 8,
            'category_id' => 2,
            'category_name' => 'Masala Powders',
            'name' => 'Homemade Puliyogare Powder',
            'slug' => 'puliyogare-powder',
            'short_description' => 'Tangy tamarind rice masala powder prepared from heritage family recipe.',
            'description' => 'Prepared with dry roasted sesame seeds, black pepper, peanuts, coriander, mustard, and tamarind spice blend for instant authentic tamarind rice.',
            'price' => 145.00,
            'weight' => '250g',
            'badge' => 'Heritage Recipe',
            'stock' => 90,
            'image' => 'assets/images/products/puliyogare-powder.png',
            'is_featured' => 0
        ],
        [
            'id' => 9,
            'category_id' => 4,
            'category_name' => 'Sweets & Laddus',
            'name' => 'Nutritious Dry Fruits Laddu',
            'slug' => 'dry-fruits-laddu',
            'short_description' => 'No added sugar laddu packed with dates, figs, almonds, cashews & ghee.',
            'description' => 'Healthy guilt-free dessert crafted with premium Medjool dates, dried figs, roasted almonds, pistachios, cashews, seeds, and pure desi cow ghee.',
            'price' => 420.00,
            'weight' => '400g',
            'badge' => 'Sugar-Free',
            'stock' => 60,
            'image' => 'assets/images/products/dry-fruits-laddu.jpg',
            'is_featured' => 1
        ],
        [
            'id' => 10,
            'category_id' => 1,
            'category_name' => 'Health Mixes',
            'name' => 'Korle Millet Powder',
            'slug' => 'korle-millet-powder',
            'short_description' => 'Pure organic blend of Browntop (Korle) millet, pumpkin seeds & brown rice.',
            'description' => 'High-fiber diabetic-friendly millet powder rich in minerals and slow-releasing complex carbohydrates. Great for kanji, porridge, or roti flour mix.',
            'price' => 280.00,
            'weight' => '500g',
            'badge' => 'Superfood',
            'stock' => 80,
            'image' => 'assets/images/products/korle-millet-powder.png',
            'is_featured' => 0
        ]
    ];
}
?>
