<?php
require_once __DIR__ . '/includes/header.php';

$product_id = isset($_GET['id']) ? (int)$_GET['id'] : 1;
$product = null;

if ($GLOBALS['db_connected']) {
    try {
        $stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = ?");
        $stmt->execute([$product_id]);
        $product = $stmt->fetch();
    } catch (Exception $e) {
        $product = null;
    }
}

if (!$product) {
    $all_mock = get_mock_products();
    foreach ($all_mock as $m) {
        if ($m['id'] == $product_id) {
            $product = $m;
            break;
        }
    }
    if (!$product) {
        $product = $all_mock[0];
    }
}

// Fetch related products
$related_products = [];
if ($GLOBALS['db_connected'] && $product) {
    try {
        $stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.category_id = ? AND p.id != ? LIMIT 4");
        $stmt->execute([$product['category_id'], $product['id']]);
        $related_products = $stmt->fetchAll();
        
        // If not enough related products in the same category, fill with random ones
        if (count($related_products) < 4) {
            $limit = 4 - count($related_products);
            $exclude_ids = array_merge([$product['id']], array_column($related_products, 'id'));
            $placeholders = implode(',', array_fill(0, count($exclude_ids), '?'));
            $stmt2 = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id NOT IN ($placeholders) LIMIT $limit");
            $stmt2->execute($exclude_ids);
            $related_products = array_merge($related_products, $stmt2->fetchAll());
        }
    } catch (Exception $e) {
        $related_products = [];
    }
}

if (empty($related_products) && $product) {
    $all_mock = get_mock_products();
    foreach ($all_mock as $m) {
        if ($m['id'] != $product['id']) {
            $related_products[] = $m;
            if (count($related_products) >= 4) break;
        }
    }
}

$has_3d_images = false;
if ($product['id'] == 11) { // 400g Product
    $has_3d_images = true;
    $front_img = 'assets/images/products/Health mix powder.jpg';
    $back_img = 'assets/images/products/health-mix-powder-400g-back.jpg';
    $side1_img = 'assets/images/products/health-mix-powder-400g-Side 1.jpg';
    $side2_img = 'assets/images/products/health-mix-powder-400g-side2.jpg';
} elseif ($product['id'] == 1) { // 800g Product
    $has_3d_images = true;
    $front_img = 'assets/images/products/health-mix-powder-400g-front.jpg';
    $back_img = 'assets/images/products/health-mix-powder-back-800g.jpg';
    $side1_img = 'assets/images/products/health-mix-powder-side1-800g.jpg';
    $side2_img = 'assets/images/products/health-mix-powder-side2-800g.jpg';
} elseif ($product['id'] == 2) { // Baby Ragi Sari Powder
    $has_3d_images = true;
    $front_img = 'assets/images/products/baby-ragi-sari-powder.jpg';
    $back_img = 'assets/images/products/baby ragi sari powder back.jpg';
    $side1_img = 'assets/images/products/baby ragi sari powder side 1.jpg';
    $side2_img = 'assets/images/products/Baby ragi sari powder side 2.jpg';
}
?>

<div class="container" style="margin-top: 40px; margin-bottom: 60px;">
    <!-- Breadcrumb -->
    <div style="margin-bottom: 24px; font-size: 0.9rem; color: var(--text-muted);">
        <a href="index.php">Home</a> / <a href="shop.php">Shop</a> / <span style="color: var(--primary-color); font-weight: 600;"><?= sanitize($product['name']) ?></span>
    </div>

    <!-- Product Detail Layout -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; background: #fff; padding: 40px; border-radius: var(--radius-lg); box-shadow: var(--shadow-md);">
        <!-- Product Image -->
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <?php if (isset($has_3d_images) && $has_3d_images): ?>
                <!-- 3D Interactive Box Viewer -->
                <div class="scene" style="width: 360px; height: 360px; perspective: 1200px; margin: 0 auto; user-select: none; padding-top: 40px;">
                    <div class="cube" id="productCube" style="width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transform: translateZ(-150px) rotateX(-15deg) rotateY(-35deg);">
                        <!-- Front Face -->
                        <div class="cube__face" style="position: absolute; width: 300px; height: 360px; left: 30px; background: #fff; border-radius: 4px; box-shadow: inset 0 0 15px rgba(0,0,0,0.05), 0 0 1px rgba(0,0,0,0.2); transform: rotateY(0deg) translateZ(80px); overflow: hidden;">
                            <img src="<?= $front_img ?>" alt="Front" style="width: 100%; height: 100%; object-fit: cover; object-position: center; pointer-events: none; transform: scale(1.18);">
                        </div>
                        <!-- Right Face -->
                        <div class="cube__face" style="position: absolute; width: 160px; height: 360px; left: 100px; background: #e8e8e8; border-radius: 4px; box-shadow: inset 0 0 25px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.2); transform: rotateY(90deg) translateZ(150px); overflow: hidden;">
                            <img src="<?= $side1_img ?>" alt="Side 1" style="width: 100%; height: 100%; object-fit: cover; object-position: center; pointer-events: none; transform: scale(1.18);">
                        </div>
                        <!-- Back Face -->
                        <div class="cube__face" style="position: absolute; width: 300px; height: 360px; left: 30px; background: #fff; border-radius: 4px; box-shadow: inset 0 0 15px rgba(0,0,0,0.05), 0 0 1px rgba(0,0,0,0.2); transform: rotateY(180deg) translateZ(80px); overflow: hidden;">
                            <img src="<?= $back_img ?>" alt="Back" style="width: 100%; height: 100%; object-fit: cover; object-position: center; pointer-events: none; transform: scale(1.18);">
                        </div>
                        <!-- Left Face -->
                        <div class="cube__face" style="position: absolute; width: 160px; height: 360px; left: 100px; background: #e8e8e8; border-radius: 4px; box-shadow: inset 0 0 25px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.2); transform: rotateY(-90deg) translateZ(150px); overflow: hidden;">
                            <img src="<?= $side2_img ?>" alt="Side 2" style="width: 100%; height: 100%; object-fit: cover; object-position: center; pointer-events: none; transform: scale(1.18);">
                        </div>
                        <!-- Top Face -->
                        <div class="cube__face" style="position: absolute; width: 300px; height: 160px; left: 30px; top: 100px; background: #fdfdfd; border: 1px solid #ddd; transform: rotateX(90deg) translateZ(180px);"></div>
                        <!-- Bottom Face -->
                        <div class="cube__face" style="position: absolute; width: 300px; height: 160px; left: 30px; top: 100px; background: #fdfdfd; border: 1px solid #ddd; transform: rotateX(-90deg) translateZ(180px); box-shadow: 0 0 30px rgba(0,0,0,0.4);"></div>
                    </div>
                </div>

                <script>
                    const cube = document.getElementById('productCube');
                    let currentAngleY = -35; // Start at an angle

                    cube.style.cursor = 'pointer';
                    cube.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

                    cube.addEventListener('click', () => {
                        currentAngleY -= 90; // Turn to the next side
                        cube.style.transform = `translateZ(-150px) rotateX(-15deg) rotateY(${currentAngleY}deg)`;
                    });
                </script>
            <?php else: ?>
                <img src="<?= htmlspecialchars($product['image']) ?>?v=<?= time() ?>" alt="<?= htmlspecialchars($product['name']) ?>" style="width: 100%; border-radius: var(--radius-md); max-height: 440px; object-fit: cover;">
            <?php endif; ?>
        </div>

        <!-- Product Info & Actions -->
        <div>
            <span class="badge badge-organic" style="margin-bottom: 12px;"><?= sanitize($product['badge']) ?></span>
            <p style="font-size: 0.85rem; color: var(--secondary-color); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px;">
                <?= sanitize($product['category_name']) ?>
            </p>
            <h1 style="font-size: 2.2rem; margin-bottom: 14px;"><?= sanitize($product['name']) ?></h1>
            
            <div style="display: flex; align-items: baseline; gap: 16px; margin-bottom: 20px;">
                <span style="font-size: 2.2rem; font-weight: 800; color: var(--primary-color); font-family: 'Outfit', sans-serif;">
                    <?= format_price($product['price']) ?>
                </span>
                <span style="color: var(--text-muted); font-size: 0.95rem;">(Inclusive of all taxes)</span>
            </div>

            <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.7; margin-bottom: 24px;">
                <?= sanitize($product['description']) ?>
            </p>

            <div style="background: #fdfbf7; border-left: 4px solid var(--secondary-color); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 24px;">
                <p style="font-size: 0.9rem; margin-bottom: 4px;"><strong>Net Weight:</strong> <?= sanitize($product['weight']) ?></p>
                <p style="font-size: 0.9rem; margin-bottom: 4px;"><strong>Availability:</strong> <span style="color: green; font-weight: 600;">In Stock (<?= $product['stock'] ?> units)</span></p>
                <p style="font-size: 0.9rem;"><strong>Formulation:</strong> 100% Natural, No Added Colors or Preservatives</p>
            </div>

            <!-- Add to Cart Form -->
            <form action="cart.php" method="POST" style="display: flex; gap: 16px; align-items: center; margin-bottom: 30px;">
                <input type="hidden" name="action" value="add">
                <input type="hidden" name="product_id" value="<?= $product['id'] ?>">

                <div class="qty-control">
                    <button type="button" class="qty-btn" onclick="updateQty(this, -1)">-</button>
                    <input type="number" name="quantity" value="1" min="1" class="qty-input">
                    <button type="button" class="qty-btn" onclick="updateQty(this, 1)">+</button>
                </div>

                <button type="submit" class="btn btn-primary" style="flex-grow: 1;">
                    <i class="fas fa-shopping-basket"></i> Add to Cart
                </button>
            </form>

            <div style="border-top: 1px solid var(--border-color); padding-top: 20px; display: flex; gap: 30px;">
                <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-muted);">
                    <i class="fas fa-shield-halved" style="color: var(--primary-color);"></i> 100% Quality Guaranteed
                </div>
                <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-muted);">
                    <i class="fas fa-leaf" style="color: var(--primary-color);"></i> Organic Farm Ingredients
                </div>
            </div>
        </div>
    </div>

    <!-- Related Products Section -->
    <?php if (!empty($related_products)): ?>
    <div style="margin-top: 80px;">
        <h2 style="font-size: 1.8rem; margin-bottom: 25px; color: #1b4332;">Related Products</h2>
        <p style="color: var(--text-muted); margin-bottom: 30px; font-size: 0.95rem;">Fresh products you might also need</p>
        
        <div class="product-grid">
            <?php foreach ($related_products as $rel_product): ?>
                <div class="product-card">
                    <div class="product-img-wrapper">
                        <a href="product.php?id=<?= $rel_product['id'] ?>">
                            <img src="<?= sanitize($rel_product['image']) ?>" alt="<?= sanitize($rel_product['name']) ?>" class="product-img">
                        </a>
                        <div class="product-badge-wrap">
                            <span class="badge-circle">
                                <?= sanitize($rel_product['badge']) ?>
                            </span>
                        </div>
                    </div>

                    <div class="product-details">
                        <div class="product-header">
                            <h3 class="product-title">
                                <a href="product.php?id=<?= $rel_product['id'] ?>"><?= sanitize($rel_product['name']) ?></a>
                            </h3>
                            <span class="product-price"><?= format_price($rel_product['price']) ?></span>
                        </div>
                        
                        <span class="product-brand">Rithamaya</span>
                        
                        <p class="product-short-desc">
                            <?= sanitize($rel_product['short_description'] ?? '') ?>
                        </p>
                        
                        <form action="cart.php" method="POST" class="add-cart-form" style="display: flex; gap: 8px; margin-top: auto;">
                            <input type="hidden" name="product_id" value="<?= $rel_product['id'] ?>">
                            <input type="hidden" name="quantity" value="1">
                            <button type="submit" name="action" value="buy_now" style="flex: 1; height: 40px; padding: 0; margin-top: 0; display: flex; align-items: center; justify-content: center; gap: 8px; background: #fff; color: var(--primary-color); border: 1px solid var(--primary-color); border-radius: 4px; font-weight: 600; cursor: pointer; transition: all 0.2s;">
                                BUY NOW
                            </button>
                            <button type="submit" name="action" value="add" class="add-cart-btn-full" style="flex: 1; height: 40px; padding: 0; margin-top: 0; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                <i class="fas fa-cart-plus"></i> ADD
                            </button>
                        </form>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <?php endif; ?>

</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
