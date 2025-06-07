// Main application functionality

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const userAvatar = document.querySelector('.user-avatar');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('nav a, .mobile-menu a, .footer-col a[data-page]');
    const pages = document.querySelectorAll('.page');
    const studentCta = document.getElementById('student-cta');
    const recruiterCta = document.getElementById('recruiter-cta');
    const testimonialNext = document.querySelector('.testimonial-next');
    const testimonialPrev = document.querySelector('.testimonial-prev');
    const testimonialDots = document.querySelectorAll('.testimonial-dots span');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    // User dropdown menu toggle
    if (userAvatar) {
        userAvatar.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });
    }
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (dropdownMenu && dropdownMenu.classList.contains('active')) {
            if (!dropdownMenu.contains(e.target) && e.target !== userAvatar) {
                dropdownMenu.classList.remove('active');
            }
        }
    });
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // Animate the hamburger to X
            const spans = mobileMenuToggle.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Page navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            if (!targetPage) return;
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Highlight the corresponding link in all menus
            document.querySelectorAll(`[data-page="${targetPage}"]`).forEach(el => {
                el.classList.add('active');
            });
            
            // Hide all pages
            pages.forEach(page => page.classList.remove('active'));
            
            // Show the target page
            const targetElement = document.getElementById(targetPage);
            if (targetElement) {
                targetElement.classList.add('active');
                window.scrollTo(0, 0);
            } else {
                // If page isn't loaded yet, load it dynamically
                loadPage(targetPage);
            }
            
            // Close mobile menu if open
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenuToggle.click();
            }
        });
    });
    
    // Call-to-action buttons
    if (studentCta) {
        studentCta.addEventListener('click', function() {
            const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
            
            if (!user) {
                // If not logged in, show login form
                document.querySelector('[data-target="login"]').click();
                document.querySelector('[name="user-type-login"][value="student"]').checked = true;
                document.getElementById('auth-container').classList.add('active');
                document.getElementById('main-container').classList.remove('active');
            } else if (user.userType === 'student') {
                // Go to profile/dashboard
                navigateTo('profile');
            } else {
                // If logged in as recruiter, suggest switching
                showNotification('Vous êtes connecté en tant que recruteur. Veuillez vous reconnecter en tant qu\'étudiant.', 'error');
            }
        });
    }
    
    if (recruiterCta) {
        recruiterCta.addEventListener('click', function() {
            const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
            
            if (!user) {
                // If not logged in, show login form
                document.querySelector('[data-target="login"]').click();
                document.querySelector('[name="user-type-login"][value="recruiter"]').checked = true;
                document.getElementById('auth-container').classList.add('active');
                document.getElementById('main-container').classList.remove('active');
            } else if (user.userType === 'recruiter') {
                // Go to profile/dashboard
                navigateTo('dashboard');
            } else {
                // If logged in as student, suggest switching
                showNotification('Vous êtes connecté en tant qu\'étudiant. Veuillez vous reconnecter en tant que recruteur.', 'error');
            }
        });
    }
    
    // Testimonial slider
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        testimonialDots.forEach(dot => dot.classList.remove('active'));
        
        testimonialCards[index].classList.add('active');
        testimonialDots[index].classList.add('active');
        currentTestimonial = index;
    }
    
    if (testimonialNext) {
        testimonialNext.addEventListener('click', function() {
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            showTestimonial(currentTestimonial);
        });
    }
    
    if (testimonialPrev) {
        testimonialPrev.addEventListener('click', function() {
            currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
            showTestimonial(currentTestimonial);
        });
    }
    
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showTestimonial(index);
        });
    });
    
    // Auto rotate testimonials
    setInterval(function() {
        if (document.querySelector('.testimonials-slider:hover')) {
            return; // Don't rotate if user is hovering over slider
        }
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Dynamic page loading
    function loadPage(pageName) {
        // This would normally fetch the page content from the server
        // For the demo, we'll create the pages directly in JS
        
        const mainElement = document.querySelector('main');
        let pageContent = '';
        
        switch(pageName) {
            case 'profile':
                pageContent = createProfilePage();
                break;
            case 'dashboard':
                pageContent = createDashboardPage();
                break;
            case 'jobs':
                pageContent = createJobsPage();
                break;
            case 'blog':
                pageContent = createBlogPage();
                break;
            case 'about':
                pageContent = createAboutPage();
                break;
            case 'contact':
                pageContent = createContactPage();
                break;
            case 'messages':
                pageContent = createMessagesPage();
                break;
            default:
                pageContent = '<section id="' + pageName + '" class="page active"><div class="container"><h1>Page en construction</h1><p>Cette page est en cours de développement.</p></div></section>';
        }
        
        mainElement.innerHTML += pageContent;
        
        // Initialize any special elements on the newly loaded page
        initializePageElements(pageName);
    }
    
    function initializePageElements(pageName) {
        // Add event listeners or initialize components specific to each page
        if (pageName === 'profile') {
            initProfilePage();
        } else if (pageName === 'dashboard') {
            initDashboardPage();
        } else if (pageName === 'jobs') {
            initJobsPage();
        } else if (pageName === 'messages') {
            initMessagesPage();
        }
    }
    
    function navigateTo(pageName) {
        const link = document.querySelector(`[data-page="${pageName}"]`);
        if (link) {
            link.click();
        }
    }
    
    // Create page functions
    function createProfilePage() {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        
        if (!user) {
            return '<section id="profile" class="page active"><div class="container"><h1>Non autorisé</h1><p>Veuillez vous connecter pour accéder à cette page.</p></div></section>';
        }
        
        // Different UI for student vs recruiter
        if (user.userType === 'student') {
            return `
                <section id="profile" class="page active">
                    <div class="container">
                        <div class="page-header">
                            <h1>Mon Profil Étudiant</h1>
                            <p>Gérez votre profil et CV pour attirer les recruteurs</p>
                        </div>
                        
                        <div class="profile-grid">
                            <div class="profile-sidebar">
                                <div class="profile-image-container">
                                    <div class="profile-image">
                                        <img src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Photo de profil">
                                        <button class="change-photo-btn">
                                            <i class="fas fa-camera"></i>
                                        </button>
                                    </div>
                                    <h2>${user.name}</h2>
                                    <p>Étudiant en Master Informatique</p>
                                </div>
                                
                                <div class="profile-stats">
                                    <div class="stat">
                                        <span class="stat-value">5</span>
                                        <span class="stat-label">Candidatures</span>
                                    </div>
                                    <div class="stat">
                                        <span class="stat-value">3</span>
                                        <span class="stat-label">Entretiens</span>
                                    </div>
                                    <div class="stat">
                                        <span class="stat-value">85%</span>
                                        <span class="stat-label">Profil complété</span>
                                    </div>
                                </div>
                                
                                <div class="profile-menu">
                                    <a href="#" class="active" data-section="info">
                                        <i class="fas fa-user"></i> Informations personnelles
                                    </a>
                                    <a href="#" data-section="education">
                                        <i class="fas fa-graduation-cap"></i> Formation
                                    </a>
                                    <a href="#" data-section="experience">
                                        <i class="fas fa-briefcase"></i> Expérience
                                    </a>
                                    <a href="#" data-section="skills">
                                        <i class="fas fa-star"></i> Compétences
                                    </a>
                                    <a href="#" data-section="cv">
                                        <i class="fas fa-file-alt"></i> CV et documents
                                    </a>
                                </div>
                            </div>
                            
                            <div class="profile-content">
                                <!-- Personal Info Section -->
                                <div class="profile-section active" id="info-section">
                                    <div class="section-header">
                                        <h3>Informations personnelles</h3>
                                        <button class="edit-btn"><i class="fas fa-edit"></i> Modifier</button>
                                    </div>
                                    
                                    <div class="info-grid">
                                        <div class="info-item">
                                            <span class="label">Nom complet</span>
                                            <span class="value">${user.name}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">Email</span>
                                            <span class="value">${user.email}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">Téléphone</span>
                                            <span class="value">+221 77 123 45 67</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">Date de naissance</span>
                                            <span class="value">15/05/1998</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">Adresse</span>
                                            <span class="value">Dakar, Sénégal</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">Niveau d'études</span>
                                            <span class="value">Master 2</span>
                                        </div>
                                        <div class="info-item wide">
                                            <span class="label">À propos de moi</span>
                                            <span class="value">Étudiant passionné d'informatique avec une spécialisation en développement web et applications mobiles. Je recherche un stage de fin d'études à partir de juin 2025.</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Education Section -->
                                <div class="profile-section" id="education-section">
                                    <div class="section-header">
                                        <h3>Formation</h3>
                                        <button class="edit-btn"><i class="fas fa-plus"></i> Ajouter</button>
                                    </div>
                                    
                                    <div class="timeline">
                                        <div class="timeline-item">
                                            <div class="timeline-dot"></div>
                                            <div class="timeline-content">
                                                <div class="timeline-header">
                                                    <h4>Master en Informatique</h4>
                                                    <span class="date">2023 - 2025</span>
                                                </div>
                                                <div class="timeline-institution">Université Cheikh Anta Diop, Dakar</div>
                                                <p>Spécialisation en développement web et mobile. Projet de fin d'études: Application de gestion pour PME sénégalaises.</p>
                                                <div class="timeline-actions">
                                                    <button class="action-btn"><i class="fas fa-edit"></i></button>
                                                    <button class="action-btn"><i class="fas fa-trash"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="timeline-item">
                                            <div class="timeline-dot"></div>
                                            <div class="timeline-content">
                                                <div class="timeline-header">
                                                    <h4>Licence en Informatique</h4>
                                                    <span class="date">2020 - 2023</span>
                                                </div>
                                                <div class="timeline-institution">Université Cheikh Anta Diop, Dakar</div>
                                                <p>Formation générale en informatique avec une attention particulière aux algorithmes et structures de données.</p>
                                                <div class="timeline-actions">
                                                    <button class="action-btn"><i class="fas fa-edit"></i></button>
                                                    <button class="action-btn"><i class="fas fa-trash"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Experience Section -->
                                <div class="profile-section" id="experience-section">
                                    <div class="section-header">
                                        <h3>Expérience</h3>
                                        <button class="edit-btn"><i class="fas fa-plus"></i> Ajouter</button>
                                    </div>
                                    
                                    <div class="timeline">
                                        <div class="timeline-item">
                                            <div class="timeline-dot"></div>
                                            <div class="timeline-content">
                                                <div class="timeline-header">
                                                    <h4>Stagiaire Développeur Web</h4>
                                                    <span class="date">Juin - Août 2024</span>
                                                </div>
                                                <div class="timeline-institution">TechSenegal, Dakar</div>
                                                <p>Développement front-end pour une application de gestion de stock. Utilisation de React.js et API REST.</p>
                                                <div class="timeline-actions">
                                                    <button class="action-btn"><i class="fas fa-edit"></i></button>
                                                    <button class="action-btn"><i class="fas fa-trash"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="timeline-item">
                                            <div class="timeline-dot"></div>
                                            <div class="timeline-content">
                                                <div class="timeline-header">
                                                    <h4>Projet Académique</h4>
                                                    <span class="date">Février - Mai 2023</span>
                                                </div>
                                                <div class="timeline-institution">Université Cheikh Anta Diop</div>
                                                <p>Développement d'une application mobile de livraison de repas pour le campus universitaire.</p>
                                                <div class="timeline-actions">
                                                    <button class="action-btn"><i class="fas fa-edit"></i></button>
                                                    <button class="action-btn"><i class="fas fa-trash"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Skills Section -->
                                <div class="profile-section" id="skills-section">
                                    <div class="section-header">
                                        <h3>Compétences</h3>
                                        <button class="edit-btn"><i class="fas fa-edit"></i> Modifier</button>
                                    </div>
                                    
                                    <div class="skills-container">
                                        <div class="skills-category">
                                            <h4>Développement Web</h4>
                                            <div class="skills-list">
                                                <span class="skill-tag">HTML5</span>
                                                <span class="skill-tag">CSS3</span>
                                                <span class="skill-tag">JavaScript</span>
                                                <span class="skill-tag">React.js</span>
                                                <span class="skill-tag">Node.js</span>
                                                <span class="skill-tag">PHP</span>
                                            </div>
                                        </div>
                                        
                                        <div class="skills-category">
                                            <h4>Bases de données</h4>
                                            <div class="skills-list">
                                                <span class="skill-tag">MySQL</span>
                                                <span class="skill-tag">MongoDB</span>
                                                <span class="skill-tag">PostgreSQL</span>
                                            </div>
                                        </div>
                                        
                                        <div class="skills-category">
                                            <h4>Autres compétences</h4>
                                            <div class="skills-list">
                                                <span class="skill-tag">Git</span>
                                                <span class="skill-tag">Agile/Scrum</span>
                                                <span class="skill-tag">UI/UX Design</span>
                                                <span class="skill-tag">Gestion de projet</span>
                                            </div>
                                        </div>
                                        
                                        <div class="skills-category">
                                            <h4>Langues</h4>
                                            <div class="language-skills">
                                                <div class="language-skill">
                                                    <span class="language">Français</span>
                                                    <div class="language-level">
                                                        <span class="level-dot active"></span>
                                                        <span class="level-dot active"></span>
                                                        <span class="level-dot active"></span>
                                                        <span class="level-dot active"></span>
                                                        <span class="level-dot active"></span>
                                                    </div>
                                                </div>
                                                <div class="language-skill">
                                                    <span class="language">Anglais</span>
                                                    <div class="language-level">
                                                        <span class="level-dot active"></span>
                                                        <span class="level-dot active"></span>
                                                        <span class="level-dot active"></span>
                                                        <span class="level-dot"></span>
                                                        <span class="level-dot"></span>
                                                    </div>
                                                </div>
                                                <div class="language-skill">
                                                    <span class="language">Wolof</span>
                                                    <div class="language-level">
                                                        <span class="level-dot active"></span>
                                                        <span class="level-dot active"></span>
                                                        <span class="level-dot active"></span>
                                                        <span class="level-dot active"></span>
                                                        <span class="level-dot active"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- CV Section -->
                                <div class="profile-section" id="cv-section">
                                    <div class="section-header">
                                        <h3>CV et documents</h3>
                                        <button class="edit-btn"><i class="fas fa-upload"></i> Téléverser</button>
                                    </div>
                                    
                                    <div class="documents-list">
                                        <div class="document-card">
                                            <div class="document-icon">
                                                <i class="fas fa-file-pdf"></i>
                                            </div>
                                            <div class="document-info">
                                                <h4>CV_FatouDiop_2025.pdf</h4>
                                                <span class="document-date">Mis à jour le 15/03/2025</span>
                                            </div>
                                            <div class="document-actions">
                                                <button class="action-btn primary"><i class="fas fa-eye"></i> Voir</button>
                                                <button class="action-btn"><i class="fas fa-trash"></i></button>
                                            </div>
                                        </div>
                                        
                                        <div class="document-card">
                                            <div class="document-icon">
                                                <i class="fas fa-file-word"></i>
                                            </div>
                                            <div class="document-info">
                                                <h4>Lettre_Motivation.docx</h4>
                                                <span class="document-date">Mis à jour le 10/02/2025</span>
                                            </div>
                                            <div class="document-actions">
                                                <button class="action-btn primary"><i class="fas fa-eye"></i> Voir</button>
                                                <button class="action-btn"><i class="fas fa-trash"></i></button>
                                            </div>
                                        </div>
                                        
                                        <div class="document-card">
                                            <div class="document-icon">
                                                <i class="fas fa-file-pdf"></i>
                                            </div>
                                            <div class="document-info">
                                                <h4>Diplome_Licence.pdf</h4>
                                                <span class="document-date">Mis à jour le 20/01/2025</span>
                                            </div>
                                            <div class="document-actions">
                                                <button class="action-btn primary"><i class="fas fa-eye"></i> Voir</button>
                                                <button class="action-btn"><i class="fas fa-trash"></i></button>
                                            </div>
                                        </div>
                                        
                                        <div class="document-upload">
                                            <i class="fas fa-plus-circle"></i>
                                            <span>Ajouter un document</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `;
        } else {
            // Recruiter profile
            return `
                <section id="profile" class="page active">
                    <div class="container">
                        <div class="page-header">
                            <h1>Mon Profil Recruteur</h1>
                            <p>Gérez votre profil et informations de l'entreprise</p>
                        </div>
                        
                        <div class="profile-grid">
                            <div class="profile-sidebar">
                                <div class="profile-image-container">
                                    <div class="profile-image company">
                                        <img src="images/image10.JPG" alt="Logo entreprise">
                                        <button class="change-photo-btn">
                                            <i class="fas fa-camera"></i>
                                        </button>
                                    </div>
                                    <h2>TechSenegal</h2>
                                    <p>Entreprise de développement logiciel</p>
                                </div>
                                
                                <div class="profile-stats">
                                    <div class="stat">
                                        <span class="stat-value">8</span>
                                        <span class="stat-label">Offres publiées</span>
                                    </div>
                                    <div class="stat">
                                        <span class="stat-value">42</span>
                                        <span class="stat-label">Candidatures</span>
                                    </div>
                                    <div class="stat">
                                        <span class="stat-value">90%</span>
                                        <span class="stat-label">Profil complété</span>
                                    </div>
                                </div>
                                
                                <div class="profile-menu">
                                    <a href="#" class="active" data-section="company">
                                        <i class="fas fa-building"></i> Informations entreprise
                                    </a>
                                    <a href="#" data-section="contact">
                                        <i class="fas fa-address-card"></i> Coordonnées
                                    </a>
                                    <a href="#" data-section="team">
                                        <i class="fas fa-users"></i> Équipe
                                    </a>
                                    <a href="#" data-section="documents">
                                        <i class="fas fa-file-alt"></i> Documents
                                    </a>
                                </div>
                            </div>
                            
                            <div class="profile-content">
                                <!-- Company Info Section -->
                                <div class="profile-section active" id="company-section">
                                    <div class="section-header">
                                        <h3>Informations entreprise</h3>
                                        <button class="edit-btn"><i class="fas fa-edit"></i> Modifier</button>
                                    </div>
                                    
                                    <div class="info-grid">
                                        <div class="info-item">
                                            <span class="label">Nom de l'entreprise</span>
                                            <span class="value">TechSenegal</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">Secteur d'activité</span>
                                            <span class="value">Développement logiciel</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">Taille de l'entreprise</span>
                                            <span class="value">50-100 employés</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">Année de création</span>
                                            <span class="value">2015</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">Site web</span>
                                            <span class="value">www.techsenegal.sn</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">Localisation</span>
                                            <span class="value">Dakar, Sénégal</span>
                                        </div>
                                        <div class="info-item wide">
                                            <span class="label">À propos de l'entreprise</span>
                                            <span class="value">TechSenegal est une entreprise de développement logiciel basée à Dakar, spécialisée dans la création d'applications web et mobiles innovantes pour les entreprises africaines. Fondée en 2015, nous avons pour mission de propulser la transformation digitale au Sénégal et dans toute l'Afrique de l'Ouest.</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Contact Section -->
                                <div class="profile-section" id="contact-section">
                                    <div class="section-header">
                                        <h3>Coordonnées</h3>
                                        <button class="edit-btn"><i class="fas fa-edit"></i> Modifier</button>
                                    </div>
                                    
                                    <div class="info-grid">
                                        <div class="info-item">
                                            <span class="label">Adresse</span>
                                            <span class="value">123 Rue Félix Faure, Dakar</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">Email</span>
                                            <span class="value">contact@techsenegal.sn</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">Téléphone</span>
                                            <span class="value">+221 33 123 45 67</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">LinkedIn</span>
                                            <span class="value">linkedin.com/company/techsenegal</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">Twitter</span>
                                            <span class="value">twitter.com/techsenegal</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">Facebook</span>
                                            <span class="value">facebook.com/techsenegal</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Team Section -->
                                <div class="profile-section" id="team-section">
                                    <div class="section-header">
                                        <h3>Équipe</h3>
                                        <button class="edit-btn"><i class="fas fa-plus"></i> Ajouter</button>
                                    </div>
                                    
                                    <div class="team-members">
                                        <div class="team-member">
                                            <div class="team-member-image">
                                                <img src="images/image1.JPG" alt="Membre d'équipe">
                                            </div>
                                            <div class="team-member-info">
                                                <h4>${user.name}</h4>
                                                <p>Directeur des Ressources Humaines</p>
                                                <a href="mailto:${user.email}">${user.email}</a>
                                            </div>
                                            <div class="team-member-actions">
                                                <button class="action-btn"><i class="fas fa-edit"></i></button>
                                                <button class="action-btn"><i class="fas fa-trash"></i></button>
                                            </div>
                                        </div>
                                        
                                        <div class="team-member">
                                            <div class="team-member-image">
                                                <img src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Membre d'équipe">
                                            </div>
                                            <div class="team-member-info">
                                                <h4>Marie Diallo</h4>
                                                <p>Directrice Technique</p>
                                                <a href="mailto:marie@techsenegal.sn">marie@techsenegal.sn</a>
                                            </div>
                                            <div class="team-member-actions">
                                                <button class="action-btn"><i class="fas fa-edit"></i></button>
                                                <button class="action-btn"><i class="fas fa-trash"></i></button>
                                            </div>
                                        </div>
                                        
                                        <div class="team-member">
                                            <div class="team-member-image">
                                                <img src="https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Membre d'équipe">
                                            </div>
                                            <div class="team-member-info">
                                                <h4>Omar Seck</h4>
                                                <p>Responsable Recrutement</p>
                                                <a href="mailto:omar@techsenegal.sn">omar@techsenegal.sn</a>
                                            </div>
                                            <div class="team-member-actions">
                                                <button class="action-btn"><i class="fas fa-edit"></i></button>
                                                <button class="action-btn"><i class="fas fa-trash"></i></button>
                                            </div>
                                        </div>
                                        
                                        <div class="team-member-add">
                                            <i class="fas fa-plus-circle"></i>
                                            <span>Ajouter un membre</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Documents Section -->
                                <div class="profile-section" id="documents-section">
                                    <div class="section-header">
                                        <h3>Documents</h3>
                                        <button class="edit-btn"><i class="fas fa-upload"></i> Téléverser</button>
                                    </div>
                                    
                                    <div class="documents-list">
                                        <div class="document-card">
                                            <div class="document-icon">
                                                <i class="fas fa-file-pdf"></i>
                                            </div>
                                            <div class="document-info">
                                                <h4>Brochure_Entreprise.pdf</h4>
                                                <span class="document-date">Mis à jour le 10/01/2025</span>
                                            </div>
                                            <div class="document-actions">
                                                <button class="action-btn primary"><i class="fas fa-eye"></i> Voir</button>
                                                <button class="action-btn"><i class="fas fa-trash"></i></button>
                                            </div>
                                        </div>
                                        
                                        <div class="document-card">
                                            <div class="document-icon">
                                                <i class="fas fa-file-pdf"></i>
                                            </div>
                                            <div class="document-info">
                                                <h4>Politique_Stage.pdf</h4>
                                                <span class="document-date">Mis à jour le 05/02/2025</span>
                                            </div>
                                            <div class="document-actions">
                                                <button class="action-btn primary"><i class="fas fa-eye"></i> Voir</button>
                                                <button class="action-btn"><i class="fas fa-trash"></i></button>
                                            </div>
                                        </div>
                                        
                                        <div class="document-upload">
                                            <i class="fas fa-plus-circle"></i>
                                            <span>Ajouter un document</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `;
        }
    }
    
    function createDashboardPage() {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        
        if (!user) {
            return '<section id="dashboard" class="page active"><div class="container"><h1>Non autorisé</h1><p>Veuillez vous connecter pour accéder à cette page.</p></div></section>';
        }
        
        // Different dashboard for student vs recruiter
        if (user.userType === 'student') {
            return `
                <section id="dashboard" class="page active">
                    <div class="container">
                        <div class="page-header">
                            <h1>Tableau de bord étudiant</h1>
                            <p>Suivez vos candidatures et découvrez de nouvelles opportunités</p>
                        </div>
                        
                        <div class="dashboard-grid">
                            <div class="dashboard-sidebar">
                                <div class="quick-stats">
                                    <div class="stat-card">
                                        <div class="stat-icon">
                                            <i class="fas fa-briefcase"></i>
                                        </div>
                                        <div class="stat-info">
                                            <h3>5</h3>
                                            <p>Candidatures</p>
                                        </div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-icon">
                                            <i class="fas fa-comments"></i>
                                        </div>
                                        <div class="stat-info">
                                            <h3>3</h3>
                                            <p>Entretiens</p>
                                        </div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-icon">
                                            <i class="fas fa-star"></i>
                                        </div>
                                        <div class="stat-info">
                                            <h3>12</h3>
                                            <p>Offres favorites</p>
                                        </div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-icon">
                                            <i class="fas fa-eye"></i>
                                        </div>
                                        <div class="stat-info">
                                            <h3>25</h3>
                                            <p>Vues du profil</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="profile-completion">
                                    <h3>Complétez votre profil</h3>
                                    <div class="progress-container">
                                        <div class="progress-bar" style="width: 85%;">85%</div>
                                    </div>
                                    <p>Un profil complet augmente vos chances d'être contacté !</p>
                                    <button class="btn-secondary">Compléter mon profil</button>
                                </div>
                                
                                <div class="upcoming-events">
                                    <h3>Événements à venir</h3>
                                    <div class="event-card">
                                        <div class="event-date">
                                            <span class="day">15</span>
                                            <span class="month">Mai</span>
                                        </div>
                                        <div class="event-info">
                                            <h4>Forum de l'emploi</h4>
                                            <p>UCAD, Dakar</p>
                                        </div>
                                    </div>
                                    <div class="event-card">
                                        <div class="event-date">
                                            <span class="day">20</span>
                                            <span class="month">Mai</span>
                                        </div>
                                        <div class="event-info">
                                            <h4>Webinaire: CV parfait</h4>
                                            <p>En ligne, 15h00</p>
                                        </div>
                                    </div>
                                    <a href="#" class="more-link">Voir tous les événements</a>
                                </div>
                            </div>
                            
                            <div class="dashboard-content">
                                <div class="recent-applications">
                                    <div class="section-header">
                                        <h3>Mes candidatures récentes</h3>
                                        <a href="#" class="view-all">Voir tout</a>
                                    </div>
                                    
                                    <div class="applications-list">
                                        <div class="application-card">
                                            <div class="company-logo">
                                                <img src="images/image10.png" alt="Logo entreprise">
                                            </div>
                                            <div class="application-info">
                                                <h4>Développeur Front-end</h4>
                                                <div class="company-name">TechSenegal</div>
                                                <div class="application-meta">
                                                    <span><i class="fas fa-map-marker-alt"></i> Dakar</span>
                                                    <span><i class="fas fa-clock"></i> Il y a 3 jours</span>
                                                </div>
                                            </div>
                                            <div class="application-status success">
                                                <span>Entretien</span>
                                            </div>
                                        </div>
                                        
                                        <div class="application-card">
                                            <div class="company-logo">
                                                <img src="images/image11.jpg" alt="Logo entreprise">
                                            </div>
                                            <div class="application-info">
                                                <h4>Stagiaire Data Analyst</h4>
                                                <div class="company-name">SenData</div>
                                                <div class="application-meta">
                                                    <span><i class="fas fa-map-marker-alt"></i> Dakar</span>
                                                    <span><i class="fas fa-clock"></i> Il y a 5 jours</span>
                                                </div>
                                            </div>
                                            <div class="application-status warning">
                                                <span>En attente</span>
                                            </div>
                                        </div>
                                        
                                        <div class="application-card">
                                            <div class="company-logo">
                                                <img src="images/image12.jpeg" alt="Logo entreprise">
                                            </div>
                                            <div class="application-info">
                                                <h4>Développeur Mobile</h4>
                                                <div class="company-name">MobileSN</div>
                                                <div class="application-meta">
                                                    <span><i class="fas fa-map-marker-alt"></i> Dakar</span>
                                                    <span><i class="fas fa-clock"></i> Il y a 1 semaine</span>
                                                </div>
                                            </div>
                                            <div class="application-status error">
                                                <span>Refusée</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="recommended-jobs">
                                    <div class="section-header">
                                        <h3>Offres recommandées pour vous</h3>
                                        <a href="#" class="view-all" data-page="jobs">Voir tout</a>
                                    </div>
                                    
                                    <div class="jobs-grid">
                                        <div class="job-card">
                                            <div class="job-card-header">
                                                <div class="company-logo">
                                                    <img src="images/image13.png" alt="Logo entreprise">
                                                </div>
                                                <div class="save-job">
                                                    <i class="far fa-heart"></i>
                                                </div>
                                            </div>
                                            <div class="job-card-content">
                                                <h4>Développeur Full Stack</h4>
                                                <div class="company-name">WebSen Technologies</div>
                                                <div class="job-tags">
                                                    <span>CDI</span>
                                                    <span>Junior</span>
                                                </div>
                                                <div class="job-meta">
                                                    <span><i class="fas fa-map-marker-alt"></i> Dakar</span>
                                                    <span><i class="fas fa-money-bill-wave"></i> 800k - 1.2M FCFA</span>
                                                </div>
                                                <p class="job-description">
                                                    Développement d'applications web avec React et Node.js. Expérience en développement full stack requise.
                                                </p>
                                            </div>
                                            <div class="job-card-footer">
                                                <button class="btn-primary">Postuler</button>
                                                <span class="job-date">Publiée il y a 2 jours</span>
                                            </div>
                                        </div>
                                        
                                        <div class="job-card">
                                            <div class="job-card-header">
                                                <div class="company-logo">
                                                    <img src="images/image14.jpeg" alt="Logo entreprise">
                                                </div>
                                                <div class="save-job saved">
                                                    <i class="fas fa-heart"></i>
                                                </div>
                                            </div>
                                            <div class="job-card-content">
                                                <h4>UX/UI Designer</h4>
                                                <div class="company-name">DesignLab Senegal</div>
                                                <div class="job-tags">
                                                    <span>Stage</span>
                                                    <span>3-6 mois</span>
                                                </div>
                                                <div class="job-meta">
                                                    <span><i class="fas fa-map-marker-alt"></i> Dakar</span>
                                                    <span><i class="fas fa-money-bill-wave"></i> 250k FCFA</span>
                                                </div>
                                                <p class="job-description">
                                                    Conception d'interfaces utilisateur pour applications web et mobile. Bonnes connaissances en Figma requises.
                                                </p>
                                            </div>
                                            <div class="job-card-footer">
                                                <button class="btn-primary">Postuler</button>
                                                <span class="job-date">Publiée il y a 5 jours</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="activity-timeline">
                                    <div class="section-header">
                                        <h3>Activités récentes</h3>
                                    </div>
                                    
                                    <div class="timeline">
                                        <div class="timeline-item">
                                            <div class="timeline-dot"></div>
                                            <div class="timeline-content">
                                                <div class="timeline-date">Aujourd'hui</div>
                                                <div class="timeline-event">
                                                    <i class="fas fa-eye"></i>
                                                    <p>Votre profil a été consulté par <strong>TechSenegal</strong></p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="timeline-item">
                                            <div class="timeline-dot"></div>
                                            <div class="timeline-content">
                                                <div class="timeline-date">Hier</div>
                                                <div class="timeline-event">
                                                    <i class="fas fa-file-alt"></i>
                                                    <p>Vous avez mis à jour votre CV</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="timeline-item">
                                            <div class="timeline-dot"></div>
                                            <div class="timeline-content">
                                                <div class="timeline-date">Il y a 3 jours</div>
                                                <div class="timeline-event">
                                                    <i class="fas fa-briefcase"></i>
                                                    <p>Vous avez postulé chez <strong>TechSenegal</strong> pour le poste de <strong>Développeur Front-end</strong></p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="timeline-item">
                                            <div class="timeline-dot"></div>
                                            <div class="timeline-content">
                                                <div class="timeline-date">Il y a 5 jours</div>
                                                <div class="timeline-event">
                                                    <i class="fas fa-briefcase"></i>
                                                    <p>Vous avez postulé chez <strong>SenData</strong> pour le poste de <strong>Stagiaire Data Analyst</strong></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `;
        } else {
            // Recruiter dashboard
            return `
                <section id="dashboard" class="page active">
                    <div class="container">
                        <div class="page-header">
                            <h1>Tableau de bord recruteur</h1>
                            <p>Gérez vos offres d'emploi et les candidatures</p>
                        </div>
                        
                        <div class="dashboard-grid">
                            <div class="dashboard-sidebar">
                                <div class="quick-stats">
                                    <div class="stat-card">
                                        <div class="stat-icon">
                                            <i class="fas fa-briefcase"></i>
                                        </div>
                                        <div class="stat-info">
                                            <h3>8</h3>
                                            <p>Offres publiées</p>
                                        </div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-icon">
                                            <i class="fas fa-users"></i>
                                        </div>
                                        <div class="stat-info">
                                            <h3>42</h3>
                                            <p>Candidatures</p>
                                        </div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-icon">
                                            <i class="fas fa-user-check"></i>
                                        </div>
                                        <div class="stat-info">
                                            <h3>5</h3>
                                            <p>Entretiens</p>
                                        </div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="stat-icon">
                                            <i class="fas fa-chart-line"></i>
                                        </div>
                                        <div class="stat-info">
                                            <h3>150</h3>
                                            <p>Vues des offres</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="quick-actions">
                                    <h3>Actions rapides</h3>
                                    <button class="btn-primary"><i class="fas fa-plus"></i> Nouvelle offre</button>
                                    <button class="btn-secondary"><i class="fas fa-search"></i> Rechercher des CV</button>
                                </div>
                                
                                <div class="subscription-info">
                                    <h3>Votre abonnement</h3>
                                    <div class="subscription-details">
                                        <p class="subscription-type">Premium</p>
                                        <div class="subscription-progress">
                                            <div class="progress-label">
                                                <span>Offres: 8/10</span>
                                                <span>Recherches CV: 12/20</span>
                                            </div>
                                            <div class="progress-container">
                                                <div class="progress-bar" style="width: 80%;">80%</div>
                                            </div>
                                        </div>
                                        <p class="subscription-expiry">Expire le: 31/12/2025</p>
                                        <button class="btn-secondary">Gérer l'abonnement</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="dashboard-content">
                                <div class="active-jobs">
                                    <div class="section-header">
                                        <h3>Offres actives</h3>
                                        <a href="#" class="view-all">Voir tout</a>
                                    </div>
                                    
                                    <div class="jobs-list">
                                        <div class="job-listing">
                                            <div class="job-info">
                                                <h4>Développeur Full Stack</h4>
                                                <div class="job-meta">
                                                    <span><i class="fas fa-map-marker-alt"></i> Dakar</span>
                                                    <span><i class="fas fa-clock"></i> Temps plein</span>
                                                    <span><i class="fas fa-calendar-alt"></i> Publiée il y a 5 jours</span>
                                                </div>
                                            </div>
                                            <div class="job-stats">
                                                <span class="stat"><i class="fas fa-eye"></i> 45 vues</span>
                                                <span class="stat"><i class="fas fa-users"></i> 12 candidats</span>
                                            </div>
                                            <div class="job-actions">
                                                <button class="action-btn"><i class="fas fa-edit"></i></button>
                                                <button class="action-btn"><i class="fas fa-pause"></i></button>
                                                <button class="action-btn"><i class="fas fa-trash"></i></button>
                                            </div>
                                        </div>
                                        
                                        <div class="job-listing">
                                            <div class="job-info">
                                                <h4>UX/UI Designer</h4>
                                                <div class="job-meta">
                                                    <span><i class="fas fa-map-marker-alt"></i> Dakar</span>
                                                    <span><i class="fas fa-clock"></i> Stage</span>
                                                    <span><i class="fas fa-calendar-alt"></i> Publiée il y a 1 semaine</span>
                                                </div>
                                            </div>
                                            <div class="job-stats">
                                                <span class="stat"><i class="fas fa-eye"></i> 38 vues</span>
                                                <span class="stat"><i class="fas fa-users"></i> 8 candidats</span>
                                            </div>
                                            <div class="job-actions">
                                                <button class="action-btn"><i class="fas fa-edit"></i></button>
                                                <button class="action-btn"><i class="fas fa-pause"></i></button>
                                                <button class="action-btn"><i class="fas fa-trash"></i></button>
                                            </div>
                                        </div>
                                        
                                        <div class="job-listing">
                                            <div class="job-info">
                                                <h4>Développeur Back-end</h4>
                                                <div class="job-meta">
                                                    <span><i class="fas fa-map-marker-alt"></i> Dakar</span>
                                                    <span><i class="fas fa-clock"></i> Temps plein</span>
                                                    <span><i class="fas fa-calendar-alt"></i> Publiée il y a 2 semaines</span>
                                                </div>
                                            </div>
                                            <div class="job-stats">
                                                <span class="stat"><i class="fas fa-eye"></i> 67 vues</span>
                                                <span class="stat"><i class="fas fa-users"></i> 22 candidats</span>
                                            </div>
                                            <div class="job-actions">
                                                <button class="action-btn"><i class="fas fa-edit"></i></button>
                                                <button class="action-btn"><i class="fas fa-pause"></i></button>
                                                <button class="action-btn"><i class="fas fa-trash"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="recent-applications">
                                    <div class="section-header">
                                        <h3>Candidatures récentes</h3>
                                        <a href="#" class="view-all">Voir tout</a>
                                    </div>
                                    
                                    <div class="applications-table">
                                        <div class="table-header">
                                            <div class="th">Candidat</div>
                                            <div class="th">Poste</div>
                                            <div class="th">Date</div>
                                            <div class="th">Statut</div>
                                            <div class="th">Actions</div>
                                        </div>
                                        
                                        <div class="table-row">
                                            <div class="td candidate">
                                                <div class="candidate-img">
                                                    <img src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Candidat">
                                                </div>
                                                <div class="candidate-info">
                                                    <h4>Fatou Diop</h4>
                                                    <p>Master Informatique</p>
                                                </div>
                                            </div>
                                            <div class="td">Développeur Full Stack</div>
                                            <div class="td">Aujourd'hui</div>
                                            <div class="td"><span class="status new">Nouveau</span></div>
                                            <div class="td actions">
                                                <button class="action-btn primary"><i class="fas fa-file-alt"></i></button>
                                                <button class="action-btn success"><i class="fas fa-check"></i></button>
                                                <button class="action-btn error"><i class="fas fa-times"></i></button>
                                            </div>
                                        </div>
                                        
                                        <div class="table-row">
                                            <div class="td candidate">
                                                <div class="candidate-img">
                                                    <img src="https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Candidat">
                                                </div>
                                                <div class="candidate-info">
                                                    <h4>Mamadou Ndiaye</h4>
                                                    <p>Licence Informatique</p>
                                                </div>
                                            </div>
                                            <div class="td">Développeur Back-end</div>
                                            <div class="td">Hier</div>
                                            <div class="td"><span class="status review">En cours</span></div>
                                            <div class="td actions">
                                                <button class="action-btn primary"><i class="fas fa-file-alt"></i></button>
                                                <button class="action-btn success"><i class="fas fa-check"></i></button>
                                                <button class="action-btn error"><i class="fas fa-times"></i></button>
                                            </div>
                                        </div>
                                        
                                        <div class="table-row">
                                            <div class="td candidate">
                                                <div class="candidate-img">
                                                    <img src="https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Candidat">
                                                </div>
                                                <div class="candidate-info">
                                                    <h4>Aïda Sow</h4>
                                                    <p>Master Design</p>
                                                </div>
                                            </div>
                                            <div class="td">UX/UI Designer</div>
                                            <div class="td">Il y a 3 jours</div>
                                            <div class="td"><span class="status interview">Entretien</span></div>
                                            <div class="td actions">
                                                <button class="action-btn primary"><i class="fas fa-file-alt"></i></button>
                                                <button class="action-btn success"><i class="fas fa-check"></i></button>
                                                <button class="action-btn error"><i class="fas fa-times"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="upcoming-interviews">
                                    <div class="section-header">
                                        <h3>Entretiens à venir</h3>
                                    </div>
                                    
                                    <div class="interviews-list">
                                        <div class="interview-card">
                                            <div class="interview-date">
                                                <span class="day">18</span>
                                                <span class="month">Mai</span>
                                            </div>
                                            <div class="interview-info">
                                                <h4>Entretien avec Aïda Sow</h4>
                                                <p>UX/UI Designer</p>
                                                <div class="interview-meta">
                                                    <span><i class="fas fa-clock"></i> 10:00 - 11:00</span>
                                                    <span><i class="fas fa-video"></i> Visioconférence</span>
                                                </div>
                                            </div>
                                            <div class="interview-actions">
                                                <button class="btn-secondary">Détails</button>
                                            </div>
                                        </div>
                                        
                                        <div class="interview-card">
                                            <div class="interview-date">
                                                <span class="day">20</span>
                                                <span class="month">Mai</span>
                                            </div>
                                            <div class="interview-info">
                                                <h4>Entretien avec Mamadou Ndiaye</h4>
                                                <p>Développeur Back-end</p>
                                                <div class="interview-meta">
                                                    <span><i class="fas fa-clock"></i> 14:00 - 15:00</span>
                                                    <span><i class="fas fa-map-marker-alt"></i> Bureau</span>
                                                </div>
                                            </div>
                                            <div class="interview-actions">
                                                <button class="btn-secondary">Détails</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `;
        }
    }
    
    function createJobsPage() {
        return `
            <section id="jobs" class="page active">
                <div class="container">
                    <div class="page-header">
                        <h1>Offres d'emploi</h1>
                        <p>Découvrez les opportunités professionnelles au Sénégal</p>
                    </div>
                    
                    <div class="jobs-search-filters">
                        <div class="search-bar">
                            <input type="text" placeholder="Rechercher un poste, une compétence...">
                            <button class="search-btn"><i class="fas fa-search"></i></button>
                        </div>
                        
                        <div class="filters">
                            <div class="filter">
                                <select>
                                    <option value="">Catégorie</option>
                                    <option value="dev">Développement</option>
                                    <option value="design">Design</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="finance">Finance</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>
                            
                            <div class="filter">
                                <select>
                                    <option value="">Type de contrat</option>
                                    <option value="fulltime">CDI</option>
                                    <option value="parttime">CDD</option>
                                    <option value="internship">Stage</option>
                                    <option value="freelance">Freelance</option>
                                </select>
                            </div>
                            
                            <div class="filter">
                                <select>
                                    <option value="">Lieu</option>
                                    <option value="dakar">Dakar</option>
                                    <option value="thies">Thiès</option>
                                    <option value="mbour">Mbour</option>
                                    <option value="remote">Télétravail</option>
                                </select>
                            </div>
                            
                            <div class="filter">
                                <select>
                                    <option value="">Expérience</option>
                                    <option value="entry">Débutant</option>
                                    <option value="mid">Intermédiaire</option>
                                    <option value="senior">Expérimenté</option>
                                </select>
                            </div>
                            
                            <button class="filters-reset"><i class="fas fa-redo"></i> Réinitialiser</button>
                        </div>
                    </div>
                    
                    <div class="jobs-layout">
                        <div class="layout-controls">
                            <span class="results-count">24 offres trouvées</span>
                            <div class="view-controls">
                                <button class="view-btn active" data-view="grid"><i class="fas fa-th-large"></i></button>
                                <button class="view-btn" data-view="list"><i class="fas fa-list"></i></button>
                                <select class="sort-select">
                                    <option value="recent">Plus récentes</option>
                                    <option value="relevant">Plus pertinentes</option>
                                    <option value="salary-high">Salaire: élevé à bas</option>
                                    <option value="salary-low">Salaire: bas à élevé</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="jobs-grid view-active">
                            <div class="job-card">
                                <div class="job-card-header">
                                    <div class="company-logo">
                                        <img src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Logo entreprise">
                                    </div>
                                    <div class="save-job">
                                        <i class="far fa-heart"></i>
                                    </div>
                                </div>
                                <div class="job-card-content">
                                    <h4>Développeur Full Stack</h4>
                                    <div class="company-name">TechSenegal</div>
                                    <div class="job-tags">
                                        <span>CDI</span>
                                        <span>Junior</span>
                                    </div>
                                    <div class="job-meta">
                                        <span><i class="fas fa-map-marker-alt"></i> Dakar</span>
                                        <span><i class="fas fa-money-bill-wave"></i> 800k - 1.2M FCFA</span>
                                    </div>
                                    <p class="job-description">
                                        Développement d'applications web avec React et Node.js. Expérience en développement full stack requise.
                                    </p>
                                </div>
                                <div class="job-card-footer">
                                    <button class="btn-primary">Postuler</button>
                                    <span class="job-date">Publiée il y a 2 jours</span>
                                </div>
                            </div>
                            
                            <div class="job-card">
                                <div class="job-card-header">
                                    <div class="company-logo">
                                        <img src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Logo entreprise">
                                    </div>
                                    <div class="save-job saved">
                                        <i class="fas fa-heart"></i>
                                    </div>
                                </div>
                                <div class="job-card-content">
                                    <h4>UX/UI Designer</h4>
                                    <div class="company-name">DesignLab Senegal</div>
                                    <div class="job-tags">
                                        <span>Stage</span>
                                        <span>3-6 mois</span>
                                    </div>
                                    <div class="job-meta">
                                        <span><i class="fas fa-map-marker-alt"></i> Dakar</span>
                                        <span><i class="fas fa-money-bill-wave"></i> 250k FCFA</span>
                                    </div>
                                    <p class="job-description">
                                        Conception d'interfaces utilisateur pour applications web et mobile. Bonnes connaissances en Figma requises.
                                    </p>
                                </div>
                                <div class="job-card-footer">
                                    <button class="btn-primary">Postuler</button>
                                    <span class="job-date">Publiée il y a 5 jours</span>
                                </div>
                            </div>
                            
                            <div class="job-card">
                                <div class="job-card-header">
                                    <div class="company-logo">
                                        <img src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Logo entreprise">
                                    </div>
                                    <div class="save-job">
                                        <i class="far fa-heart"></i>
                                    </div>
                                </div>
                                <div class="job-card-content">
                                    <h4>Data Analyst</h4>
                                    <div class="company-name">SenData</div>
                                    <div class="job-tags">
                                        <span>CDI</span>
                                        <span>Intermédiaire</span>
                                    </div>
                                    <div class="job-meta">
                                        <span><i class="fas fa-map-marker-alt"></i> Dakar</span>
                                        <span><i class="fas fa-money-bill-wave"></i> 1.0M - 1.5M FCFA</span>
                                    </div>
                                    <p class="job-description">
                                        Analyse de données, création de tableaux de bord et de rapports. Connaissance en Python et SQL nécessaire.
                                    </p>
                                </div>
                                <div class="job-card-footer">
                                    <button class="btn-primary">Postuler</button>
                                    <span class="job-date">Publiée il y a 1 semaine</span>
                                </div>
                            </div>
                            
                            <div class="job-card">
                                <div class="job-card-header">
                                    <div class="company-logo">
                                        <img src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Logo entreprise">
                                    </div>
                                    <div class="save-job">
                                        <i class="far fa-heart"></i>
                                    </div>
                                </div>
                                <div class="job-card-content">
                                    <h4>Développeur Mobile</h4>
                                    <div class="company-name">MobileSN</div>
                                    <div class="job-tags">
                                        <span>CDI</span>
                                        <span>Sénior</span>
                                    </div>
                                    <div class="job-meta">
                                        <span><i class="fas fa-map-marker-alt"></i> Dakar</span>
                                        <span><i class="fas fa-money-bill-wave"></i> 1.5M - 2.0M FCFA</span>
                                    </div>
                                    <p class="job-description">
                                        Développement d'applications mobiles Android et iOS. Expérience en React Native ou Flutter souhaitée.
                                    </p>
                                </div>
                                <div class="job-card-footer">
                                    <button class="btn-primary">Postuler</button>
                                    <span class="job-date">Publiée il y a 1 semaine</span>
                                </div>
                            </div>
                            
                            <div class="job-card">
                                <div class="job-card-header">
                                    <div class="company-logo">
                                        <img src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Logo entreprise">
                                    </div>
                                    <div class="save-job">
                                        <i class="far fa-heart"></i>
                                    </div>
                                </div>
                                <div class="job-card-content">
                                    <h4>Chef de Projet Digital</h4>
                                    <div class="company-name">AgenceSen</div>
                                    <div class="job-tags">
                                        <span>CDI</span>
                                        <span>Intermédiaire</span>
                                    </div>
                                    <div class="job-meta">
                                        <span><i class="fas fa-map-marker-alt"></i> Dakar</span>
                                        <span><i class="fas fa-money-bill-wave"></i> 1.2M - 1.8M FCFA</span>
                                    </div>
                                    <p class="job-description">
                                        Gestion de projets web et mobiles, coordination des équipes techniques et créatives, relation client.
                                    </p>
                                </div>
                                <div class="job-card-footer">
                                    <button class="btn-primary">Postuler</button>
                                    <span class="job-date">Publiée il y a 10 jours</span>
                                </div>
                            </div>
                            
                            <div class="job-card">
                                <div class="job-card-header">
                                    <div class="company-logo">
                                        <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Logo entreprise">
                                    </div>
                                    <div class="save-job">
                                        <i class="far fa-heart"></i>
                                    </div>
                                </div>
                                <div class="job-card-content">
                                    <h4>Responsable Marketing Digital</h4>
                                    <div class="company-name">SenMarketing</div>
                                    <div class="job-tags">
                                        <span>CDI</span>
                                        <span>Sénior</span>
                                    </div>
                                    <div class="job-meta">
                                        <span><i class="fas fa-map-marker-alt"></i> Dakar</span>
                                        <span><i class="fas fa-money-bill-wave"></i> 1.5M - 2.2M FCFA</span>
                                    </div>
                                    <p class="job-description">
                                        Élaboration et mise en œuvre de stratégies marketing digital. Expérience en SEO, SEM et réseaux sociaux requise.
                                    </p>
                                </div>
                                <div class="job-card-footer">
                                    <button class="btn-primary">Postuler</button>
                                    <span class="job-date">Publiée il y a 2 semaines</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="jobs-list">
                            <!-- Jobs in list view -->
                        </div>
                        
                        <div class="pagination">
                            <button class="pagination-prev disabled"><i class="fas fa-chevron-left"></i></button>
                            <div class="pagination-numbers">
                                <a href="#" class="active">1</a>
                                <a href="#">2</a>
                                <a href="#">3</a>
                                <a href="#">4</a>
                            </div>
                            <button class="pagination-next"><i class="fas fa-chevron-right"></i></button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    
    function createBlogPage() {
        return `
            <section id="blog" class="page active">
                <div class="container">
                    <div class="page-header">
                        <h1>Blog & Ressources</h1>
                        <p>Conseils, actualités et tendances sur l'emploi au Sénégal</p>
                    </div>
                    
                    <div class="blog-featured">
                        <div class="featured-post">
                            <div class="featured-img">
                                <img src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Featured post">
                            </div>
                            <div class="featured-content">
                                <div class="post-meta">
                                    <span class="category">Conseils</span>
                                    <span class="date">15 Mai 2025</span>
                                </div>
                                <h2>Comment réussir son entretien d'embauche en 2025</h2>
                                <p>Les entretiens d'embauche ont beaucoup évolué ces dernières années. Découvrez les nouvelles attentes des recruteurs et comment vous y préparer efficacement...</p>
                                <a href="#" class="read-more">Lire l'article <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="blog-categories">
                        <button class="category-filter active" data-category="all">Tous</button>
                        <button class="category-filter" data-category="conseils">Conseils</button>
                        <button class="category-filter" data-category="tendances">Tendances</button>
                        <button class="category-filter" data-category="entretien">Entretien</button>
                        <button class="category-filter" data-category="cv">CV</button>
                        <button class="category-filter" data-category="temoignages">Témoignages</button>
                    </div>
                    
                    <div class="blog-grid">
                        <div class="blog-card" data-category="cv">
                            <div class="blog-img">
                                <img src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Blog">
                            </div>
                            <div class="blog-content">
                                <span class="blog-category">Conseils CV</span>
                                <h3>5 astuces pour un CV qui se démarque</h3>
                                <div class="blog-meta">
                                    <span class="author">Par Fatou Diop</span>
                                    <span class="date">10 Mai 2025</span>
                                </div>
                                <p>Découvrez comment créer un CV percutant qui attirera l'attention des recruteurs et vous démarquera des autres candidats...</p>
                                <a href="#" class="read-more">Lire la suite <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                        
                        <div class="blog-card" data-category="entretien">
                            <div class="blog-img">
                                <img src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Blog">
                            </div>
                            <div class="blog-content">
                                <span class="blog-category">Entretien</span>
                                <h3>Comment réussir son entretien d'embauche</h3>
                                <div class="blog-meta">
                                    <span class="author">Par Amadou Sall</span>
                                    <span class="date">5 Mai 2025</span>
                                </div>
                                <p>Préparez-vous efficacement pour maximiser vos chances lors d'un entretien d'embauche avec ces conseils de professionnels...</p>
                                <a href="#" class="read-more">Lire la suite <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                        
                        <div class="blog-card" data-category="tendances">
                            <div class="blog-img">
                                <img src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Blog">
                            </div>
                            <div class="blog-content">
                                <span class="blog-category">Tendances</span>
                                <h3>Les secteurs qui recrutent au Sénégal en 2025</h3>
                                <div class="blog-meta">
                                    <span class="author">Par Ibrahima Ndiaye</span>
                                    <span class="date">1 Mai 2025</span>
                                </div>
                                <p>Analyse des domaines professionnels les plus dynamiques sur le marché sénégalais et les perspectives d'emploi pour les années à venir...</p>
                                <a href="#" class="read-more">Lire la suite <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                        
                        <div class="blog-card" data-category="temoignages">
                            <div class="blog-img">
                                <img src="https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Blog">
                            </div>
                            <div class="blog-content">
                                <span class="blog-category">Témoignages</span>
                                <h3>De l'université à l'entreprise: mon parcours</h3>
                                <div class="blog-meta">
                                    <span class="author">Par Mariama Sow</span>
                                    <span class="date">28 Avril 2025</span>
                                </div>
                                <p>Découvrez le parcours inspirant de Mariama, de ses études à l'UCAD jusqu'à son poste actuel de chef de projet dans une entreprise internationale...</p>
                                <a href="#" class="read-more">Lire la suite <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                        
                        <div class="blog-card" data-category="conseils">
                            <div class="blog-img">
                                <img src="https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Blog">
                            </div>
                            <div class="blog-content">
                                <span class="blog-category">Conseils</span>
                                <h3>Développer son réseau professionnel au Sénégal</h3>
                                <div class="blog-meta">
                                    <span class="author">Par Omar Fall</span>
                                    <span class="date">25 Avril 2025</span>
                                </div>
                                <p>Stratégies et conseils pour construire et entretenir un réseau professionnel solide qui vous ouvrira des portes dans votre carrière...</p>
                                <a href="#" class="read-more">Lire la suite <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                        
                        <div class="blog-card" data-category="cv">
                            <div class="blog-img">
                                <img src="https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Blog">
                            </div>
                            <div class="blog-content">
                                <span class="blog-category">CV</span>
                                <h3>Les erreurs à éviter sur votre CV</h3>
                                <div class="blog-meta">
                                    <span class="author">Par Aminata Diallo</span>
                                    <span class="date">20 Avril 2025</span>
                                </div>
                                <p>Ne laissez pas ces erreurs courantes compromettre vos chances d'être sélectionné pour un entretien. Voici comment les éviter...</p>
                                <a href="#" class="read-more">Lire la suite <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="pagination">
                        <button class="pagination-prev disabled"><i class="fas fa-chevron-left"></i></button>
                        <div class="pagination-numbers">
                            <a href="#" class="active">1</a>
                            <a href="#">2</a>
                            <a href="#">3</a>
                        </div>
                        <button class="pagination-next"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
            </section>
        `;
    }
    
    function createAboutPage() {
        return `
            <section id="about" class="page active">
                <div class="container">
                    <div class="page-header">
                        <h1>À propos de Systemxëy.sn</h1>
                        <p>Découvrez notre mission et notre équipe</p>
                    </div>
                    
                    <div class="about-mission">
                        <div class="mission-content">
                            <h2>Notre mission</h2>
                            <p>Systemxëy.sn est né d'un constat simple : les étudiants sénégalais rencontrent de nombreuses difficultés à trouver des stages et des emplois correspondant à leurs compétences, tandis que les entreprises peinent à identifier les talents dont elles ont besoin.</p>
                            <p>Notre mission est de créer un pont entre le monde académique et le monde professionnel au Sénégal, en offrant une plateforme qui centralise les opportunités et valorise les compétences locales.</p>
                            <p>Nous aspirons à devenir la première communauté digitale de l'emploi au Sénégal, en connectant de manière efficace et transparente les étudiants et les recruteurs.</p>
                        </div>
                        <div class="mission-image">
                            <img src="https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Notre mission">
                        </div>
                    </div>
                    
                    <div class="about-vision">
                        <div class="vision-image">
                            <img src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Notre vision">
                        </div>
                        <div class="vision-content">
                            <h2>Notre vision</h2>
                            <p>Nous voyons un Sénégal où le talent et le mérite sont les seuls critères d'accès à l'emploi, où chaque étudiant peut construire sa carrière en fonction de ses compétences et aspirations.</p>
                            <p>Nous croyons en un marché du travail transparent, dynamique et inclusif, où les opportunités sont accessibles à tous, indépendamment de leur réseau personnel.</p>
                            <p>À travers Systemxëy.sn, nous voulons contribuer activement à la réduction du chômage des jeunes et à l'essor économique du Sénégal, en valorisant le capital humain local.</p>
                        </div>
                    </div>
                    
                    <div class="about-values">
                        <h2>Nos valeurs</h2>
                        <div class="values-grid">
                            <div class="value-card">
                                <div class="value-icon">
                                    <i class="fas fa-handshake"></i>
                                </div>
                                <h3>Confiance</h3>
                                <p>Nous construisons des relations durables basées sur la transparence et l'honnêteté avec tous nos utilisateurs.</p>
                            </div>
                            <div class="value-card">
                                <div class="value-icon">
                                    <i class="fas fa-lightbulb"></i>
                                </div>
                                <h3>Innovation</h3>
                                <p>Nous cherchons constamment à améliorer notre plateforme pour mieux répondre aux besoins du marché de l'emploi.</p>
                            </div>
                            <div class="value-card">
                                <div class="value-icon">
                                    <i class="fas fa-users"></i>
                                </div>
                                <h3>Inclusivité</h3>
                                <p>Nous croyons que chaque talent mérite sa chance, quels que soient son origine ou son parcours.</p>
                            </div>
                            <div class="value-card">
                                <div class="value-icon">
                                    <i class="fas fa-certificate"></i>
                                </div>
                                <h3>Excellence</h3>
                                <p>Nous visons l'excellence dans nos services et encourageons cette même ambition chez nos utilisateurs.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="about-team">
                        <h2>Notre équipe</h2>
                        <p class="team-intro">Systemxëy.sn est le fruit du travail d'une équipe passionnée et diversifiée, dédiée à transformer le marché de l'emploi au Sénégal.</p>
                        
                        <div class="team-grid">
                            <div class="team-member">
                                <div class="member-image">
                                    <img src="https://images.pexels.com/photos/5439153/pexels-photo-5439153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Membre d'équipe">
                                </div>
                                <h3>Amadou Sall</h3>
                                <p class="member-role">Co-fondateur & CEO</p>
                                <p class="member-bio">Diplômé en informatique et passionné d'entrepreneuriat, Amadou a fondé Systemxëy.sn après avoir constaté les difficultés rencontrées par ses camarades pour trouver des stages.</p>
                                <div class="member-social">
                                    <a href="#"><i class="fab fa-linkedin-in"></i></a>
                                    <a href="#"><i class="fab fa-twitter"></i></a>
                                </div>
                            </div>
                            
                            <div class="team-member">
                                <div class="member-image">
                                    <img src="https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Membre d'équipe">
                                </div>
                                <h3>Fatou Diop</h3>
                                <p class="member-role">Co-fondatrice & CMO</p>
                                <p class="member-bio">Avec son master en communication digitale, Fatou apporte son expertise pour développer la communauté Systemxëy et promouvoir la plateforme auprès des étudiants et recruteurs.</p>
                                <div class="member-social">
                                    <a href="#"><i class="fab fa-linkedin-in"></i></a>
                                    <a href="#"><i class="fab fa-twitter"></i></a>
                                </div>
                            </div>
                            
                            <div class="team-member">
                                <div class="member-image">
                                    <img src="https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Membre d'équipe">
                                </div>
                                <h3>Mamadou Ndiaye</h3>
                                <p class="member-role">CTO</p>
                                <p class="member-bio">Expert en développement web et mobile, Mamadou dirige l'équipe technique et s'assure que la plateforme offre la meilleure expérience utilisateur possible.</p>
                                <div class="member-social">
                                    <a href="#"><i class="fab fa-linkedin-in"></i></a>
                                    <a href="#"><i class="fab fa-github"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="about-partners">
                        <h2>Nos partenaires</h2>
                        <p>Systemxëy.sn collabore avec des acteurs clés du secteur éducatif et professionnel pour enrichir son offre et maximiser son impact.</p>
                        
                        <div class="partners-grid">
                            <div class="partner-logo">
                                <img src="https://via.placeholder.com/150x80?text=UCAD" alt="Université Cheikh Anta Diop">
                            </div>
                            <div class="partner-logo">
                                <img src="https://via.placeholder.com/150x80?text=ESP" alt="École Supérieure Polytechnique">
                            </div>
                            <div class="partner-logo">
                                <img src="https://via.placeholder.com/150x80?text=CNPS" alt="CNPS">
                            </div>
                            <div class="partner-logo">
                                <img src="https://via.placeholder.com/150x80?text=APIX" alt="APIX">
                            </div>
                            <div class="partner-logo">
                                <img src="https://via.placeholder.com/150x80?text=SONATEL" alt="Sonatel">
                            </div>
                            <div class="partner-logo">
                                <img src="https://via.placeholder.com/150x80?text=CTIC" alt="CTIC Dakar">
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    
    function createContactPage() {
        return `
            <section id="contact" class="page active">
                <div class="container">
                    <div class="page-header">
                        <h1>Contactez-nous</h1>
                        <p>Nous sommes à votre écoute pour toute question ou suggestion</p>
                    </div>
                    
                    <div class="contact-grid">
                        <div class="contact-info">
                            <div class="info-card">
                                <div class="info-icon">
                                    <i class="fas fa-map-marker-alt"></i>
                                </div>
                                <div class="info-content">
                                    <h3>Adresse</h3>
                                    <p>Dakar, Sénégal</p>
                                </div>
                            </div>
                            
                            <div class="info-card">
                                <div class="info-icon">
                                    <i class="fas fa-phone"></i>
                                </div>
                                <div class="info-content">
                                    <h3>Téléphone</h3>
                                    <p>+221 77 516 19 38</p>
                                    <p>+221 77 323 70 52</p>
                                </div>
                            </div>
                            
                            <div class="info-card">
                                <div class="info-icon">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <div class="info-content">
                                    <h3>Email</h3>
                                    <p>strategcom221@gmail.com</p>
                                </div>
                            </div>
                            
                            <div class="info-card">
                                <div class="info-icon">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="info-content">
                                    <h3>Heures d'ouverture</h3>
                                    <p>Lundi - Vendredi: 9h - 18h</p>
                                    <p>Samedi: 9h - 13h</p>
                                </div>
                            </div>
                            
                            <div class="social-links">
                                <h3>Suivez-nous</h3>
                                <div class="social-icons">
                                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                                    <a href="#"><i class="fab fa-twitter"></i></a>
                                    <a href="#"><i class="fab fa-linkedin-in"></i></a>
                                    <a href="#"><i class="fab fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                        
                        <div class="contact-form-container">
                            <h2>Envoyez-nous un message</h2>
                            <form class="contact-form" id="contact-form">
                                <div class="form-group">
                                    <label for="name">Nom complet</label>
                                    <input type="text" id="name" name="name" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="email" id="email" name="email" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="phone">Téléphone</label>
                                    <input type="tel" id="phone" name="phone">
                                </div>
                                
                                <div class="form-group">
                                    <label for="subject">Sujet</label>
                                    <select id="subject" name="subject" required>
                                        <option value="">Sélectionnez un sujet</option>
                                        <option value="info">Demande d'information</option>
                                        <option value="support">Support technique</option>
                                        <option value="partnership">Proposition de partenariat</option>
                                        <option value="suggestion">Suggestion</option>
                                        <option value="other">Autre</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="message">Message</label>
                                    <textarea id="message" name="message" rows="5" required></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <button type="submit" class="btn-primary">Envoyer le message</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <div class="faq-section">
                        <h2>Questions fréquentes</h2>
                        
                        <div class="faq-container">
                            <div class="faq-item">
                                <div class="faq-question">
                                    <h3>Comment créer un compte sur Systemxëy.sn ?</h3>
                                    <span class="faq-toggle"><i class="fas fa-plus"></i></span>
                                </div>
                                <div class="faq-answer">
                                    <p>Pour créer un compte, cliquez sur le bouton "Inscription" en haut de la page. Vous pourrez alors choisir entre un compte étudiant ou recruteur, et remplir le formulaire avec vos informations.</p>
                                </div>
                            </div>
                            
                            <div class="faq-item">
                                <div class="faq-question">
                                    <h3>L'inscription est-elle gratuite ?</h3>
                                    <span class="faq-toggle"><i class="fas fa-plus"></i></span>
                                </div>
                                <div class="faq-answer">
                                    <p>Oui, l'inscription est totalement gratuite pour les étudiants. Pour les recruteurs, l'accès de base est gratuit, mais des formules premium sont disponibles pour des fonctionnalités avancées.</p>
                                </div>
                            </div>
                            
                            <div class="faq-item">
                                <div class="faq-question">
                                    <h3>Comment téléverser mon CV sur la plateforme ?</h3>
                                    <span class="faq-toggle"><i class="fas fa-plus"></i></span>
                                </div>
                                <div class="faq-answer">
                                    <p>Une fois connecté à votre compte étudiant, accédez à votre profil et cliquez sur la section "CV et documents". Vous pourrez alors téléverser votre CV au format PDF ou Word.</p>
                                </div>
                            </div>
                            
                            <div class="faq-item">
                                <div class="faq-question">
                                    <h3>Comment contacter un candidat qui m'intéresse ?</h3>
                                    <span class="faq-toggle"><i class="fas fa-plus"></i></span>
                                </div>
                                <div class="faq-answer">
                                    <p>En tant que recruteur, vous pouvez contacter directement les candidats via notre système de messagerie intégré. Il vous suffit de vous rendre sur le profil du candidat et de cliquer sur "Contacter".</p>
                                </div>
                            </div>
                            
                            <div class="faq-item">
                                <div class="faq-question">
                                    <h3>Mes informations personnelles sont-elles sécurisées ?</h3>
                                    <span class="faq-toggle"><i class="fas fa-plus"></i></span>
                                </div>
                                <div class="faq-answer">
                                    <p>Absolument. Chez Systemxëy.sn, nous prenons très au sérieux la sécurité de vos données. Toutes les informations sont cryptées et nous ne les partageons jamais avec des tiers sans votre consentement explicite.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    
    function createMessagesPage() {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        
        if (!user) {
            return '<section id="messages" class="page active"><div class="container"><h1>Non autorisé</h1><p>Veuillez vous connecter pour accéder à cette page.</p></div></section>';
        }
        
        return `
            <section id="messages" class="page active">
                <div class="container">
                    <div class="page-header">
                        <h1>Messagerie</h1>
                        <p>Communiquez avec les ${user.userType === 'student' ? 'recruteurs' : 'candidats'}</p>
                    </div>
                    
                    <div class="messages-container">
                        <div class="conversations-list">
                            <div class="conversations-header">
                                <h3>Conversations</h3>
                                <div class="search-conversations">
                                    <input type="text" placeholder="Rechercher...">
                                    <i class="fas fa-search"></i>
                                </div>
                            </div>
                            
                            <div class="conversation-item active">
                                <div class="conversation-avatar">
                                    <img src="${user.userType === 'student' ? 'https://images.pexels.com/photos/5439153/pexels-photo-5439153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' : 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}" alt="Avatar">
                                    <span class="status-indicator online"></span>
                                </div>
                                <div class="conversation-info">
                                    <h4>${user.userType === 'student' ? 'Amadou Sall' : 'Fatou Diop'}</h4>
                                    <p>${user.userType === 'student' ? 'TechSenegal' : 'Étudiante en Master'}</p>
                                    <span class="last-message">Bonjour, je suis intéressé(e) par...</span>
                                </div>
                                <div class="conversation-meta">
                                    <span class="time">10:30</span>
                                    <span class="unread-count">2</span>
                                </div>
                            </div>
                            
                            <div class="conversation-item">
                                <div class="conversation-avatar">
                                    <img src="${user.userType === 'student' ? 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' : 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}" alt="Avatar">
                                    <span class="status-indicator offline"></span>
                                </div>
                                <div class="conversation-info">
                                    <h4>${user.userType === 'student' ? 'Marie Diallo' : 'Mamadou Ndiaye'}</h4>
                                    <p>${user.userType === 'student' ? 'SenData' : 'Étudiant en Informatique'}</p>
                                    <span class="last-message">Merci pour votre candidature...</span>
                                </div>
                                <div class="conversation-meta">
                                    <span class="time">Hier</span>
                                </div>
                            </div>
                            
                            <div class="conversation-item">
                                <div class="conversation-avatar">
                                    <img src="${user.userType === 'student' ? 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' : 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}" alt="Avatar">
                                    <span class="status-indicator away"></span>
                                </div>
                                <div class="conversation-info">
                                    <h4>${user.userType === 'student' ? 'Omar Seck' : 'Aïda Sow'}</h4>
                                    <p>${user.userType === 'student' ? 'AgenceSen' : 'Étudiante en Design'}</p>
                                    <span class="last-message">Quand seriez-vous disponible pour...</span>
                                </div>
                                <div class="conversation-meta">
                                    <span class="time">20 Mai</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="chat-container">
                            <div class="chat-header">
                                <div class="chat-contact">
                                    <div class="contact-avatar">
                                        <img src="${user.userType === 'student' ? 'https://images.pexels.com/photos/5439153/pexels-photo-5439153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' : 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}" alt="Avatar">
                                        <span class="status-indicator online"></span>
                                    </div>
                                    <div class="contact-info">
                                        <h3>${user.userType === 'student' ? 'Amadou Sall' : 'Fatou Diop'}</h3>
                                        <p>${user.userType === 'student' ? 'TechSenegal • En ligne' : 'Étudiante en Master • En ligne'}</p>
                                    </div>
                                </div>
                                <div class="chat-actions">
                                    <button class="action-btn"><i class="fas fa-phone"></i></button>
                                    <button class="action-btn"><i class="fas fa-video"></i></button>
                                    <button class="action-btn"><i class="fas fa-info-circle"></i></button>
                                </div>
                            </div>
                            
                            <div class="chat-messages">
                                <div class="message-date">
                                    <span>Aujourd'hui</span>
                                </div>
                                
                                <div class="message received">
                                    <div class="message-avatar">
                                        <img src="${user.userType === 'student' ? 'https://images.pexels.com/photos/5439153/pexels-photo-5439153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' : 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}" alt="Avatar">
                                    </div>
                                    <div class="message-content">
                                        <div class="message-bubble">
                                            <p>Bonjour ${user.name}, je suis intéressé(e) par votre profil suite à votre candidature pour le poste de ${user.userType === 'student' ? 'Développeur Full Stack' : ''}.</p>
                                        </div>
                                        <span class="message-time">10:30</span>
                                    </div>
                                </div>
                                
                                <div class="message received">
                                    <div class="message-avatar">
                                        <img src="${user.userType === 'student' ? 'https://images.pexels.com/photos/5439153/pexels-photo-5439153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' : 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}" alt="Avatar">
                                    </div>
                                    <div class="message-content">
                                        <div class="message-bubble">
                                            <p>Seriez-vous disponible pour un entretien la semaine prochaine?</p>
                                        </div>
                                        <span class="message-time">10:31</span>
                                    </div>
                                </div>
                                
                                <div class="message sent">
                                    <div class="message-content">
                                        <div class="message-bubble">
                                            <p>Bonjour, merci pour votre message! Je suis très intéressé(e) par cette opportunité.</p>
                                        </div>
                                        <span class="message-time">10:40</span>
                                    </div>
                                </div>
                                
                                <div class="message sent">
                                    <div class="message-content">
                                        <div class="message-bubble">
                                            <p>Je suis disponible la semaine prochaine, notamment mardi et jeudi dans l'après-midi si cela vous convient.</p>
                                        </div>
                                        <span class="message-time">10:41</span>
                                    </div>
                                </div>
                                
                                <div class="message received">
                                    <div class="message-avatar">
                                        <img src="${user.userType === 'student' ? 'https://images.pexels.com/photos/5439153/pexels-photo-5439153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' : 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}" alt="Avatar">
                                    </div>
                                    <div class="message-content">
                                        <div class="message-bubble">
                                            <p>Parfait! Que diriez-vous de mardi à 14h30 dans nos bureaux à Dakar?</p>
                                        </div>
                                        <span class="message-time">10:45</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="chat-input">
                                <button class="attachment-btn"><i class="fas fa-paperclip"></i></button>
                                <input type="text" placeholder="Écrivez votre message...">
                                <button class="emoji-btn"><i class="fas fa-smile"></i></button>
                                <button class="send-btn"><i class="fas fa-paper-plane"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    
    // Initialize page-specific elements
    function initProfilePage() {
        const profileMenu = document.querySelectorAll('.profile-menu a');
        const profileSections = document.querySelectorAll('.profile-section');
        
        profileMenu.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all menu items and sections
                profileMenu.forEach(i => i.classList.remove('active'));
                profileSections.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Show corresponding section
                const targetSection = document.getElementById(`${this.dataset.section}-section`);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
        
        // Edit buttons functionality
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // In a real app, this would show edit forms
                alert('Fonctionnalité d\'édition en cours de développement');
            });
        });
    }
    
    function initDashboardPage() {
        // For a real app, we would initialize dashboard-specific functionality here
    }
    
    function initJobsPage() {
        // Toggle between grid and list view
        const viewButtons = document.querySelectorAll('.view-btn');
        const jobsGrid = document.querySelector('.jobs-grid');
        const jobsList = document.querySelector('.jobs-list');
        
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                viewButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const view = this.getAttribute('data-view');
                if (view === 'grid') {
                    jobsGrid.classList.add('view-active');
                    jobsList.classList.remove('view-active');
                } else {
                    jobsGrid.classList.remove('view-active');
                    jobsList.classList.add('view-active');
                }
            });
        });
        
        // Save job functionality
        const saveButtons = document.querySelectorAll('.save-job');
        saveButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('saved');
                if (this.classList.contains('saved')) {
                    this.innerHTML = '<i class="fas fa-heart"></i>';
                } else {
                    this.innerHTML = '<i class="far fa-heart"></i>';
                }
            });
        });
    }
    
    function initMessagesPage() {
        // For a real app, we would initialize messaging-specific functionality here
    }
    
    // Show notification function for this module
    function showNotification(message, type) {
        // Check if notification container exists, if not create it
        let notifContainer = document.querySelector('.notification-container');
        
        if (!notifContainer) {
            notifContainer = document.createElement('div');
            notifContainer.className = 'notification-container';
            document.body.appendChild(notifContainer);
            
            // Add styles to the container
            notifContainer.style.position = 'fixed';
            notifContainer.style.top = '20px';
            notifContainer.style.right = '20px';
            notifContainer.style.zIndex = '9999';
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Style the notification
        notification.style.backgroundColor = type === 'success' ? '#27ae60' : '#e74c3c';
        notification.style.color = 'white';
        notification.style.padding = '12px 16px';
        notification.style.borderRadius = '4px';
        notification.style.marginBottom = '10px';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        notification.style.display = 'flex';
        notification.style.justifyContent = 'space-between';
        notification.style.alignItems = 'center';
        notification.style.minWidth = '300px';
        notification.style.animation = 'slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards';
        
        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Add to container
        notifContainer.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
});