<?php
session_start();
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/helpers.php';

// Check Admin Auth
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    header("Location: login.php");
    exit;
}

$admin_name = $_SESSION['user_name'] ?? 'Admin User';

// Fetch real products from database
$products = $pdo->query("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.id DESC")->fetchAll(PDO::FETCH_ASSOC);

// Fetch categories for the form
$categories = $pdo->query("SELECT * FROM categories")->fetchAll(PDO::FETCH_ASSOC);

// Handle Add Product
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_product') {
    $name = $_POST['name'];
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name), '-'));
    $category_id = (int)$_POST['category_id'];
    $price = $_POST['price'];
    $weight = $_POST['weight'];
    $stock = (int)$_POST['stock'];
    $badge = $_POST['badge'];
    $short_desc = $_POST['short_description'];
    $desc = $_POST['description'];
    $is_featured = isset($_POST['is_featured']) ? 1 : 0;
    
    $image_path = 'assets/images/placeholder.png'; // Fallback
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $tmp_name = $_FILES['image']['tmp_name'];
        $filename = time() . '_' . basename($_FILES['image']['name']);
        $destination = '../assets/images/products/' . $filename;
        if (move_uploaded_file($tmp_name, $destination)) {
            $image_path = 'assets/images/products/' . $filename;
        }
    }
    
    $stmt = $pdo->prepare("INSERT INTO products (category_id, name, slug, short_description, description, price, weight, badge, stock, image, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$category_id, $name, $slug, $short_desc, $desc, $price, $weight, $badge, $stock, $image_path, $is_featured]);
    header("Location: products.php");
    exit;
}

// Handle Edit Product
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'edit_product') {
    $id = (int)$_POST['product_id'];
    $name = $_POST['name'];
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name), '-'));
    $category_id = (int)$_POST['category_id'];
    $price = $_POST['price'];
    $weight = $_POST['weight'];
    $stock = (int)$_POST['stock'];
    $badge = $_POST['badge'];
    $short_desc = $_POST['short_description'];
    $desc = $_POST['description'];
    $is_featured = isset($_POST['is_featured']) ? 1 : 0;
    
    // Check if new image uploaded
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $tmp_name = $_FILES['image']['tmp_name'];
        $filename = time() . '_' . basename($_FILES['image']['name']);
        $destination = '../assets/images/products/' . $filename;
        if (move_uploaded_file($tmp_name, $destination)) {
            $image_path = 'assets/images/products/' . $filename;
            $stmt = $pdo->prepare("UPDATE products SET category_id=?, name=?, slug=?, short_description=?, description=?, price=?, weight=?, badge=?, stock=?, image=?, is_featured=? WHERE id=?");
            $stmt->execute([$category_id, $name, $slug, $short_desc, $desc, $price, $weight, $badge, $stock, $image_path, $is_featured, $id]);
        }
    } else {
        $stmt = $pdo->prepare("UPDATE products SET category_id=?, name=?, slug=?, short_description=?, description=?, price=?, weight=?, badge=?, stock=?, is_featured=? WHERE id=?");
        $stmt->execute([$category_id, $name, $slug, $short_desc, $desc, $price, $weight, $badge, $stock, $is_featured, $id]);
    }
    header("Location: products.php");
    exit;
}

// Handle Delete Product
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete_product') {
    $id = (int)$_POST['product_id'];
    $stmt = $pdo->prepare("DELETE FROM products WHERE id=?");
    $stmt->execute([$id]);
    header("Location: products.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Products | Admin Panel</title>
    <link rel="stylesheet" href="../assets/css/admin.css?v=3">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <input type="checkbox" id="mobile-menu" class="mobile-menu-toggle">
    <div class="mobile-top-bar">
        <label for="mobile-menu" class="mobile-menu-btn"><i class="fas fa-bars"></i></label>
    </div>
    <div class="admin-layout">
        <!-- Sidebar -->
        <aside class="admin-sidebar">
            <div class="sidebar-header">
                <img src="../assets/images/logo.png" alt="Logo" class="sidebar-logo">
                <div class="sidebar-title">Admin Panel</div>
            </div>
            
            <nav class="sidebar-nav">
                <a href="#" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-sync-alt"></i></div>
                    <div class="nav-text">Clear Site Cache</div>
                </a>
                
                <a href="index.php" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="nav-text">Dashboard</div>
                </a>
                
                <a href="products.php" class="nav-item active">
                    <div class="nav-icon"><i class="fas fa-boxes"></i></div>
                    <div class="nav-text">Products</div>
                </a>
                
                <?php if ($_SESSION['user_role'] === 'admin'): ?>
                <a href="orders.php" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-shopping-cart"></i></div>
                    <div class="nav-text">Customer Orders</div>
                </a>
                
                <a href="messages.php" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-envelope"></i></div>
                    <div class="nav-text">Contact Messages</div>
                </a>
                <?php endif; ?>

                <!-- Footer Links -->
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);"></div>
                <a href="../index.php" class="nav-item" target="_blank">
                    <div class="nav-icon"><i class="fas fa-external-link-alt"></i></div>
                    <div class="nav-text">View Live Site</div>
                </a>
                <a href="logout.php" class="nav-item nav-logout">
                    <div class="nav-icon"><i class="fas fa-sign-out-alt"></i></div>
                    <div class="nav-text">Admin Logout</div>
                </a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="admin-main">
            <!-- Header -->
            <div class="products-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h1 class="page-title" style="color: var(--forest-green); margin: 0; font-size: 1.6rem;">Manage Store Products</h1>
                <button type="button" onclick="document.getElementById('addProductModal').showModal();" class="btn-solid-green" style="background: var(--forest-green); color: white; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 600; cursor: pointer;"><i class="fas fa-plus"></i> Add New Product</button>
            </div>

            <!-- Table Card (Desktop Only) -->
            <div class="table-card desktop-products-table">
                <table class="admin-table products-table">
                    <thead>
                        <tr>
                            <th style="color: var(--forest-green);">ID</th>
                            <th style="color: var(--forest-green); text-align: center;">Image</th>
                            <th style="color: var(--forest-green);">Product Name</th>
                            <th style="color: var(--forest-green);">Category</th>
                            <th style="color: var(--forest-green);">Price</th>
                            <th style="color: var(--forest-green);">Weight</th>
                            <th style="color: var(--forest-green);">Badge</th>
                            <th style="color: var(--forest-green); text-align: center;">Stock</th>
                            <th style="color: var(--forest-green); text-align: center;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach($products as $p): ?>
                        <tr>
                            <td class="td-gray">#<?= $p['id'] ?></td>
                            <td style="text-align: center;">
                                <img src="../<?= htmlspecialchars($p['image']) ?>" alt="Product" style="width: 40px; height: 40px; object-fit: contain; border-radius: 4px;">
                            </td>
                            <td>
                                <div style="color: var(--forest-green); font-weight: 700; font-size: 0.95rem;"><?= htmlspecialchars($p['name']) ?></div>
                            </td>
                            <td>
                                <div style="color: #b77b3b; font-size: 0.85rem; max-width: 140px; line-height: 1.4;"><?= htmlspecialchars($p['category_name'] ?? 'Uncategorized') ?></div>
                            </td>
                            <td class="td-price" style="color: #000; font-weight: 700; font-size: 0.95rem;"><?= format_price($p['price']) ?></td>
                            <td class="td-gray" style="font-size: 0.9rem;"><?= htmlspecialchars($p['weight']) ?></td>
                            <td>
                                <?php if($p['badge']): ?>
                                <span style="background: #F3E5F5; color: #9C27B0; padding: 4px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase;"><?= htmlspecialchars($p['badge']) ?></span>
                                <?php endif; ?>
                            </td>
                            <td style="text-align: center;">
                                <div style="color: var(--forest-green); font-weight: 700; font-size: 0.95rem; line-height: 1.2;"><?= $p['stock'] ?><br><span style="font-size: 0.8rem;">units</span></div>
                            </td>
                            <td class="td-actions" style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                                <button type="button" onclick="editProduct(<?= htmlspecialchars(json_encode($p)) ?>)" style="background: #e8f5e9; color: var(--forest-green); border: 1px solid var(--forest-green); border-radius: 4px; padding: 4px 12px; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; width: 75px; justify-content: center;"><i class="fas fa-edit"></i> Edit</button>
                                <form method="POST" style="margin:0;" onsubmit="return confirm('Are you sure you want to delete this product?');">
                                    <input type="hidden" name="action" value="delete_product">
                                    <input type="hidden" name="product_id" value="<?= $p['id'] ?>">
                                    <button type="submit" style="background: #ffebee; color: #d32f2f; border: 1px solid #d32f2f; border-radius: 4px; padding: 4px 12px; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; width: 75px; justify-content: center;"><i class="fas fa-trash-alt"></i> Delete</button>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <!-- Mobile Cards (Mobile Only) -->
            <div class="mobile-products-list">
                <?php foreach($products as $p): ?>
                <div class="mobile-product-card">
                    <div class="mpc-header">
                        <img src="../<?= htmlspecialchars($p['image']) ?>" alt="Product">
                        <div class="mpc-info">
                            <div class="mpc-name"><?= htmlspecialchars($p['name']) ?></div>
                            <div class="mpc-cat"><?= htmlspecialchars($p['category_name'] ?? 'Uncategorized') ?></div>
                            <div class="mpc-id-badge">
                                <span class="mpc-id">ID #<?= $p['id'] ?></span>
                                <?php if($p['badge']): ?>
                                <span class="mpc-dot">•</span>
                                <span class="mpc-badge"><?= htmlspecialchars($p['badge']) ?></span>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                    <div class="mpc-stats">
                        <div class="mpc-stat-box">
                            <div class="stat-label">PRICE</div>
                            <div class="stat-value"><?= format_price($p['price']) ?></div>
                        </div>
                        <div class="mpc-stat-box">
                            <div class="stat-label">WEIGHT</div>
                            <div class="stat-value"><?= htmlspecialchars($p['weight']) ?></div>
                        </div>
                        <div class="mpc-stat-box">
                            <div class="stat-label">STOCK</div>
                            <div class="stat-value" style="color: var(--forest-green);"><?= $p['stock'] ?></div>
                        </div>
                    </div>
                    <div class="mpc-actions">
                        <button type="button" onclick="editProduct(<?= htmlspecialchars(json_encode($p)) ?>)" class="mpc-btn mpc-edit"><i class="fas fa-edit"></i> Edit</button>
                        <form method="POST" style="margin:0; width: 100%;" onsubmit="return confirm('Are you sure you want to delete this product?');">
                            <input type="hidden" name="action" value="delete_product">
                            <input type="hidden" name="product_id" value="<?= $p['id'] ?>">
                            <button type="submit" class="mpc-btn mpc-delete"><i class="fas fa-trash-alt"></i> Delete</button>
                        </form>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </main>
    </div>

    <!-- Add Product Modal -->
    <dialog id="addProductModal" style="border: none; border-radius: 12px; padding: 25px; max-width: 600px; width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; color: var(--forest-green); font-size: 1.4rem;"><i class="fas fa-plus-circle"></i> Add New Product</h3>
            <button type="button" onclick="document.getElementById('addProductModal').close()" style="background: rgba(0,0,0,0.05); border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; color: #555; display: flex; align-items: center; justify-content: center;"><i class="fas fa-times"></i></button>
        </div>
        <form method="POST" enctype="multipart/form-data">
            <input type="hidden" name="action" value="add_product">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Product Name *</label>
                    <input type="text" name="name" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Category *</label>
                    <select name="category_id" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
                        <?php foreach($categories as $cat): ?>
                            <option value="<?= $cat['id'] ?>"><?= htmlspecialchars($cat['name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Price (₹) *</label>
                    <input type="number" step="any" name="price" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Weight (e.g. 500g)</label>
                    <input type="text" name="weight" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Stock Quantity *</label>
                    <input type="number" name="stock" value="0" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Badge (e.g. New)</label>
                    <input type="text" name="badge" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
                </div>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Short Description</label>
                <input type="text" name="short_description" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Full Description</label>
                <textarea name="description" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;"></textarea>
            </div>
            <div style="margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                <input type="checkbox" name="is_featured" id="is_featured">
                <label for="is_featured" style="font-weight: 600; font-size: 0.9rem; cursor: pointer;">Feature on Homepage</label>
            </div>
            <div style="margin-bottom: 25px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Product Image</label>
                <input type="file" name="image" accept="image/*" style="width: 100%; padding: 10px; border: 1px dashed #ccc; border-radius: 6px; box-sizing: border-box; background: #f9f9f9;">
            </div>
            <div style="text-align: right;">
                <button type="submit" style="background: var(--forest-green); color: white; border: none; padding: 12px 25px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 1rem;"><i class="fas fa-save"></i> Save Product</button>
            </div>
        </form>
    </dialog>

    <!-- Edit Product Modal -->
    <dialog id="editProductModal" style="border: none; border-radius: 12px; padding: 25px; max-width: 600px; width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; color: var(--forest-green); font-size: 1.4rem;"><i class="fas fa-edit"></i> Edit Product</h3>
            <button type="button" onclick="document.getElementById('editProductModal').close()" style="background: rgba(0,0,0,0.05); border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; color: #555; display: flex; align-items: center; justify-content: center;"><i class="fas fa-times"></i></button>
        </div>
        <form method="POST" enctype="multipart/form-data">
            <input type="hidden" name="action" value="edit_product">
            <input type="hidden" name="product_id" id="edit_product_id">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Product Name *</label>
                    <input type="text" name="name" id="edit_name" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Category *</label>
                    <select name="category_id" id="edit_category" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
                        <?php foreach($categories as $cat): ?>
                            <option value="<?= $cat['id'] ?>"><?= htmlspecialchars($cat['name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Price (₹) *</label>
                    <input type="number" step="any" name="price" id="edit_price" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Weight (e.g. 500g)</label>
                    <input type="text" name="weight" id="edit_weight" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Stock Quantity *</label>
                    <input type="number" name="stock" id="edit_stock" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Badge (e.g. New)</label>
                    <input type="text" name="badge" id="edit_badge" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
                </div>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Short Description</label>
                <input type="text" name="short_description" id="edit_short_desc" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Full Description</label>
                <textarea name="description" id="edit_desc" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;"></textarea>
            </div>
            <div style="margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                <input type="checkbox" name="is_featured" id="edit_featured">
                <label for="edit_featured" style="font-weight: 600; font-size: 0.9rem; cursor: pointer;">Feature on Homepage</label>
            </div>
            <div style="margin-bottom: 25px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem;">Product Image (Leave empty to keep current)</label>
                <input type="file" name="image" accept="image/*" style="width: 100%; padding: 10px; border: 1px dashed #ccc; border-radius: 6px; box-sizing: border-box; background: #f9f9f9;">
            </div>
            <div style="text-align: right;">
                <button type="submit" style="background: #e8f5e9; color: var(--forest-green); border: 1px solid var(--forest-green); padding: 12px 25px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 1rem;"><i class="fas fa-check"></i> Update Product</button>
            </div>
        </form>
    </dialog>

    <script>
    function editProduct(product) {
        document.getElementById('edit_product_id').value = product.id;
        document.getElementById('edit_name').value = product.name;
        document.getElementById('edit_category').value = product.category_id;
        document.getElementById('edit_price').value = product.price;
        document.getElementById('edit_weight').value = product.weight;
        document.getElementById('edit_stock').value = product.stock;
        document.getElementById('edit_badge').value = product.badge;
        document.getElementById('edit_short_desc').value = product.short_description;
        document.getElementById('edit_desc').value = product.description;
        document.getElementById('edit_featured').checked = (product.is_featured == 1);
        document.getElementById('editProductModal').showModal();
    }
    </script>
</body>
</html>
