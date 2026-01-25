
// User Authentication System
class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = null;
    }
    
    loadUsers() {
        // Load from localStorage or initialize with default users
        const storedUsers = localStorage.getItem('scholarship_users');
        if (storedUsers) {
            return JSON.parse(storedUsers);
        }
        
        // Default users for demo
        const defaultUsers = [
            { 
                id: 1, 
                username: "admin1", 
                email: "admin1@scholarship.com", 
                password: "admin123", 
                role: "admin", 
                organization: "University Excellence Fund",
                name: "John Smith",
                createdAt: "2023-01-01"
            },
            { 
                id: 2, 
                username: "admin2", 
                email: "admin2@scholarship.com", 
                password: "admin123", 
                role: "admin", 
                organization: "Tech Innovators Scholarship",
                name: "Sarah Johnson",
                createdAt: "2023-01-01"
            },
            { 
                id: 3, 
                username: "student1", 
                email: "student1@university.edu", 
                password: "student123", 
                role: "student", 
                name: "Alex Johnson",
                gpa: 3.8,
                major: "Computer Science",
                category: "stem",
                incomeLevel: "middle",
                interests: ["Technology", "Programming", "AI"],
                createdAt: "2023-01-01"
            },
            { 
                id: 4, 
                username: "student2", 
                email: "student2@university.edu", 
                password: "student123", 
                role: "student", 
                name: "Maria Garcia",
                gpa: 3.9,
                major: "Biomedical Engineering",
                category: "stem",
                incomeLevel: "low",
                interests: ["Medicine", "Research", "Biology"],
                createdAt: "2023-01-01"
            }
        ];
        
        this.saveUsers(defaultUsers);
        return defaultUsers;
    }
    
    saveUsers(users) {
        localStorage.setItem('scholarship_users', JSON.stringify(users));
    }
    
    register(userData) {
        // Check if user already exists
        if (this.users.find(u => u.email === userData.email)) {
            return { success: false, message: "Email already registered" };
        }
        
        if (this.users.find(u => u.username === userData.username)) {
            return { success: false, message: "Username already taken" };
        }
        
        // Create new user
        const newUser = {
            id: this.generateUserId(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        
        this.users.push(newUser);
        this.saveUsers(this.users);
        
        return { success: true, user: newUser };
    }
    
    login(emailOrUsername, password) {
        const user = this.users.find(u => 
            (u.email === emailOrUsername || u.username === emailOrUsername) && 
            u.password === password
        );
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('current_user', JSON.stringify(user));
            return { success: true, user };
        }
        
        return { success: false, message: "Invalid email/username or password" };
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('current_user');
    }
    
    getCurrentUser() {
        if (!this.currentUser) {
            const storedUser = localStorage.getItem('current_user');
            if (storedUser) {
                this.currentUser = JSON.parse(storedUser);
            }
        }
        return this.currentUser;
    }
    
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }
    
    generateUserId() {
        return this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    }
    
    updateUser(userId, updates) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) return false;
        
        this.users[userIndex] = { ...this.users[userIndex], ...updates };
        this.saveUsers(this.users);
        
        // Update current user if it's the same user
        if (this.currentUser && this.currentUser.id === userId) {
            this.currentUser = this.users[userIndex];
            localStorage.setItem('current_user', JSON.stringify(this.currentUser));
        }
        
        return true;
    }
}

// Scholarship Database System
class ScholarshipDatabase {
    constructor() {
        this.loadData();
    }
    
    loadData() {
        // Load all data from localStorage
        this.scholarships = JSON.parse(localStorage.getItem('scholarships_db')) || [];
        this.applications = JSON.parse(localStorage.getItem('applications_db')) || [];
        
        // Initialize with sample data if empty
        if (this.scholarships.length === 0) {
            this.initializeSampleData();
        }
    }
    
    initializeSampleData() {
        // Sample scholarships
        this.scholarships = [
            {
                id: 1,
                name: "Excellence in Computer Science",
                provider: "University Excellence Fund",
                amount: "$5,000",
                deadline: "2024-12-15",
                description: "Awarded to outstanding Computer Science students demonstrating academic excellence and innovation.",
                eligibility: "Minimum GPA 3.5, Major in Computer Science, Demonstrated project work",
                category: "stem",
                maxApplicants: 10,
                status: "active",
                applications: 2,
                adminId: 1,
                createdAt: "2023-10-01"
            },
            {
                id: 2,
                name: "Women in STEM Scholarship",
                provider: "University Excellence Fund",
                amount: "$3,000",
                deadline: "2024-11-30",
                description: "Supporting female students pursuing degrees in Science, Technology, Engineering, and Mathematics.",
                eligibility: "Female students, STEM major, Minimum GPA 3.0",
                category: "stem",
                maxApplicants: 5,
                status: "active",
                applications: 1,
                adminId: 1,
                createdAt: "2023-10-01"
            },
            {
                id: 3,
                name: "Tech Innovators Grant",
                provider: "Tech Innovators Scholarship",
                amount: "$4,500",
                deadline: "2024-10-31",
                description: "For students developing innovative technology solutions.",
                eligibility: "Technology-related major, Working prototype, Minimum GPA 3.2",
                category: "stem",
                status: "active",
                applications: 1,
                adminId: 2,
                createdAt: "2023-10-01"
            },
            {
                id: 4,
                name: "Arts & Creativity Award",
                provider: "University Excellence Fund",
                amount: "$2,000",
                deadline: "2024-09-30",
                description: "Supporting students in visual and performing arts programs.",
                eligibility: "Arts major, Portfolio review, Minimum GPA 3.0",
                category: "arts",
                status: "active",
                applications: 0,
                adminId: 1,
                createdAt: "2023-10-01"
            }
        ];
        
        // Sample applications
        this.applications = [
            {
                id: 1,
                studentId: 3,
                applicantName: "Alex Johnson",
                email: "student1@university.edu",
                scholarshipId: 1,
                scholarshipName: "Excellence in Computer Science",
                status: "pending",
                appliedDate: "2023-10-15",
                gpa: 3.8,
                major: "Computer Science",
                essay: "I have always been passionate about technology and its potential to solve real-world problems. During my studies, I developed several applications that help local businesses streamline their operations. This scholarship would allow me to focus on my research in artificial intelligence without financial constraints."
            },
            {
                id: 2,
                studentId: 3,
                applicantName: "Alex Johnson",
                email: "student1@university.edu",
                scholarshipId: 2,
                scholarshipName: "Women in STEM Scholarship",
                status: "approved",
                appliedDate: "2023-10-10",
                reviewedDate: "2023-10-20",
                reviewedBy: 1,
                gpa: 3.8,
                major: "Computer Science",
                essay: "As a woman in STEM, I aim to contribute to medical technology innovations. I've participated in several hackathons focused on healthcare solutions and plan to develop assistive technologies for people with disabilities. This scholarship would support my goal of making technology more accessible."
            },
            {
                id: 3,
                studentId: 4,
                applicantName: "Maria Garcia",
                email: "student2@university.edu",
                scholarshipId: 3,
                scholarshipName: "Tech Innovators Grant",
                status: "pending",
                appliedDate: "2023-10-18",
                gpa: 3.9,
                major: "Biomedical Engineering",
                essay: "My experience in developing medical devices has prepared me for advanced studies. I've created a prototype for a low-cost diagnostic tool that could revolutionize healthcare in developing countries. This grant would help me refine my invention and bring it to market."
            }
        ];
        
        this.saveData();
    }
    
    saveData() {
        localStorage.setItem('scholarships_db', JSON.stringify(this.scholarships));
        localStorage.setItem('applications_db', JSON.stringify(this.applications));
    }
    
    // Scholarship Methods
    getScholarships(adminId = null) {
        if (adminId) {
            return this.scholarships.filter(s => s.adminId === adminId);
        }
        return this.scholarships.filter(s => s.status === 'active');
    }
    
    getScholarshipById(id) {
        return this.scholarships.find(s => s.id === id);
    }
    
    createScholarship(scholarshipData) {
        const newScholarship = {
            id: this.generateId('scholarships'),
            ...scholarshipData,
            applications: 0,
            createdAt: new Date().toISOString()
        };
        
        this.scholarships.push(newScholarship);
        this.saveData();
        return newScholarship;
    }
    
    updateScholarship(id, updates) {
        const index = this.scholarships.findIndex(s => s.id === id);
        if (index !== -1) {
            this.scholarships[index] = { ...this.scholarships[index], ...updates };
            this.saveData();
            return this.scholarships[index];
        }
        return null;
    }
    
    deleteScholarship(id, adminId) {
        const index = this.scholarships.findIndex(s => s.id === id && s.adminId === adminId);
        if (index === -1) return false;
        
        // Remove scholarship
        this.scholarships.splice(index, 1);
        
        // Also remove related applications
        this.applications = this.applications.filter(app => app.scholarshipId !== id);
        
        this.saveData();
        return true;
    }
    
    // Application Methods
    getApplications(adminId = null, studentId = null) {
        let filtered = this.applications;
        
        if (adminId) {
            // Get scholarships created by this admin
            const adminScholarships = this.scholarships.filter(s => s.adminId === adminId);
            const scholarshipIds = adminScholarships.map(s => s.id);
            filtered = filtered.filter(app => scholarshipIds.includes(app.scholarshipId));
        }
        
        if (studentId) {
            filtered = filtered.filter(app => app.studentId === studentId);
        }
        
        return filtered;
    }
    
    createApplication(applicationData) {
        const newApplication = {
            id: this.generateId('applications'),
            ...applicationData,
            appliedDate: new Date().toISOString(),
            status: 'pending'
        };
        
        this.applications.push(newApplication);
        
        // Update scholarship application count
        const scholarship = this.getScholarshipById(applicationData.scholarshipId);
        if (scholarship) {
            scholarship.applications = (scholarship.applications || 0) + 1;
            this.saveData();
        }
        
        return newApplication;
    }
    
// In the ScholarshipDatabase class in script.js, update this method:

updateApplicationStatus(id, status, adminId) {
    console.log('DB: Updating application', id, 'to', status, 'by admin', adminId);
    
    const application = this.applications.find(app => app.id === id);
    if (!application) {
        console.log('DB: Application not found');
        return null;
    }
    
    // Verify admin owns the scholarship
    const scholarship = this.getScholarshipById(application.scholarshipId);
    if (!scholarship) {
        console.log('DB: Scholarship not found');
        return null;
    }
    
    console.log('DB: Scholarship adminId:', scholarship.adminId, 'Requesting adminId:', adminId);
    
    if (scholarship.adminId !== adminId) {
        console.log('DB: Admin does not own this scholarship');
        return null;
    }
    
    application.status = status;
    application.reviewedDate = new Date().toISOString();
    application.reviewedBy = adminId;
    
    this.saveData();
    console.log('DB: Application updated successfully');
    return application;
}
    
    // Helper Methods
    generateId(type) {
        const items = type === 'scholarships' ? this.scholarships : this.applications;
        return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    }
    
    // Statistics
    getStatistics(adminId = null) {
        const adminScholarships = adminId ? 
            this.scholarships.filter(s => s.adminId === adminId) : 
            this.scholarships;
        
        const adminApplications = adminId ? 
            this.getApplications(adminId) : 
            this.applications;
        
        return {
            totalScholarships: adminScholarships.length,
            activeScholarships: adminScholarships.filter(s => s.status === 'active').length,
            totalApplications: adminApplications.length,
            pendingApplications: adminApplications.filter(a => a.status === 'pending').length,
            approvedApplications: adminApplications.filter(a => a.status === 'approved').length,
            rejectedApplications: adminApplications.filter(a => a.status === 'rejected').length
        };
    }
}

// Create global instances
const auth = new AuthSystem();
const db = new ScholarshipDatabase();

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeBtn = document.querySelector('.close');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');
const registerType = document.getElementById('registerType');
const loginAsStudentBtn = document.getElementById('loginAsStudentBtn');
const loginAsAdminBtn = document.getElementById('loginAsAdminBtn');

// Portal Access Control Functions
function redirectBasedOnRole(user) {
    if (!user) return false;
    
    if (user.role === 'student') {
        window.location.href = 'student/student.html';
        return true;
    } else if (user.role === 'admin') {
        window.location.href = 'admin/admin.html';
        return true;
    }
    
    return false;
}

function checkExistingSession() {
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
        // User is already logged in, redirect to their portal
        return redirectBasedOnRole(currentUser);
    }
    return false;
}

// Tab Switching
if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => form.classList.remove('active'));
            document.getElementById(`${tab}Tab`).classList.add('active');
        });
    });
}

// Show admin/student fields based on selection
if (registerType) {
    registerType.addEventListener('change', (e) => {
        const type = e.target.value;
        const studentFields = document.getElementById('studentFields');
        const adminFields = document.getElementById('adminFields');
        
        if (studentFields) {
            studentFields.style.display = type === 'student' ? 'block' : 'none';
        }
        
        if (adminFields) {
            adminFields.style.display = type === 'admin' ? 'block' : 'none';
        }
        
        // Mark required fields
        const orgField = document.getElementById('adminOrganization');
        if (orgField) {
            orgField.required = type === 'admin';
        }
    });
}

// Open Login Modal
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        // Check if user is already logged in (from portal guard redirection)
        const currentUser = auth.getCurrentUser();
        if (currentUser) {
            redirectBasedOnRole(currentUser);
            return;
        }
        
        e.preventDefault();
        
        if (loginModal) {
            loginModal.style.display = 'block';
            
            // Reset forms
            if (loginForm) loginForm.reset();
            if (registerForm) registerForm.reset();
            
            // Set focus to first input
            setTimeout(() => {
                const loginEmail = document.getElementById('loginEmail');
                if (loginEmail) loginEmail.focus();
            }, 100);
        }
    });
}

// Close Login Modal
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        if (loginModal) {
            loginModal.style.display = 'none';
        }
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (loginModal && e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Quick login buttons
if (loginAsStudentBtn) {
    loginAsStudentBtn.addEventListener('click', () => {
        // Set student as default in login form
        const loginTab = document.querySelector('[data-tab="login"]');
        const loginType = document.getElementById('loginType');
        
        if (loginTab && loginType) {
            loginTab.click();
            loginType.value = 'student';
        }
        
        if (loginModal) {
            loginModal.style.display = 'block';
            const loginEmail = document.getElementById('loginEmail');
            if (loginEmail) loginEmail.focus();
        }
    });
}

if (loginAsAdminBtn) {
    loginAsAdminBtn.addEventListener('click', () => {
        // Set admin as default in login form
        const loginTab = document.querySelector('[data-tab="login"]');
        const loginType = document.getElementById('loginType');
        
        if (loginTab && loginType) {
            loginTab.click();
            loginType.value = 'admin';
        }
        
        if (loginModal) {
            loginModal.style.display = 'block';
            const loginEmail = document.getElementById('loginEmail');
            if (loginEmail) loginEmail.focus();
        }
    });
}

// Handle Login Form Submission
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userType = document.getElementById('loginType').value;
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Validate inputs
        if (!userType || !email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        const result = auth.login(email, password);
        
        if (result.success) {
            // STRICT ROLE CHECKING - User can only access their own portal type
            if (result.user.role !== userType) {
                alert(`Access Denied: You are registered as a ${result.user.role}. Please login through the correct portal.`);
                auth.logout(); // Clear invalid session
                return;
            }
            
            if (loginModal) {
                loginModal.style.display = 'none';
            }
            
            loginForm.reset();
            
            // Redirect to appropriate portal
            redirectBasedOnRole(result.user);
        } else {
            alert('Login failed: ' + result.message);
        }
    });
}

// Handle Registration Form Submission
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userType = document.getElementById('registerType').value;
        const name = document.getElementById('registerName').value;
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        // Validate inputs
        if (!userType || !name || !username || !email || !password || !confirmPassword) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (userType === 'admin') {
            const orgField = document.getElementById('adminOrganization');
            if (orgField && !orgField.value) {
                alert('Please enter your organization name');
                return;
            }
        }
        
        // Validate passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Validate password strength
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        // Prepare user data
        const userData = {
            username,
            email,
            password,
            role: userType,
            name
        };
        
        // Add role-specific fields
        if (userType === 'student') {
            userData.gpa = parseFloat(document.getElementById('studentGPA').value) || 0;
            userData.major = document.getElementById('studentMajor').value || 'Undeclared';
            userData.category = 'general';
            userData.incomeLevel = 'middle';
            userData.interests = ['General'];
        } else if (userType === 'admin') {
            userData.organization = document.getElementById('adminOrganization').value;
        }
        
        // Register user
        const result = auth.register(userData);
        
        if (result.success) {
            alert('Registration successful! You can now login with your credentials.');
            registerForm.reset();
            
            // Switch to login tab and pre-fill email
            const loginTab = document.querySelector('[data-tab="login"]');
            if (loginTab) loginTab.click();
            
            const loginEmail = document.getElementById('loginEmail');
            const loginType = document.getElementById('loginType');
            
            if (loginEmail) loginEmail.value = email;
            if (loginType) loginType.value = userType;
            
            // Focus on password field
            setTimeout(() => {
                const loginPassword = document.getElementById('loginPassword');
                if (loginPassword) loginPassword.focus();
            }, 100);
        } else {
            alert('Registration failed: ' + result.message);
        }
    });
}

// Update UI for logged-in user
function updateUIForLoggedInUser(user) {
    if (user && loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${user.name}`;
        loginBtn.href = user.role === 'student' ? 'student/student.html' : 'admin/admin.html';
        loginBtn.onclick = null; // Remove modal opening for logged-in users
        
        // Add logout option
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                auth.logout();
                window.location.href = 'index.html';
            }
        });
    }
}

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    // Don't auto-redirect on main page, let user choose
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
        updateUIForLoggedInUser(currentUser);
    }
    
    // Update demo credentials note
    updateDemoCredentials();
    
    // Set up smooth scrolling for navigation links
    setupSmoothScrolling();
    
    // Add current year to footer
    updateFooterYear();
    
    // Add feature animations
    addFeatureAnimations();
    
    // Set up inactivity timer (only for main page)
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        setupInactivityTimer();
    }
});

// Update demo credentials display
function updateDemoCredentials() {
    const demoNote = document.querySelector('.demo-credentials');
    if (demoNote) {
        demoNote.innerHTML = `
            <strong>Demo Accounts:</strong><br>
            Students: student1@university.edu / student123<br>
            Admins: admin1@scholarship.com / admin123
        `;
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal page links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page reload
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

// Update footer with current year
function updateFooterYear() {
    const footer = document.querySelector('footer p');
    if (footer) {
        const currentYear = new Date().getFullYear();
        footer.innerHTML = footer.innerHTML.replace('2023', currentYear);
    }
}

// Feature cards animation
function addFeatureAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    if (featureCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });
        
        featureCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
    }
    
    // Step animation
    const steps = document.querySelectorAll('.step');
    if (steps.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1)';
                    }, index * 150);
                }
            });
        }, { threshold: 0.1 });
        
        steps.forEach(step => {
            step.style.opacity = '0';
            step.style.transform = 'scale(0.8)';
            step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(step);
        });
    }
}

// Handle browser back/forward navigation for smooth scrolling
window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }
});

// Add keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    if (loginModal && loginModal.style.display === 'block') {
        // Close modal on Escape key
        if (e.key === 'Escape') {
            loginModal.style.display = 'none';
        }
        
        // Navigate between tabs with arrow keys
        if (tabBtns.length > 0 && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
            const activeTab = document.querySelector('.tab-btn.active');
            const tabs = Array.from(tabBtns);
            const currentIndex = tabs.indexOf(activeTab);
            let nextIndex;
            
            if (e.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % tabs.length;
            } else {
                nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            }
            
            tabs[nextIndex].click();
        }
    }
});

// Form validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add input validation for forms
document.addEventListener('DOMContentLoaded', () => {
    // Email validation for login
    const loginEmail = document.getElementById('loginEmail');
    if (loginEmail) {
        loginEmail.addEventListener('blur', () => {
            const email = loginEmail.value;
            if (email && !validateEmail(email) && email.includes('@')) {
                loginEmail.style.borderColor = '#e74c3c';
            } else {
                loginEmail.style.borderColor = '#ddd';
            }
        });
    }
    
    // Email validation for registration
    const registerEmail = document.getElementById('registerEmail');
    if (registerEmail) {
        registerEmail.addEventListener('blur', () => {
            const email = registerEmail.value;
            if (email && !validateEmail(email)) {
                registerEmail.style.borderColor = '#e74c3c';
                showValidationMessage(registerEmail, 'Please enter a valid email address');
            } else {
                registerEmail.style.borderColor = '#ddd';
                removeValidationMessage(registerEmail);
            }
        });
    }
    
    // Password confirmation validation
    const registerPassword = document.getElementById('registerPassword');
    const registerConfirmPassword = document.getElementById('registerConfirmPassword');
    
    if (registerPassword && registerConfirmPassword) {
        const validatePasswords = () => {
            if (registerPassword.value && registerConfirmPassword.value && 
                registerPassword.value !== registerConfirmPassword.value) {
                registerConfirmPassword.style.borderColor = '#e74c3c';
                showValidationMessage(registerConfirmPassword, 'Passwords do not match');
            } else {
                registerConfirmPassword.style.borderColor = '#ddd';
                removeValidationMessage(registerConfirmPassword);
            }
        };
        
        registerPassword.addEventListener('input', validatePasswords);
        registerConfirmPassword.addEventListener('input', validatePasswords);
    }
});

// Helper functions for validation messages
function showValidationMessage(input, message) {
    // Remove existing message
    removeValidationMessage(input);
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = 'validation-message';
    messageElement.style.color = '#e74c3c';
    messageElement.style.fontSize = '0.8rem';
    messageElement.style.marginTop = '5px';
    messageElement.textContent = message;
    
    // Insert after input
    input.parentNode.appendChild(messageElement);
}

function removeValidationMessage(input) {
    const existingMessage = input.parentNode.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Auto-logout after 30 minutes of inactivity (for demo purposes)
let inactivityTimer;

function setupInactivityTimer() {
    resetInactivityTimer();
    
    // Reset timer on user activity
    const events = ['mousemove', 'keypress', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
        document.addEventListener(event, resetInactivityTimer);
    });
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        const currentUser = auth.getCurrentUser();
        if (currentUser) {
            if (confirm('You have been inactive for 30 minutes. Would you like to stay logged in?')) {
                resetInactivityTimer();
            } else {
                auth.logout();
                window.location.href = 'index.html';
            }
        }
    }, 30 * 60 * 1000); // 30 minutes
}

// Add this CSS dynamically for validation messages
const style = document.createElement('style');
style.textContent = `
    .validation-message {
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 5px;
    }
    
    input:invalid, select:invalid {
        border-color: #e74c3c;
    }
    
    input:valid, select:valid {
        border-color: #27ae60;
    }
    
    .no-results, .no-applications, .no-recommendations, .no-activity, .no-deadlines {
        text-align: center;
        padding: 40px;
        color: #7f8c8d;
    }
    
    .status-pending { background-color: #fdebd0; color: #f39c12; }
    .status-approved { background-color: #d5f4e6; color: #27ae60; }
    .status-rejected { background-color: #fadbd8; color: #e74c3c; }
    .status-active { background-color: #d5f4e6; color: #27ae60; }
    .status-closed { background-color: #fadbd8; color: #e74c3c; }
    
    .status-pending-badge { background-color: #fdebd0; color: #f39c12; }
    .status-approved-badge { background-color: #d5f4e6; color: #27ae60; }
    .status-rejected-badge { background-color: #fadbd8; color: #e74c3c; }
`;
document.head.appendChild(style);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { auth, db };
} else {
    window.ScholarshipApp = { auth, db };
}

// Utility function for date formatting (used in portal scripts)
function formatDate(dateString) {
    try {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
        return dateString;
    }
}

// Utility function for category name
function getCategoryName(categoryCode) {
    const categories = {
        'academic': 'Academic Excellence',
        'stem': 'STEM Fields',
        'arts': 'Arts & Humanities',
        'sports': 'Sports',
        'need-based': 'Need-Based',
        'minority': 'Minority Groups',
        'general': 'General'
    };
    
    return categories[categoryCode] || categoryCode;
}