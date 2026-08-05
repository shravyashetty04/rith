<?php
require_once __DIR__ . '/includes/header.php';
?>

<link rel="stylesheet" href="assets/css/about.css?v=<?php echo time(); ?>">

<div class="page-banner" style="margin-bottom: 0;">
    <div class="container">
        <h1>About Rithamaya</h1>
        <p>Our story, traditional roots, and commitment to 100% natural, unadulterated food products</p>
    </div>
</div>

<div class="about-bg-section">
    <div class="about-wrapper" style="background: transparent;">
        <div class="container">
            <!-- Story Grid -->
            <div class="story-grid">
                <div class="heritage-text-box">
                    <style>
                        .heritage-text-box {
                            padding: 20px;
                            border-radius: 12px;
                            transition: all 0.4s ease;
                            cursor: default;
                        }
                        .heritage-text-box:hover {
                            background: rgba(255, 255, 255, 0.4);
                            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                            transform: translateY(-2px);
                        }
                        .heritage-text-box h2 {
                            transition: color 0.4s ease;
                        }
                        .heritage-text-box:hover h2 {
                            color: #d68910 !important; /* Aesthetic gold/spice accent */
                        }
                        .heritage-text-box p {
                            transition: color 0.4s ease;
                        }
                        .heritage-text-box:hover p {
                            color: #111 !important; /* Darken text slightly on hover for readability */
                        }
                    </style>
                    <span class="about-subtitle">Our Heritage</span>
                    <h2 class="about-title" style="color: #1b4332;">Bringing Authentic Homemade Taste To Every Kitchen</h2>
                    <p style="color: var(--text-main); line-height: 1.8; margin-bottom: 16px;">
                        Rithamaya Food Products was born out of a passion to revive genuine, traditional recipes passed down through generations in Karnataka. 
                    </p>
                    <p style="color: var(--text-main); line-height: 1.8;">
                        In an era dominated by mass-manufactured, chemically enhanced spice blends and processed cereals, we remain committed to 100% sun-dried whole spices, slow roasting, and handpicked natural grains.
                    </p>
                </div>
                <div style="perspective: 1000px; transform-style: preserve-3d;">
                    <style>
                        @keyframes floating3DHeritage {
                            0% { transform: rotateX(5deg) rotateY(-8deg) translateY(0px) scale(1); box-shadow: -10px 15px 30px rgba(0,0,0,0.15); }
                            50% { transform: rotateX(-5deg) rotateY(8deg) translateY(-15px) scale(1.02); box-shadow: 15px 30px 45px rgba(0,0,0,0.25); }
                            100% { transform: rotateX(5deg) rotateY(-8deg) translateY(0px) scale(1); box-shadow: -10px 15px 30px rgba(0,0,0,0.15); }
                        }
                        .heritage-3d-img {
                            border-radius: 20px;
                            width: 100%;
                            animation: floating3DHeritage 8s ease-in-out infinite;
                        }
                    </style>
                    <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop" alt="Rithamaya Kitchen Spices" class="heritage-3d-img">
                </div>
            </div>
        </div>
    </div>

    <div class="container" style="padding-bottom: 80px;">
        <!-- Core Values -->
        <div class="section-title" style="margin-top: 20px; margin-bottom: 40px; text-align: center;">
            <span class="about-subtitle" style="margin: 0 auto 10px; display: inline-block;">Pillars of Trust</span>
            <h2 class="about-title" style="font-size: 2.2rem; margin-bottom: 0;">Why Families Love Rithamaya</h2>
        </div>

        <div class="about-feature-grid">
            <div class="about-feature-card">
                <div class="about-feature-icon"><i class="fas fa-leaf" style="font-size: 1.2rem;"></i></div>
                <h3 class="about-feature-title">100% Homemade</h3>
                <p class="about-feature-desc">Slow roasted & ground according to authentic heritage recipes.</p>
            </div>

            <div class="about-feature-card">
                <div class="about-feature-icon"><i class="fas fa-shield-alt" style="font-size: 1.2rem;"></i></div>
                <h3 class="about-feature-title">No Preservatives</h3>
                <p class="about-feature-desc">Zero artificial colors, chemicals, or synthetic additives guaranteed.</p>
            </div>

            <div class="about-feature-card">
                <div class="about-feature-icon"><i class="fas fa-seedling" style="font-size: 1.2rem;"></i></div>
                <h3 class="about-feature-title">Farm Fresh Spices</h3>
                <p class="about-feature-desc">Directly sourced sun-dried ingredients for maximal aroma.</p>
            </div>

            <div class="about-feature-card">
                <div class="about-feature-icon"><i class="fas fa-truck" style="font-size: 1.2rem;"></i></div>
                <h3 class="about-feature-title">Pan-India Shipping</h3>
                <p class="about-feature-desc">Hassle-free safe doorstep delivery across all pin codes.</p>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
