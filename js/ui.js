/**
 * UI HANDLING MODULE
 * Manages user interface interactions and display
 * Created by: Member 4 - Integration
 */

// UI State Management
const UIState = {
    currentMatches: [],
    savedScholarships: new Set(),
    currentFilters: {
        minMatch: 50,
        sortBy: 'match'
    },
    isLoading: false
};

/**
 * Initialize all UI event listeners
 */
function initUI() {
    // Form submission
    const form = document.getElementById('studentForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Reset form
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetForm);
    }
    
    // Filter controls
    const minMatchSlider = document.getElementById('minMatch');
    const matchValue = document.getElementById('matchValue');
    const sortSelect = document.getElementById('sortBy');
    const applyFiltersBtn = document.getElementById('applyFilters');
    
    if (minMatchSlider && matchValue) {
        minMatchSlider.addEventListener('input', function() {
            matchValue.textContent = `${this.value}%`;
            UIState.currentFilters.minMatch = parseInt(this.value);
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            UIState.currentFilters.sortBy = this.value;
        });
    }
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    // Modal controls
    const modal = document.getElementById('detailsModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Load saved scholarships from localStorage
    loadSavedScholarships();
    
    // Initialize empty state
    updateResultsCount(0);
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (UIState.isLoading) return;
    
    // Get form values
    const formData = {
        educationLevel: document.getElementById('educationLevel').value,
        marks: document.getElementById('marks').value,
        category: document.getElementById('category').value,
        income: document.getElementById('income').value,
        region: document.getElementById('region').value,
        interests: document.getElementById('interests').value
    };
    
    // Show loading state
    setLoadingState(true);
    
    // Validate form
    const student = new aiMatching.StudentProfile(formData);
    const errors = student.validate();
    
    if (errors.length > 0) {
        alert('Please fix the following errors:\n' + errors.join('\n'));
        setLoadingState(false);
        return;
    }
    
    // Get all scholarships
    const scholarships = scholarshipData.getAllScholarships();
    
    // Find matches using AI
    setTimeout(() => {
        const matches = aiMatching.findMatchingScholarships(student, scholarships);
        
        // Apply personalization based on interests
        const personalized = aiMatching.getPersonalizedRecommendations(student, matches);
        
        // Update UI state
        UIState.currentMatches = personalized;
        
        // Apply current filters
        const filtered = aiMatching.filterScholarships(personalized, UIState.currentFilters);
        
        // Display results
        displayResults(filtered);
        
        // Hide loading state
        setLoadingState(false);
    }, 500); // Simulate AI processing time
}

/**
 * Display scholarship results
 * @param {Array} matches - Matching scholarships
 */
function displayResults(matches) {
    const container = document.getElementById('resultsContainer');
    
    if (!container) return;
    
    if (!matches || matches.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search fa-3x"></i>
                <h3>No scholarships found</h3>
                <p>Try adjusting your criteria or filters</p>
            </div>
        `;
        updateResultsCount(0);
        return;
    }
    
    // Generate scholarship cards
    let resultsHTML = '';
    
    matches.forEach(match => {
        resultsHTML += scholarshipData.getScholarshipCardHTML(
            match, 
            match.matchScore, 
            match.explanation
        );
    });
    
    container.innerHTML = resultsHTML;
    updateResultsCount(matches.length);
    
    // Add event listeners to new cards
    attachCardEventListeners();
}

/**
 * Attach event listeners to scholarship cards
 */
function attachCardEventListeners() {
    // View details buttons
    const viewDetailBtns = document.querySelectorAll('.view-details');
    viewDetailBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const scholarshipId = parseInt(this.getAttribute('data-id'));
            showScholarshipDetails(scholarshipId);
        });
    });
    
    // Save scholarship buttons
    const saveBtns = document.querySelectorAll('.save-scholarship');
    saveBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const scholarshipId = parseInt(this.getAttribute('data-id'));
            toggleSaveScholarship(scholarshipId);
        });
    });
    
    // Scholarship card click (entire card)
    const cards = document.querySelectorAll('.scholarship-card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking buttons inside
            if (!e.target.closest('.btn')) {
                const scholarshipId = parseInt(this.getAttribute('data-id'));
                showScholarshipDetails(scholarshipId);
            }
        });
    });
}

/**
 * Show detailed scholarship view in modal
 * @param {number} scholarshipId - Scholarship ID
 */
function showScholarshipDetails(scholarshipId) {
    const scholarship = scholarshipData.getScholarshipById(scholarshipId);
    
    if (!scholarship) return;
    
    // Find match score for this scholarship
    const match = UIState.currentMatches.find(m => m.id === scholarshipId);
    const matchScore = match ? match.matchScore : 0;
    const matchDetails = match ? match.matchDetails : [];
    
    // Get detailed HTML
    const detailsHTML = scholarshipData.getScholarshipDetailsHTML(scholarship, matchScore);
    
    // Add match breakdown if available
    let fullHTML = detailsHTML;
    if (matchDetails.length > 0) {
        const breakdownHTML = aiMatching.getMatchBreakdownHTML(matchDetails);
        fullHTML += breakdownHTML;
    }
    
    // Update modal
    document.getElementById('modalTitle').textContent = scholarship.name;
    document.getElementById('modalBody').innerHTML = fullHTML;
    
    // Update save button
    const saveBtn = document.getElementById('saveBtn');
    if (UIState.savedScholarships.has(scholarshipId)) {
        saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Remove from Saved';
        saveBtn.classList.add('saved');
    } else {
        saveBtn.innerHTML = '<i class="far fa-bookmark"></i> Save Scholarship';
        saveBtn.classList.remove('saved');
    }
    
    // Update save button event listener
    saveBtn.onclick = () => toggleSaveScholarship(scholarshipId);
    
    // Show modal
    document.getElementById('detailsModal').style.display = 'flex';
}

/**
 * Toggle save status of a scholarship
 * @param {number} scholarshipId - Scholarship ID
 */
function toggleSaveScholarship(scholarshipId) {
    if (UIState.savedScholarships.has(scholarshipId)) {
        UIState.savedScholarships.delete(scholarshipId);
        showNotification('Removed from saved scholarships', 'info');
    } else {
        UIState.savedScholarships.add(scholarshipId);
        showNotification('Scholarship saved!', 'success');
    }
    
    // Update save buttons
    updateSaveButtonStates();
    
    // Update saved scholarships display
    displaySavedScholarships();
    
    // Save to localStorage
    saveToLocalStorage();
}

/**
 * Update all save button states
 */
function updateSaveButtonStates() {
    // Update buttons in results
    const saveBtns = document.querySelectorAll('.save-scholarship');
    saveBtns.forEach(btn => {
        const scholarshipId = parseInt(btn.getAttribute('data-id'));
        if (UIState.savedScholarships.has(scholarshipId)) {
            btn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
            btn.classList.add('saved');
        } else {
            btn.innerHTML = '<i class="far fa-bookmark"></i> Save';
            btn.classList.remove('saved');
        }
    });
    
    // Update modal save button
    const modalSaveBtn = document.getElementById('saveBtn');
    const scholarshipId = modalSaveBtn.onclick ? 
        parseInt(modalSaveBtn.onclick.toString().match(/\d+/)?.[0]) : null;
    
    if (scholarshipId && UIState.savedScholarships.has(scholarshipId)) {
        modalSaveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Remove from Saved';
        modalSaveBtn.classList.add('saved');
    } else if (modalSaveBtn) {
        modalSaveBtn.innerHTML = '<i class="far fa-bookmark"></i> Save Scholarship';
        modalSaveBtn.classList.remove('saved');
    }
}

/**
 * Display saved scholarships
 */
function displaySavedScholarships() {
    const container = document.getElementById('savedContainer');
    
    if (!container) return;
    
    if (UIState.savedScholarships.size === 0) {
        container.innerHTML = '<p class="empty-saved">No saved scholarships yet</p>';
        return;
    }
    
    let savedHTML = '';
    
    UIState.savedScholarships.forEach(scholarshipId => {
        const scholarship = scholarshipData.getScholarshipById(scholarshipId);
        if (!scholarship) return;
        
        // Find match score
        const match = UIState.currentMatches.find(m => m.id === scholarshipId);
        const matchScore = match ? match.matchScore : 0;
        
        savedHTML += `
            <div class="saved-scholarship">
                <div class="saved-info">
                    <div class="name">${scholarship.name}</div>
                    <div class="match">${matchScore}% Match</div>
                    <div class="amount">₹${scholarship.amount.toLocaleString()}</div>
                </div>
                <div class="saved-actions">
                    <button class="btn btn-small view-saved" data-id="${scholarshipId}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="remove-saved" data-id="${scholarshipId}" title="Remove">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = savedHTML;
    
    // Add event listeners
    const viewSavedBtns = document.querySelectorAll('.view-saved');
    viewSavedBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const scholarshipId = parseInt(this.getAttribute('data-id'));
            showScholarshipDetails(scholarshipId);
        });
    });
    
    const removeBtns = document.querySelectorAll('.remove-saved');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const scholarshipId = parseInt(this.getAttribute('data-id'));
            toggleSaveScholarship(scholarshipId);
        });
    });
}

/**
 * Apply filters to current results
 */
function applyFilters() {
    if (UIState.currentMatches.length === 0) return;
    
    const filtered = aiMatching.filterScholarships(
        UIState.currentMatches, 
        UIState.currentFilters
    );
    
    displayResults(filtered);
}

/**
 * Reset form to initial state
 */
function resetForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-search fa-3x"></i>
            <h3>No scholarships yet</h3>
            <p>Fill out the form and click "Find Scholarships" to see matching opportunities</p>
        </div>
    `;
    updateResultsCount(0);
    UIState.currentMatches = [];
}

/**
 * Set loading state
 * @param {boolean} isLoading - Whether loading is active
 */
function setLoadingState(isLoading) {
    UIState.isLoading = isLoading;
    const findBtn = document.getElementById('findBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    if (isLoading) {
        findBtn.disabled = true;
        loadingSpinner.style.display = 'inline-block';
        findBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Finding Scholarships...';
    } else {
        findBtn.disabled = false;
        loadingSpinner.style.display = 'none';
        findBtn.innerHTML = '<i class="fas fa-search"></i> Find Scholarships';
    }
}

/**
 * Update results count display
 * @param {number} count - Number of results
 */
function updateResultsCount(count) {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = count;
    }
}

/**
 * Close modal dialog
 */
function closeModal() {
    document.getElementById('detailsModal').style.display = 'none';
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Save data to localStorage
 */
function saveToLocalStorage() {
    const savedData = {
        savedScholarships: Array.from(UIState.savedScholarships),
        filters: UIState.currentFilters
    };
    
    localStorage.setItem('scholarshipAI', JSON.stringify(savedData));
}

/**
 * Load data from localStorage
 */
function loadSavedScholarships() {
    const savedData = localStorage.getItem('scholarshipAI');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            if (data.savedScholarships) {
                UIState.savedScholarships = new Set(data.savedScholarships);
            }
            
            if (data.filters) {
                UIState.currentFilters = { ...UIState.currentFilters, ...data.filters };
                
                // Update UI
                const minMatchSlider = document.getElementById('minMatch');
                const matchValue = document.getElementById('matchValue');
                const sortSelect = document.getElementById('sortBy');
                
                if (minMatchSlider && matchValue) {
                    minMatchSlider.value = UIState.currentFilters.minMatch;
                    matchValue.textContent = `${UIState.currentFilters.minMatch}%`;
                }
                
                if (sortSelect) {
                    sortSelect.value = UIState.currentFilters.sortBy;
                }
            }
            
            // Display saved scholarships
            displaySavedScholarships();
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
}

// Add notification styles
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            transform: translateX(150%);
            transition: transform 0.3s ease;
            z-index: 1001;
            max-width: 350px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left: 4px solid #4cc9f0;
        }
        
        .notification.error {
            border-left: 4px solid #f72585;
        }
        
        .notification.info {
            border-left: 4px solid #4361ee;
        }
        
        .notification i {
            font-size: 1.2rem;
        }
        
        .notification.success i {
            color: #4cc9f0;
        }
        
        .notification.error i {
            color: #f72585;
        }
        
        .notification.info i {
            color: #4361ee;
        }
        
        .saved-scholarship {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 0.5rem;
        }
        
        .saved-info {
            flex: 1;
        }
        
        .saved-info .name {
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        
        .saved-info .match {
            font-size: 0.9rem;
            color: #4361ee;
            margin-bottom: 0.25rem;
        }
        
        .saved-info .amount {
            font-size: 0.9rem;
            color: #4cc9f0;
            font-weight: 600;
        }
        
        .saved-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .remove-saved {
            background: none;
            border: none;
            color: #f72585;
            cursor: pointer;
            font-size: 1.2rem;
            padding: 0.25rem;
        }
        
        .btn.saved {
            background: #4cc9f0;
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addNotificationStyles();
    initUI();
});

// Export UI functions
window.uiHandler = {
    initUI,
    displayResults,
    showScholarshipDetails,
    toggleSaveScholarship,
    applyFilters,
    resetForm,
    showNotification
};