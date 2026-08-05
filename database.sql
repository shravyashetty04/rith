-- phpMyAdmin SQL Dump
-- Database: `rithamaya_db`

CREATE DATABASE IF NOT EXISTS `rithamaya_db`;
USE `rithamaya_db`;

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `categories` (`id`, `name`, `slug`) VALUES
(1, 'Health Mixes', 'health-mixes'),
(2, 'Masala Powders', 'masala-powders'),
(3, 'Baby Food', 'baby-food'),
(4, 'Sweets & Laddus', 'sweets-laddus');

CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `short_description` text,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `weight` varchar(50) DEFAULT NULL,
  `badge` varchar(50) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `short_description`, `description`, `price`, `weight`, `badge`, `stock`, `image`, `is_featured`) VALUES
(1, 1, '35+ Multigrain Health Mix Powder (800g)', '35-multigrain-health-mix-powder', '35+ natural grains, millets, nuts, and natural herbs for daily family nourishment.', 'RM Sampoorna 35+ Multigrain Health Mix is expertly crafted using 35 nutrient-rich natural ingredients including finger millet (ragi), bajra, jowar, almonds, walnuts, green gram, cardamom, and lotus seeds. Free from preservatives, artificial flavors, and added sugars.', '699.00', '800g', 'Bestseller', 120, 'assets/images/products/Health mix powder.jpg', 1),
(11, 1, '35+ Multigrain Health Mix Powder (400g)', '35-multigrain-health-mix-powder-400g', '35+ natural grains, millets, nuts, and natural herbs for daily family nourishment.', 'RM Sampoorna 35+ Multigrain Health Mix is expertly crafted using 35 nutrient-rich natural ingredients including finger millet (ragi), bajra, jowar, almonds, walnuts, green gram, cardamom, and lotus seeds. Free from preservatives, artificial flavors, and added sugars.', '349.00', '400g', 'New Size', 100, 'assets/images/products/health-mix-powder-400.jpg', 1),
(2, 3, 'Baby Ragi Sari Powder', 'baby-ragi-sari-powder', 'Traditional sprouted ragi baby cereal for healthy digestion and bone growth.', 'Handcrafted sprouted Ragi Sari specially prepared for infants and toddler nutrition. Rich in natural calcium, iron, and dietary fiber, promoting easy digestion and natural weight gain.', '399.00', '500g', 'Organic', 85, 'assets/images/products/baby ragi sari powder.jpg', 1),
(3, 2, 'Bisibele Bath Powder', 'bisibele-bath-powder', 'Authentic aroma & flavor for traditional Karnataka-style Bisibele Bath.', 'Made from roasted coriander, chana dal, urad dal, dried red chillies, cinnamon, cloves, and kapok buds. Delivers restaurant-style authentic taste to your homemade rice dishes.', '140.00', '250g', 'Traditional', 95, 'assets/images/products/bisibele-bath-powder.png', 1),
(4, 2, 'Dhaniya Powder (Coriander Powder)', 'dhaniya-powder', 'Freshly ground premium coriander seeds with intense natural fragrance.', '100% pure sun-dried coriander seeds slow-ground to preserve volatile essential oils. Elevates every curry, gravy, and dal with fresh aromatic warmth.', '95.00', '250g', 'Pure', 150, 'assets/images/products/dhaniya-powder.png', 0),
(5, 2, 'Red Chilli Powder', 'red-chilli-powder', 'Rich vibrant red color with mild authentic heat from select chillies.', 'Blended from handpicked Byadgi and Guntur chillies giving vibrant red color without synthetic colors or chemicals.', '120.00', '250g', 'Spicy', 110, 'assets/images/products/red-chilli-powder.png', 0),
(6, 2, 'Authentic Sambar Powder', 'sambar-powder', 'Classic South Indian aromatic spice mix for comforting homemade sambar.', 'A balanced blend of roasted spices, roasted lentils, fenugreek, cumin, and asafoetida. Perfect for daily vegetable sambars.', '130.00', '250g', 'Karnataka Special', 140, 'assets/images/products/sambar-powder.png', 1),
(7, 2, 'Mutton Sambar Powder', 'mutton-sambar-powder', 'Special secret blend for rich, spicy non-vegetarian sambars & gravies.', 'Traditional homemade Mutton Sambar Powder expertly blended with exotic spices to bring out the authentic taste of Karnataka non-veg cuisine.', '160.00', '250g', 'Authentic', 75, 'assets/images/products/mutton-sambar-powder.png', 1),
(8, 2, 'Homemade Puliyogare Powder', 'puliyogare-powder', 'Tangy tamarind rice masala powder prepared from heritage family recipe.', 'Prepared with dry roasted sesame seeds, black pepper, peanuts, coriander, mustard, and tamarind spice blend for instant authentic tamarind rice.', '145.00', '250g', 'Heritage Recipe', 90, 'assets/images/products/puliyogare-powder.png', 0),
(9, 4, 'Nutritious Dry Fruits Laddu', 'dry-fruits-laddu', 'No added sugar laddu packed with dates, figs, almonds, cashews & ghee.', 'Healthy guilt-free dessert crafted with premium Medjool dates, dried figs, roasted almonds, pistachios, cashews, seeds, and pure desi cow ghee.', '420.00', '400g', 'Sugar-Free', 60, 'assets/images/products/dry-fruits-laddu.jpg', 1),
(10, 1, 'Korle Millet Powder', 'korle-millet-powder', 'Pure organic blend of Browntop (Korle) millet, pumpkin seeds & brown rice.', 'High-fiber diabetic-friendly millet powder rich in minerals and slow-releasing complex carbohydrates. Great for kanji, porridge, or roti flour mix.', '280.00', '500g', 'Superfood', 80, 'assets/images/products/korle-millet-powder.png', 0);


CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'customer',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `order_number` varchar(100) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT 'Pending',
  `order_status` varchar(50) DEFAULT 'Processing',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
