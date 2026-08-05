<?php
require_once __DIR__ . '/includes/header.php';

// Fetch Featured Products from Database or Fallback Mock Data
$featured_products = [];
if ($GLOBALS['db_connected']) {
    try {
        $stmt = $pdo->query("SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.is_featured = 1 ORDER BY p.id DESC LIMIT 8");
        $featured_products = $stmt->fetchAll();
    } catch (Exception $e) {
        $featured_products = [];
    }
}

if (!$GLOBALS['db_connected']) {
    $all_mock = get_mock_products();
    $featured_products = array_filter($all_mock, function($item) {
        return $item['is_featured'] == 1;
    });
}
?>

<!-- Hero Banner Section -->
<section class="hero-section" style="padding: clamp(60px, 15vh, 120px) 0; color: white; min-height: clamp(400px, 70vh, 600px); display: flex; align-items: center;">
    <!-- Background Video -->
    <video autoplay loop muted playsinline style="position: absolute; top: 50%; left: 50%; width: 100%; height: 100%; object-fit: cover; transform: translate(-50%, -50%); z-index: 1;">
        <source src="assets/videos/spices_animation.mp4.mp4" type="video/mp4">
    </video>
    <!-- Dark Overlay for readability -->
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); z-index: 2;"></div>

    <div class="container" style="position: relative; z-index: 3; text-align: center;">
        <div style="max-width: 800px; margin: 0 auto;">
            <div class="hero-content" style="text-align: center;">
                <span class="hero-tag" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4);"><i class="fas fa-leaf"></i> 100% Pure Organic & Natural</span>
                <h1 class="hero-title" style="color: white; font-size: clamp(2.2rem, 6vw, 3.8rem); text-shadow: 2px 2px 15px rgba(0,0,0,0.6); margin-bottom: 20px; line-height: 1.2;">Fresh Homemade <span style="color: #fca311;">Nutrition</span> For Your Family</h1>
                <p class="hero-desc" style="color: #f8f9fa; margin: 0 auto 30px; text-shadow: 1px 1px 8px rgba(0,0,0,0.6); max-width: 700px; font-size: clamp(1rem, 2vw, 1.25rem);">
                    Discover authentic Karnataka masalas, nutrient-dense 35+ multigrain health mixes, and sprouted baby ragi powders crafted with zero preservatives.
                </p>
                <div class="hero-actions" style="justify-content: center;">
                    <a href="shop.php" class="btn btn-primary" style="box-shadow: 0 4px 15px rgba(0,0,0,0.4); font-size: 1.1rem; padding: 14px 28px;"><i class="fas fa-store"></i> Explore All Products</a>
                    <a href="about.php" class="btn" style="background: rgba(255,255,255,0.15); color: white; border: 1px solid white; backdrop-filter: blur(8px); font-size: 1.1rem; padding: 14px 28px;">Our Philosophy</a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Trust Features Section -->
<section class="section" style="background: #fff; padding: 40px 0; border-bottom: 1px solid var(--border-color);">
    <div class="container">
        <div class="feature-grid">
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-mortar-pestle"></i></div>
                <h3 class="feature-title">100% Homemade</h3>
                <p class="feature-desc">Slow roasted & ground according to authentic heritage recipes.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-shield-alt"></i></div>
                <h3 class="feature-title">No Preservatives</h3>
                <p class="feature-desc">Zero artificial colors, chemicals, or synthetic additives guaranteed.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-seedling"></i></div>
                <h3 class="feature-title">Farm Fresh Spices</h3>
                <p class="feature-desc">Directly sourced sun-dried ingredients for maximal aroma.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-truck-fast"></i></div>
                <h3 class="feature-title">Pan-India Shipping</h3>
                <p class="feature-desc">Hassle-free safe doorstep delivery across all pin codes.</p>
            </div>
        </div>
    </div>
</section>

<!-- Popular Product Showcase -->
<section class="section" style="background: #fdfbf7; padding-bottom: 20px;">
    <div class="container">
        <div class="section-title">
            <span class="section-subtitle">Explore Our Range</span>
            <h2>Pure Ingredients, Traditional Recipes</h2>
            <p style="color: var(--text-muted); max-width: 600px; margin: 15px auto 0;">Every product is carefully crafted in small batches using sun-dried ingredients to bring authentic Karnataka flavors to your home.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
            
            <!-- Category 1 -->
            <a href="shop.php?category=masala-powders" style="display: block; text-decoration: none; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); background: #fff; transition: transform 0.3s, box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)';">
                <div style="background: #eef4f0; padding: 40px 20px; text-align: center;">
                    <img src="assets/images/products/sambar-powder.png" alt="Masala Powders" style="height: 180px; width: 100%; object-fit: contain; mix-blend-mode: multiply; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));">
                </div>
                <div style="padding: 20px; text-align: center; border-top: 1px solid #f0f0f0;">
                    <h3 style="color: #1b4332; font-size: 1.25rem; margin-bottom: 5px;">Authentic Masalas</h3>
                    <span style="color: var(--secondary-color); font-weight: 600; font-size: 0.9rem;">Explore Range <i class="fas fa-arrow-right"></i></span>
                </div>
            </a>

            <!-- Category 2 -->
            <a href="shop.php?category=health-mixes" style="display: block; text-decoration: none; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); background: #fff; transition: transform 0.3s, box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)';">
                <div style="background: #fdf5e6; padding: 40px 20px; text-align: center;">
                    <img src="assets/images/products/Health-mix-pouch.png" alt="Health Mixes" style="height: 180px; width: 100%; object-fit: contain; mix-blend-mode: multiply; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));">
                </div>
                <div style="padding: 20px; text-align: center; border-top: 1px solid #f0f0f0;">
                    <h3 style="color: #1b4332; font-size: 1.25rem; margin-bottom: 5px;">Health Mixes</h3>
                    <span style="color: var(--secondary-color); font-weight: 600; font-size: 0.9rem;">Explore Range <i class="fas fa-arrow-right"></i></span>
                </div>
            </a>

            <!-- Category 3 -->
            <a href="shop.php?category=baby-food" style="display: block; text-decoration: none; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); background: #fff; transition: transform 0.3s, box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)';">
                <div style="background: #fff0f5; padding: 40px 20px; text-align: center;">
                    <img src="assets/images/products/baby-ragi-sari-powder.jpg?v=<?= time() ?>" alt="Baby Food" style="height: 180px; width: 100%; object-fit: contain; mix-blend-mode: multiply; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));">
                </div>
                <div style="padding: 20px; text-align: center; border-top: 1px solid #f0f0f0;">
                    <h3 style="color: #1b4332; font-size: 1.25rem; margin-bottom: 5px;">Baby Food (Ragi)</h3>
                    <span style="color: var(--secondary-color); font-weight: 600; font-size: 0.9rem;">Explore Range <i class="fas fa-arrow-right"></i></span>
                </div>
            </a>

            <!-- Category 4 -->
            <a href="shop.php?category=sweets-laddus" style="display: block; text-decoration: none; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); background: #fff; transition: transform 0.3s, box-shadow 0.3s;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)';">
                <div style="background: #fff8dc; padding: 40px 20px; text-align: center;">
                    <img src="assets/images/products/dry-fruits-laddu.jpg" alt="Sweets & Laddus" style="height: 180px; object-fit: cover; border-radius: 50%; width: 180px; box-shadow: 0 10px 15px rgba(0,0,0,0.1); margin: 0 auto;">
                </div>
                <div style="padding: 20px; text-align: center; border-top: 1px solid #f0f0f0;">
                    <h3 style="color: #1b4332; font-size: 1.25rem; margin-bottom: 5px;">Homemade Laddus</h3>
                    <span style="color: var(--secondary-color); font-weight: 600; font-size: 0.9rem;">Explore Range <i class="fas fa-arrow-right"></i></span>
                </div>
            </a>

        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="shop.php" class="btn btn-primary" style="padding: 12px 30px; font-size: 1.05rem;">Go to Full Shop Catalog</a>
        </div>
    </div>
</section>

<!-- About Brand Highlight Banner -->
<section id="why-choose-section" class="section" style="background: linear-gradient(135deg, #1b4332, #2d6a4f); color: #fff; padding: 40px 0; overflow: hidden;">
    <div class="container">
        <div class="hero-grid">
            <div class="reveal-left">
                <span style="color: var(--secondary-color); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem;">Why Choose Rithamaya?</span>
                <h2 style="color: #fff; font-size: clamp(2rem, 5vw, 2.4rem); margin: 12px 0 20px;">Prepared With Care & Pure Natural Goodness</h2>
                <p style="color: #d8f3dc; line-height: 1.8; margin-bottom: 24px; font-size: 1.05rem;">
                    At Rithamaya, every pack of masala, health mix, and ragi powder is crafted in small batches to preserve natural oils and nutritional integrity. We believe healthy living starts with unadulterated home cooking.
                </p>
                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <div class="stat-item">
                        <h3 style="color: var(--secondary-color); font-size: 2rem; font-weight: 800;"><span class="counter" data-target="35">0</span>+</h3>
                        <p style="color: #b7e4c7; font-size: 0.85rem;">Natural Multigrains</p>
                    </div>
                    <div class="stat-item">
                        <h3 style="color: var(--secondary-color); font-size: 2rem; font-weight: 800;"><span class="counter" data-target="100">0</span>%</h3>
                        <p style="color: #b7e4c7; font-size: 0.85rem;">Chemical Free</p>
                    </div>
                    <div class="stat-item">
                        <h3 style="color: var(--secondary-color); font-size: 2rem; font-weight: 800;"><span class="counter" data-target="5000">0</span>+</h3>
                        <p style="color: #b7e4c7; font-size: 0.85rem;">Happy Households</p>
                    </div>
                </div>
            </div>
            <div class="reveal-right tilt-container" style="perspective: 1000px; transform-style: preserve-3d; border-radius: 20px;">
                <img src="assets/images/products/top-view-different-seasonings-with-garlic-orange-lentils-dark-blue-background-photo-food-spicy-hot-pepper-color-sharp-seed-soup.jpg" id="tilt-image" alt="Rithamaya Ingredients" style="width: 100%; height: 400px; object-fit: cover; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); transition: transform 0.1s ease-out;">
            </div>
        </div>
    </div>
</section>

<style>
    .reveal-left {
        opacity: 0;
        transform: translateX(-50px);
        transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .reveal-right {
        opacity: 0;
        transform: translateX(50px);
        transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .reveal-left.active, .reveal-right.active {
        opacity: 1;
        transform: translateX(0);
    }
    
    @keyframes floating3D {
        0% { transform: rotateX(5deg) rotateY(-10deg) translateY(0px); box-shadow: -10px 20px 30px rgba(0,0,0,0.3); }
        50% { transform: rotateX(-5deg) rotateY(10deg) translateY(-15px); box-shadow: 10px 30px 50px rgba(0,0,0,0.4); }
        100% { transform: rotateX(5deg) rotateY(-10deg) translateY(0px); box-shadow: -10px 20px 30px rgba(0,0,0,0.3); }
    }
    
    #tilt-image {
        animation: floating3D 8s ease-in-out infinite;
    }
    .stat-item {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .stat-item.active {
        opacity: 1;
        transform: translateY(0);
    }
    .stat-item:nth-child(1) { transition-delay: 0.3s; }
    .stat-item:nth-child(2) { transition-delay: 0.5s; }
    .stat-item:nth-child(3) { transition-delay: 0.7s; }
</style>

<script>
    document.addEventListener("DOMContentLoaded", () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    if (entry.target.classList.contains('reveal-left')) {
                        const counters = entry.target.querySelectorAll('.counter');
                        counters.forEach(counter => {
                            const target = +counter.getAttribute('data-target');
                            const duration = 2000;
                            const increment = target / (duration / 16);
                            let current = 0;
                            
                            const updateCounter = () => {
                                current += increment;
                                if (current < target) {
                                    counter.innerText = Math.ceil(current);
                                    requestAnimationFrame(updateCounter);
                                } else {
                                    counter.innerText = target;
                                }
                            };
                            updateCounter();
                        });
                        
                        const stats = entry.target.querySelectorAll('.stat-item');
                        stats.forEach(stat => stat.classList.add('active'));
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => observer.observe(el));
    });
</script>
<!-- Customer Reviews Section -->
<section style="padding: 100px 0; position: relative; overflow: hidden; border-top: 1px solid var(--border-color);">
    <!-- Animated Backdrop -->
    <div class="reviews-backdrop"></div>
    <div class="reviews-particles">
        <div class="particle p1"></div>
        <div class="particle p2"></div>
        <div class="particle p3"></div>
        <div class="particle p4"></div>
    </div>
    
    <div class="container" style="position: relative; z-index: 2;">
        <div style="text-align: center; margin-bottom: 60px;" class="reveal-up">
            <span style="color: var(--secondary-color); font-weight: 700; letter-spacing: 2px; text-transform: uppercase; font-size: 0.95rem; display: inline-block; padding: 6px 16px; background: rgba(123, 192, 67, 0.1); border-radius: 50px; margin-bottom: 12px;">Testimonials</span>
            <h2 style="font-size: 2.8rem; margin-top: 10px; color: var(--primary-color);">What Our Customers Say</h2>
            <p style="color: var(--text-muted); max-width: 600px; margin: 15px auto 0; font-size: 1.1rem;">Real feedback from households that have switched to pure, homemade authentic taste.</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px;">
            <!-- Review 1 -->
            <div class="review-card reveal-up" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); padding: 40px 35px; border-radius: var(--radius-lg); box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.4s ease, box-shadow 0.4s ease; position: relative; border: 1px solid rgba(255,255,255,0.5); display: flex; flex-direction: column; height: 100%;">
                <i class="fas fa-quote-left" style="position: absolute; top: 30px; right: 35px; font-size: 3rem; color: #fdf3e5; z-index: 0; opacity: 0.7;"></i>
                
                <div style="display: flex; gap: 15px; margin-bottom: 25px; position: relative; z-index: 1; align-items: center; border-bottom: 1px dashed #e9ecef; padding-bottom: 20px;">
                    <img src="assets/images/products/bisibele-bath-powder.png" alt="Bisibele Bath Powder" style="width: 70px; height: 70px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <div>
                        <div style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">Reviewed on</div>
                        <h5 style="color: var(--primary-color); font-size: 1.1rem; margin: 0;">Bisibele Bath Powder</h5>
                        <div style="display: flex; gap: 4px; color: #fca311; margin-top: 6px; font-size: 0.9rem;">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                        </div>
                    </div>
                </div>
                
                <p style="color: var(--text-main); font-style: italic; margin-bottom: 25px; position: relative; z-index: 1; line-height: 1.8; font-size: 1.05rem;">"The Bisibele Bath Powder tastes exactly like what my grandmother used to make. The aroma fills the entire house. Absolutely authentic!"</p>
                
                <div style="display: flex; align-items: center; gap: 15px; position: relative; z-index: 1; margin-top: auto;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 1.2rem; box-shadow: 0 4px 10px rgba(31, 89, 21, 0.2);">S</div>
                    <div>
                        <h4 style="margin: 0; font-size: 1.1rem; color: var(--text-main);">Sneha Reddy</h4>
                        <span style="font-size: 0.85rem; color: var(--secondary-color); font-weight: 600;"><i class="fas fa-check-circle"></i> Verified Buyer</span>
                    </div>
                </div>
            </div>

            <!-- Review 2 -->
            <div class="review-card reveal-up" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); padding: 40px 35px; border-radius: var(--radius-lg); box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.4s ease, box-shadow 0.4s ease; position: relative; border: 1px solid rgba(255,255,255,0.5); transition-delay: 0.1s; display: flex; flex-direction: column; height: 100%;">
                <i class="fas fa-quote-left" style="position: absolute; top: 30px; right: 35px; font-size: 3rem; color: #fdf3e5; z-index: 0; opacity: 0.7;"></i>
                
                <div style="display: flex; gap: 15px; margin-bottom: 25px; position: relative; z-index: 1; align-items: center; border-bottom: 1px dashed #e9ecef; padding-bottom: 20px;">
                    <img src="assets/images/products/health-mix.jpg" onerror="this.src='https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&auto=format&fit=crop';" alt="Multigrain Health Mix" style="width: 70px; height: 70px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <div>
                        <div style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">Reviewed on</div>
                        <h5 style="color: var(--primary-color); font-size: 1.1rem; margin: 0;">Multigrain Health Mix</h5>
                        <div style="display: flex; gap: 4px; color: #fca311; margin-top: 6px; font-size: 0.9rem;">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                        </div>
                    </div>
                </div>

                <p style="color: var(--text-main); font-style: italic; margin-bottom: 25px; position: relative; z-index: 1; line-height: 1.8; font-size: 1.05rem;">"The Multigrain Health Mix has become our daily breakfast routine. It's so smooth, completely chemical-free, and my kids actually love the taste!"</p>
                
                <div style="display: flex; align-items: center; gap: 15px; position: relative; z-index: 1; margin-top: auto;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #fca311, #e85d04); display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 1.2rem; box-shadow: 0 4px 10px rgba(232, 93, 4, 0.2);">K</div>
                    <div>
                        <h4 style="margin: 0; font-size: 1.1rem; color: var(--text-main);">Karthik Sharma</h4>
                        <span style="font-size: 0.85rem; color: var(--secondary-color); font-weight: 600;"><i class="fas fa-check-circle"></i> Verified Buyer</span>
                    </div>
                </div>
            </div>

            <!-- Review 3 -->
            <div class="review-card reveal-up" style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); padding: 40px 35px; border-radius: var(--radius-lg); box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.4s ease, box-shadow 0.4s ease; position: relative; border: 1px solid rgba(255,255,255,0.5); transition-delay: 0.2s; display: flex; flex-direction: column; height: 100%;">
                <i class="fas fa-quote-left" style="position: absolute; top: 30px; right: 35px; font-size: 3rem; color: #fdf3e5; z-index: 0; opacity: 0.7;"></i>
                
                <div style="display: flex; gap: 15px; margin-bottom: 25px; position: relative; z-index: 1; align-items: center; border-bottom: 1px dashed #e9ecef; padding-bottom: 20px;">
                    <img src="assets/images/products/dry-fruits-laddu.jpg" onerror="this.src='https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&auto=format&fit=crop';" alt="Dry Fruits Laddu" style="width: 70px; height: 70px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <div>
                        <div style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">Reviewed on</div>
                        <h5 style="color: var(--primary-color); font-size: 1.1rem; margin: 0;">Dry Fruits Laddu</h5>
                        <div style="display: flex; gap: 4px; color: #fca311; margin-top: 6px; font-size: 0.9rem;">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                        </div>
                    </div>
                </div>

                <p style="color: var(--text-main); font-style: italic; margin-bottom: 25px; position: relative; z-index: 1; line-height: 1.8; font-size: 1.05rem;">"I ordered the Dry Fruits Laddu for my family and they were incredibly fresh. It feels so good to eat a sweet that is actually healthy and sugar-free."</p>
                
                <div style="display: flex; align-items: center; gap: 15px; position: relative; z-index: 1; margin-top: auto;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #023e8a, #0077b6); display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 1.2rem; box-shadow: 0 4px 10px rgba(0, 119, 182, 0.2);">P</div>
                    <div>
                        <h4 style="margin: 0; font-size: 1.1rem; color: var(--text-main);">Priya Iyer</h4>
                        <span style="font-size: 0.85rem; color: var(--secondary-color); font-weight: 600;"><i class="fas fa-check-circle"></i> Verified Buyer</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    /* Animated Backdrop Styles */
    .reviews-backdrop {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background: linear-gradient(120deg, #fdfbf7 0%, #f4faed 50%, #fdfbf7 100%);
        background-size: 200% 200%;
        animation: gradientFlow 15s ease infinite;
        z-index: 0;
    }
    
    @keyframes gradientFlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    /* Floating Particles */
    .reviews-particles {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        z-index: 1;
        pointer-events: none;
    }
    
    .particle {
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(123, 192, 67, 0.15) 0%, rgba(123, 192, 67, 0) 70%);
        animation: floatParticle 20s infinite linear;
    }
    
    .p1 { width: 300px; height: 300px; top: -100px; left: -100px; animation-duration: 25s; }
    .p2 { width: 400px; height: 400px; bottom: -150px; right: -100px; animation-duration: 30s; animation-direction: reverse; background: radial-gradient(circle, rgba(252, 163, 17, 0.1) 0%, rgba(252, 163, 17, 0) 70%); }
    .p3 { width: 200px; height: 200px; top: 40%; left: 60%; animation-duration: 22s; background: radial-gradient(circle, rgba(31, 89, 21, 0.1) 0%, rgba(31, 89, 21, 0) 70%); }
    .p4 { width: 250px; height: 250px; top: 20%; right: 15%; animation-duration: 28s; }

    @keyframes floatParticle {
        0% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(50px) rotate(180deg); }
        100% { transform: translateY(0) rotate(360deg); }
    }

    /* Review Card Enhancements */
    .review-card:hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 20px 40px rgba(31, 89, 21, 0.1);
        border-color: rgba(123, 192, 67, 0.3);
    }
    
    .reveal-up {
        opacity: 0;
        transform: translateY(40px);
        transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    
    .reveal-up.active {
        opacity: 1;
        transform: translateY(0);
    }
</style>

<script>
    document.addEventListener("DOMContentLoaded", () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
    });
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
