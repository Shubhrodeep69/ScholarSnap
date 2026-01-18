/**
 * MAIN INTEGRATION MODULE
 * Connects all modules and manages application flow
 * Created by: Member 4 - Integration
 */

/**
 * Application Main Class
 */
class ScholarshipAIApp {
    constructor() {
        this.studentProfile = null;
        this.currentMatches = [];
        this.isInitialized = false;
        
        // Bind methods
        this.init = this.init.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.displayResults = this.displayResults.bind(this);
    }
    
    /**
     * Initialize the application
     */
    init() {
        try {
            console.log('🚀 Initializing Scholarship AI Application...');
            
            // Check if all required modules are available
            if (!window.scholarshipData) {
                throw new Error('Scholarship Data module not found');
            }
            
            if (!window.aiMatching) {
                throw new Error('AI Matching module not found');
            }
            
            if (!window.uiHandler) {
                throw new Error('UI Handler module not found');
            }
            
            // Initialize UI
            uiHandler.initUI();
            
            // Load initial data
            this.loadInitialData();
            
            // Set up global error handling
            this.setupErrorHandling();
            
            this.isInitialized = true;
            console.log('✅ Application initialized successfully');
            
        } catch (error) {
            console.error('❌ Application initialization failed:', error);
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    }
    
    /**
     * Load initial data
     */
    loadInitialData() {
        // Check for any pre-filled form data in URL
        this.checkForPrefilledData();
        
        // Load any saved state
        this.loadApplicationState();
    }
    
    /**
     * Check for pre-filled form data in URL parameters
     */
    checkForPrefilledData() {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has('prefill')) {
            try {
                const prefillData = JSON.parse(decodeURIComponent(urlParams.get('prefill')));
                
                // Fill form fields if they exist
                const fields = ['educationLevel', 'marks', 'category', 'income', 'region', 'interests'];
                fields.forEach(field => {
                    if (prefillData[field]) {
                        const element = document.getElementById(field);
                        if (element) {
                            element.value = prefillData[field];
                        }
                    }
                });
                
                console.log('📝 Form pre-filled from URL');
            } catch (error) {
                console.warn('Could not parse prefill data:', error);
            }
        }
    }
    
    /**
     * Load application state from localStorage
     */
    loadApplicationState() {
        // This is handled by uiHandler.loadSavedScholarships()
        // Additional application state can be loaded here
    }
    
    /**
     * Handle form submission (main entry point)
     */
    handleFormSubmit(formData) {
        if (!this.isInitialized) {
            this.showError('Application not initialized');
            return;
        }
        
        try {
            // Create student profile
            this.studentProfile = new aiMatching.StudentProfile(formData);
            
            // Validate profile
            const errors = this.studentProfile.validate();
            if (errors.length > 0) {
                this.showError(errors.join('\n'));
                return;
            }
            
            // Get all scholarships
            const scholarships = scholarshipData.getAllScholarships();
            
            // Find matches using AI
            this.currentMatches = aiMatching.findMatchingScholarships(
                this.studentProfile, 
                scholarships
            );
            
            // Apply personalization
            this.currentMatches = aiMatching.getPersonalizedRecommendations(
                this.studentProfile,
                this.currentMatches
            );
            
            // Update URL with search parameters (without page reload)
            this.updateURLWithSearchParams(formData);
            
            return this.currentMatches;
            
        } catch (error) {
            console.error('Error in form submission:', error);
            this.showError('An error occurred while processing your request');
            return [];
        }
    }
    
    /**
     * Update URL with search parameters
     */
    updateURLWithSearchParams(formData) {
        const url = new URL(window.location);
        
        // Add form data as parameters
        Object.keys(formData).forEach(key => {
            if (formData[key]) {
                url.searchParams.set(key, formData[key]);
            }
        });
        
        // Update URL without reloading page
        window.history.pushState({}, '', url.toString());
    }
    
    /**
     * Display results in UI
     */
    displayResults(matches) {
        if (!matches || matches.length === 0) {
            uiHandler.displayResults([]);
            return;
        }
        
        // Apply any active filters
        const filters = uiHandler.getCurrentFilters ? uiHandler.getCurrentFilters() : {};
        const filteredMatches = aiMatching.filterScholarships(matches, filters);
        
        // Display in UI
        uiHandler.displayResults(filteredMatches);
        
        // Log analytics
        this.logSearchAnalytics(matches.length);
    }
    
    /**
     * Log search analytics
     */
    logSearchAnalytics(resultCount) {
        // In a real application, you would send this to an analytics service
        console.log(`🔍 Search completed: Found ${resultCount} scholarships`);
        
        if (this.studentProfile) {
            console.log('📊 Student Profile:', {
                educationLevel: this.studentProfile.educationLevel,
                category: this.studentProfile.category,
                region: this.studentProfile.region
            });
        }
    }
    
    /**
     * Get application statistics
     */
    getStatistics() {
        const totalScholarships = scholarshipData.getAllScholarships().length;
        const savedCount = uiHandler.getSavedCount ? uiHandler.getSavedCount() : 0;
        
        return {
            totalScholarships,
            savedCount,
            searchCount: this.currentMatches.length,
            lastSearch: this.studentProfile ? new Date().toISOString() : null
        };
    }
    
    /**
     * Export search results
     */
    exportResults(format = 'json') {
        if (this.currentMatches.length === 0) {
            this.showError('No results to export');
            return;
        }
        
        try {
            let exportData;
            
            switch (format.toLowerCase()) {
                case 'json':
                    exportData = JSON.stringify({
                        studentProfile: this.studentProfile,
                        matches: this.currentMatches,
                        exportedAt: new Date().toISOString()
                    }, null, 2);
                    this.downloadFile(exportData, 'scholarship-matches.json', 'application/json');
                    break;
                    
                case 'csv':
                    exportData = this.convertToCSV(this.currentMatches);
                    this.downloadFile(exportData, 'scholarship-matches.csv', 'text/csv');
                    break;
                    
                default:
                    this.showError('Unsupported export format');
            }
            
            console.log(`📤 Exported ${this.currentMatches.length} results as ${format}`);
            
        } catch (error) {
            console.error('Export failed:', error);
            this.showError('Failed to export results');
        }
    }
    
    /**
     * Convert matches to CSV format
     */
    convertToCSV(matches) {
        const headers = ['Name', 'Match%', 'Amount', 'Deadline', 'Provider', 'Education Level'];
        const rows = matches.map(match => [
            `"${match.name}"`,
            match.matchScore,
            match.amount,
            match.deadline,
            `"${match.provider}"`,
            match.degree
        ]);
        
        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }
    
    /**
     * Download file
     */
    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    /**
     * Setup global error handling
     */
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.showError('An unexpected error occurred');
        });
        
        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showError('An unexpected error occurred');
        });
    }
    
    /**
     * Show error message
     */
    showError(message) {
        uiHandler.showNotification ? 
            uiHandler.showNotification(message, 'error') :
            alert(`Error: ${message}`);
    }
    
    /**
     * Show success message
     */
    showSuccess(message) {
        uiHandler.showNotification ? 
            uiHandler.showNotification(message, 'success') :
            alert(`Success: ${message}`);
    }
    
    /**
     * Reset application state
     */
    reset() {
        this.studentProfile = null;
        this.currentMatches = [];
        
        // Reset UI
        uiHandler.resetForm();
        
        // Clear URL parameters
        window.history.pushState({}, '', window.location.pathname);
        
        console.log('🔄 Application reset');
    }
    
    /**
     * Get application version info
     */
    getVersionInfo() {
        return {
            version: '1.0.0',
            modules: {
                data: '1.0.0',
                ai: '1.0.0',
                ui: '1.0.0',
                main: '1.0.0'
            },
            team: ['Member 1', 'Member 2', 'Member 3', 'Member 4'],
            lastUpdated: '2024-01-20'
        };
    }
}

// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create global application instance
    window.scholarshipAIApp = new ScholarshipAIApp();
    
    // Initialize with a small delay to ensure all modules are loaded
    setTimeout(() => {
        window.scholarshipAIApp.init();
    }, 100);
    
    // Add global helper functions
    window.scholarshipHelpers = {
        /**
         * Quick search helper
         */
        quickSearch: function(profileData) {
            return window.scholarshipAIApp.handleFormSubmit(profileData);
        },
        
        /**
         * Get scholarship by ID
         */
        getScholarship: function(id) {
            return scholarshipData.getScholarshipById(id);
        },
        
        /**
         * Get all scholarships
         */
        getAllScholarships: function() {
            return scholarshipData.getAllScholarships();
        },
        
        /**
         * Calculate match for specific scholarship
         */
        calculateMatch: function(studentData, scholarshipId) {
            const student = new aiMatching.StudentProfile(studentData);
            const scholarship = scholarshipData.getScholarshipById(scholarshipId);
            
            if (!scholarship) return null;
            
            return aiMatching.calculateMatch(student, scholarship);
        },
        
        /**
         * Export functionality
         */
        exportResults: function(format) {
            window.scholarshipAIApp.exportResults(format);
        },
        
        /**
         * Get statistics
         */
        getStats: function() {
            return window.scholarshipAIApp.getStatistics();
        },
        
        /**
         * Get version info
         */
        getVersion: function() {
            return window.scholarshipAIApp.getVersionInfo();
        }
    };
    
    // Log initialization
    console.log('🎓 Scholarship AI Application Ready!');
    console.log('📚 Available commands:');
    console.log('- scholarshipHelpers.quickSearch(profileData)');
    console.log('- scholarshipHelpers.getScholarship(id)');
    console.log('- scholarshipHelpers.calculateMatch(studentData, scholarshipId)');
    console.log('- scholarshipHelpers.exportResults(format)');
    console.log('- scholarshipHelpers.getStats()');
    console.log('- scholarshipHelpers.getVersion()');
});

// Make app available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScholarshipAIApp;
}