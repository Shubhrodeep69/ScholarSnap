// Centralized Database System with User Separation
class ScholarshipDatabase {
    constructor() {
        this.loadData();
    }
    
    loadData() {
        // Load all data from localStorage
        this.scholarships = JSON.parse(localStorage.getItem('scholarships_db')) || [];
        this.applications = JSON.parse(localStorage.getItem('applications_db')) || [];
        this.users = JSON.parse(localStorage.getItem('scholarship_users')) || [];
    }
    
    saveData() {
        localStorage.setItem('scholarships_db', JSON.stringify(this.scholarships));
        localStorage.setItem('applications_db', JSON.stringify(this.applications));
        localStorage.setItem('scholarship_users', JSON.stringify(this.users));
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
            createdAt: new Date().toISOString(),
            applications: 0
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
        // Check if scholarship belongs to admin
        const scholarship = this.scholarships.find(s => s.id === id && s.adminId === adminId);
        if (!scholarship) return false;
        
        // Remove scholarship
        this.scholarships = this.scholarships.filter(s => s.id !== id);
        
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
        }
        
        this.saveData();
        return newApplication;
    }
    
    updateApplicationStatus(id, status, adminId) {
        const application = this.applications.find(app => app.id === id);
        if (!application) return null;
        
        // Verify admin owns the scholarship
        const scholarship = this.getScholarshipById(application.scholarshipId);
        if (scholarship.adminId !== adminId) return null;
        
        application.status = status;
        application.reviewedDate = new Date().toISOString();
        application.reviewedBy = adminId;
        
        this.saveData();
        return application;
    }
    
    // User Methods
    registerUser(userData) {
        const newUser = {
            id: this.generateId('users'),
            ...userData,
            createdAt: new Date().toISOString()
        };
        
        this.users.push(newUser);
        this.saveData();
        return newUser;
    }
    
    getUserByEmail(email) {
        return this.users.find(u => u.email === email);
    }
    
    // Helper Methods
    generateId(type) {
        const items = type === 'scholarships' ? this.scholarships : 
                     type === 'applications' ? this.applications : 
                     this.users;
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

// Create global database instance
const db = new ScholarshipDatabase();