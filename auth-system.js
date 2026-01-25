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
        
        // Default users
        const defaultUsers = [
            { 
                id: 1, 
                username: "admin1", 
                email: "admin1@scholarship.com", 
                password: "admin123", 
                role: "admin", 
                organization: "University Excellence Fund",
                name: "John Smith"
            },
            { 
                id: 2, 
                username: "admin2", 
                email: "admin2@scholarship.com", 
                password: "admin123", 
                role: "admin", 
                organization: "Tech Innovators Scholarship",
                name: "Sarah Johnson"
            },
            { 
                id: 3, 
                username: "student1", 
                email: "student1@university.edu", 
                password: "student123", 
                role: "student", 
                name: "Alex Johnson",
                gpa: 3.8,
                major: "Computer Science"
            },
            { 
                id: 4, 
                username: "student2", 
                email: "student2@university.edu", 
                password: "student123", 
                role: "student", 
                name: "Maria Garcia",
                gpa: 3.9,
                major: "Biomedical Engineering"
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
        if (this.users.find(u => u.email === userData.email || u.username === userData.username)) {
            return { success: false, message: "User already exists" };
        }
        
        // Create new user
        const newUser = {
            id: this.users.length + 1,
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
        
        return { success: false, message: "Invalid credentials" };
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
}

// Create global auth instance
const auth = new AuthSystem();