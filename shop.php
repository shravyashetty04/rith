<?php
require_once __DIR__ . '/includes/header.php';

$search_query = isset($_GET['q']) ? sanitize($_GET['q']) : '';
$selected_category = isset($_GET['category']) ? sanitize($_GET['category']) : 'all';

$products = [];
if ($GLOBALS['db_connected']) {
    try {
        $sql = "SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id WHERE 1=1";
        $params = [];

        if (!empty($search_query)) {
            $sql .= " AND (p.name LIKE ? OR p.short_description LIKE ?)";
            $params[] = "%$search_query%";
            $params[] = "%$search_query%";
        }

        if ($selected_category !== 'all') {
            $sql .= " AND c.slug = ?";
            $params[] = $selected_category;
        }

        $sql .= " AND p.id != 11 ORDER BY p.id DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $products = $stmt->fetchAll();
    } catch (Exception $e) {
        $products = [];
    }
}

if (!$GLOBALS['db_connected']) {
    $products = get_mock_products();
    if (!empty($search_query)) {
        $products = array_filter($products, function($item) use ($search_query) {
            return stripos($item['name'], $search_query) !== false || stripos($item['short_description'], $search_query) !== false;
        });
    }
    if ($selected_category !== 'all') {
        $products = array_filter($products, function($item) use ($selected_category) {
            return strtolower(str_replace([' & ', ' '], '-', $item['category_name'])) === $selected_category;
        });
    }
}
?>

<!-- Shop Page Banner -->
<div class="shop-hero-banner" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1600&auto=format&fit=crop') center/cover; padding: 60px 20px; text-align: center; color: white;">
    <h1 style="color: white; font-size: 2.8rem; margin-bottom: 10px; font-weight: 700; text-shadow: 2px 2px 8px rgba(0,0,0,0.4);">Rithamaya Products</h1>
    <p style="font-size: 1.1rem; color: #f8f9fa; max-width: 650px; margin: 0 auto 30px; text-shadow: 1px 1px 4px rgba(0,0,0,0.5);">Browse our complete catalog of organic masalas, health mix powders, and traditional foods</p>
    
    <div style="display: inline-flex; flex-wrap: wrap; justify-content: center; gap: 24px; background: rgba(255,255,255,0.95); padding: 12px 35px; border-radius: 50px; color: #1b4332; font-weight: 700; font-size: 0.85rem; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
        <span style="display: flex; align-items: center; gap: 8px;"><i class="fas fa-leaf" style="color: #2d6a4f; font-size: 1.1rem;"></i> 100% ORGANIC</span>
        <span style="display: flex; align-items: center; gap: 8px;"><i class="fas fa-house" style="color: #2d6a4f; font-size: 1.1rem;"></i> HOME MADE</span>
        <span style="display: flex; align-items: center; gap: 8px;"><i class="fas fa-ban" style="color: #e63946; font-size: 1.1rem;"></i> NO PRESERVATIVES</span>
        <span style="display: flex; align-items: center; gap: 8px;"><i class="fas fa-truck-fast" style="color: #2d6a4f; font-size: 1.1rem;"></i> FAST SHIPPING</span>
    </div>
</div>

<!-- Category Navigation Bar (Dark Green) -->
<div style="background-color: #1b4332; padding: 15px 0; margin-bottom: 40px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <div class="container">
        <div style="display: flex; justify-content: center; align-items: center; gap: 15px; flex-wrap: wrap;">
            <a href="shop.php" class="cat-chip <?= $selected_category == 'all' ? 'active' : '' ?>" style="background: <?= $selected_category == 'all' ? '#e9ecef' : '#fff' ?>; color: #1b4332; padding: 8px 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">All Products</a>
            <a href="shop.php?category=health-mixes" class="cat-chip <?= $selected_category == 'health-mixes' ? 'active' : '' ?>" style="background: <?= $selected_category == 'health-mixes' ? '#e9ecef' : '#fff' ?>; color: #1b4332; padding: 8px 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"><i class="fas fa-bowl-food" style="margin-right:6px; color: #8B4513;"></i>Health Mixes</a>
            <a href="shop.php?category=masala-powders" class="cat-chip <?= $selected_category == 'masala-powders' ? 'active' : '' ?>" style="background: <?= $selected_category == 'masala-powders' ? '#e9ecef' : '#fff' ?>; color: #1b4332; padding: 8px 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"><i class="fas fa-mortar-pestle" style="margin-right:6px; color: #D2691E;"></i>Masala Powders</a>
            <a href="shop.php?category=baby-food" class="cat-chip <?= $selected_category == 'baby-food' ? 'active' : '' ?>" style="background: <?= $selected_category == 'baby-food' ? '#e9ecef' : '#fff' ?>; color: #1b4332; padding: 8px 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"><i class="fas fa-baby" style="margin-right:6px; color: #F4A460;"></i>Baby Food</a>
            <a href="shop.php?category=sweets-laddus" class="cat-chip <?= $selected_category == 'sweets-laddus' ? 'active' : '' ?>" style="background: <?= $selected_category == 'sweets-laddus' ? '#e9ecef' : '#fff' ?>; color: #1b4332; padding: 8px 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"><i class="fas fa-cookie" style="margin-right:6px; color: #DAA520;"></i>Sweets & Laddus</a>
            <a href="shop.php?category=millets" class="cat-chip <?= $selected_category == 'millets' ? 'active' : '' ?>" style="background: <?= $selected_category == 'millets' ? '#e9ecef' : '#fff' ?>; color: #1b4332; padding: 8px 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"><i class="fas fa-seedling" style="margin-right:6px; color: #2E8B57;"></i>Millet Powders</a>
        </div>
        
        <?php if (!empty($search_query)): ?>
            <div style="font-size: 0.9rem; color: #d8f3dc; text-align: center; margin-top: 15px;">
                Showing results for: <strong>"<?= $search_query ?>"</strong> (<a href="shop.php" style="color: #fff; text-decoration: underline;">Clear</a>)
            </div>
        <?php endif; ?>
    </div>
</div>

<div class="container">
    <!-- Product Grid -->
    <?php if (count($products) > 0): ?>
        <div class="product-grid">
            <?php foreach ($products as $product): ?>
                <div class="product-card">
                    <div class="product-img-wrapper" style="position: relative;">
                        <a href="product.php?id=<?= $product['id'] ?>">
                            <img src="<?= sanitize($product['image']) ?>?v=<?= time() ?>" alt="<?= sanitize($product['name']) ?>" class="product-img">
                        </a>

                        <div class="product-badge-wrap">
                            <span class="badge-circle">
                                <?= sanitize($product['badge']) ?>
                            </span>
                        </div>
                    </div>

                    <div class="product-details">
                        <div class="product-header">
                            <h3 class="product-title">
                                <a href="product.php?id=<?= $product['id'] ?>"><?= sanitize($product['name']) ?></a>
                            </h3>
                            <span class="product-price"><?= format_price($product['price']) ?></span>
                        </div>
                        
                        <span class="product-brand">Rithamaya</span>
                        
                        <p class="product-short-desc">
                            <?= sanitize($product['short_description'] ?? '') ?>
                        </p>
                        
                        <?php if ($product['id'] == 1): ?>
                            <div style="display: flex; gap: 8px; margin-bottom: 15px; margin-top: 5px;">
                                <button type="button" class="variant-btn" onclick="selectVariant(this, 11, 349.00, '400gm', 'assets/images/products/Health mix powder.jpg')" style="border: 1px solid #dcdcdc; background: #fff; color: #555; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85rem; font-weight: 500;">400gm</button>
                                <button type="button" class="variant-btn active" onclick="selectVariant(this, 1, 699.00, '800gm', 'assets/images/products/health-mix-powder-400g-front.jpg')" style="border: 1px solid #dcdcdc; background: #2d6a4f; color: #fff; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85rem; font-weight: 500;">800gm</button>
                            </div>
                        <?php endif; ?>
                        
                        <form action="cart.php" method="POST" class="add-cart-form" style="display: flex; gap: 8px; margin-top: auto;">
                            <input type="hidden" name="product_id" value="<?= $product['id'] ?>">
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
    <?php else: ?>
        <div style="text-align: center; padding: 60px 0; background: #fff; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
            <i class="fas fa-box-open" style="font-size: 3rem; color: var(--secondary-color); margin-bottom: 16px;"></i>
            <h2>No Products Found</h2>
            <p style="color: var(--text-muted); margin-bottom: 20px;">We couldn't find any products matching your selected criteria.</p>
            <a href="shop.php" class="btn btn-primary">Browse All Products</a>
        </div>
    <?php endif; ?>
</div>

<script>
function selectVariant(btn, pid, price, weight, imageUrl) {
    let card = btn.closest('.product-details').parentElement;
    
    // Update active button styles
    card.querySelectorAll('.variant-btn').forEach(b => {
        b.style.background = '#fff';
        b.style.color = '#555';
        b.classList.remove('active');
    });
    btn.style.background = '#2d6a4f';
    btn.style.color = '#fff';
    btn.classList.add('active');
    
    // Update price
    card.querySelector('.product-price').innerText = '₹' + price.toFixed(2);
    
    // Update hidden product id input for cart
    card.querySelector('input[name="product_id"]').value = pid;
    
    // Update image if provided
    if (imageUrl) {
        card.querySelector('.product-img').src = imageUrl + '?v=' + new Date().getTime();
    }
    
    // Update links to product page
    card.querySelectorAll('a').forEach(link => {
        let href = link.getAttribute('href');
        if (href && href.startsWith('product.php')) {
            link.setAttribute('href', 'product.php?id=' + pid);
        }
    });
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
