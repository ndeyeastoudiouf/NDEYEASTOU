// Auth and Login/Register functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const authContainer = document.getElementById('auth-container');
    const mainContainer = document.getElementById('main-container');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    // Check if user is logged in
    function checkUserLogin() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            // User is logged in
            authContainer.classList.remove('active');
            mainContainer.classList.add('active');
            
            // Update user avatar and name if available
            const userData = JSON.parse(user);
            updateUserMenu(userData);
        } else {
            // User is not logged in
            authContainer.classList.add('active');
            mainContainer.classList.remove('active');
        }
    }
    
    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and forms
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding form
            const targetForm = document.getElementById(`${tab.dataset.target}-form`);
            targetForm.classList.add('active');
        });
    });
    
    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const inputField = button.previousElementSibling;
            if (inputField.type === 'password') {
                inputField.type = 'text';
                button.classList.remove('fa-eye-slash');
                button.classList.add('fa-eye');
            } else {
                inputField.type = 'password';
                button.classList.remove('fa-eye');
                button.classList.add('fa-eye-slash');
            }
        });
    });
    
    // Login functionality
    loginBtn.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const userType = document.querySelector('input[name="user-type-login"]:checked').value;
        
        if (!email || !password) {
            showNotification('Veuillez remplir tous les champs', 'error');
            return;
        }
        
        // In a real app, this would validate against a backend
        // For demo purposes, we'll use localStorage
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password && u.userType === userType);
        
        if (user) {
            // Successfully logged in
            const loggedInUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                userType: user.userType
            };
            
            localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
            showNotification('Connexion réussie', 'success');
            
            // Redirect to main content
            authContainer.classList.remove('active');
            mainContainer.classList.add('active');
            
            // Update user menu
            updateUserMenu(loggedInUser);
        } else {
            showNotification('Email ou mot de passe incorrect', 'error');
        }
    });
    
    // Register functionality
    registerBtn.addEventListener('click', () => {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const userType = document.querySelector('input[name="user-type-register"]:checked').value;
        const termsAccepted = document.getElementById('terms-checkbox').checked;
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showNotification('Veuillez remplir tous les champs', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Les mots de passe ne correspondent pas', 'error');
            return;
        }
        
        if (!termsAccepted) {
            showNotification('Veuillez accepter les termes et conditions', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Veuillez entrer une adresse email valide', 'error');
            return;
        }
        
        // Password strength (at least 8 characters, with number and special char)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            showNotification('Le mot de passe doit contenir au moins 8 caractères, incluant un chiffre et un caractère spécial', 'error');
            return;
        }
        
        // In a real app, this would send data to a backend
        // For demo purposes, we'll use localStorage
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email is already registered
        if (users.some(user => user.email === email)) {
            showNotification('Cette adresse email est déjà utilisée', 'error');
            return;
        }
        
        // Add new user
        const newUser = {
            id: generateUserId(),
            name,
            email,
            password, // In real app, NEVER store plain passwords
            userType,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto login after registration
        const loggedInUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            userType: newUser.userType
        };
        
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        
        showNotification('Inscription réussie', 'success');
        
        // Redirect to main content
        authContainer.classList.remove('active');
        mainContainer.classList.add('active');
        
        // Update user menu
        updateUserMenu(loggedInUser);
        
        // Clear form
        document.getElementById('register-name').value = '';
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
        document.getElementById('register-confirm-password').value = '';
        document.getElementById('terms-checkbox').checked = false;
    });
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    function logout() {
        localStorage.removeItem('currentUser');
        showNotification('Déconnexion réussie', 'success');
        
        // Redirect to login
        authContainer.classList.add('active');
        mainContainer.classList.remove('active');
        
        // Reset forms
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
    }
    
    // Forgot password functionality
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            
            if (!email) {
                showNotification('Veuillez entrer votre adresse email', 'error');
                return;
            }
            
            // In a real app, this would trigger a password reset email
            showNotification('Un email de réinitialisation a été envoyé à ' + email, 'success');
        });
    }
    
    // Helper functions
    function generateUserId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    function updateUserMenu(user) {
        // Update user avatar or display initial letter
        // In a real app, this would use the user's profile picture
        
        // For student and recruiter-specific UI adjustments
        if (user.userType === 'student') {
            // Student-specific UI adjustments could go here
        } else if (user.userType === 'recruiter') {
            // Recruiter-specific UI adjustments could go here
        }
    }
    
    // Notification system
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
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize - check if user is logged in
    checkUserLogin();
    
    // For demo purposes - create some sample users if none exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
        const sampleUsers = [
            {
                id: 'student1',
                name: 'Fatou Diop',
                email: 'etudiantuvs@gmail.com',
                password: 'Student@123',
                userType: 'student',
                createdAt: new Date().toISOString()
            },
            {
                id: 'recruiter1',
                name: 'Amadou Sall',
                email: 'recruteur@gmail.com',
                password: 'Recruiter@123',
                userType: 'recruiter',
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('users', JSON.stringify(sampleUsers));
    }
});