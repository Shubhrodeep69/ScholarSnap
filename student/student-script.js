// Secure Student Portal JavaScript

// Check if user is a valid student
document.addEventListener('DOMContentLoaded', () => {
    // Access control is handled by portal-guard.js
    // This script runs only after portal-guard confirms user is a student
    
    const currentStudent = window.ScholarshipApp?.auth?.getCurrentUser();
    const db = window.ScholarshipApp?.db;
    
    if (!currentStudent || !db) {
        console.error('Student portal initialization failed');
        return;
    }
    
    // Initialize student portal
    initStudentPortal(currentStudent, db);
});

function initStudentPortal(currentStudent, db) {
    // DOM Elements
    const updateProfileBtn = document.getElementById('updateProfileBtn');
    const aiRecommendationsBtn = document.getElementById('aiRecommendationsBtn');
    const browseScholarshipsBtn = document.getElementById('browseScholarshipsBtn');
    const viewApplicationsBtn = document.getElementById('viewApplicationsBtn');
    const getRecommendationsBtn = document.getElementById('getRecommendationsBtn');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const cancelApplicationBtn = document.getElementById('cancelApplicationBtn');
    const updateProfileForAI = document.getElementById('updateProfileForAI');
    const studentApplicationForm = document.getElementById('studentApplicationForm');
    const scholarshipsList = document.querySelector('.scholarships-list');
    const applicationsList = document.querySelector('.applications-list');
    const recommendationsList = document.querySelector('.recommendations');
    const deadlineList = document.querySelector('.deadline-list');
    
    // Navigation Elements
    const contentSections = document.querySelectorAll('.content-section');
    const dashboardSection = document.getElementById('dashboard');
    const browseSection = document.getElementById('browse-scholarships');
    const applicationsSection = document.getElementById('my-applications');
    const recommendationsSection = document.getElementById('ai-recommendations');
    const applicationFormSection = document.getElementById('application-form');
    
    // Student profile data
    const studentProfile = {
        name: currentStudent.name,
        email: currentStudent.email,
        gpa: currentStudent.gpa || 0,
        major: currentStudent.major || 'Undeclared',
        category: currentStudent.category || 'general',
        incomeLevel: currentStudent.incomeLevel || 'middle',
        interests: currentStudent.interests || ['General']
    };
    
    // Get student's applications
    let studentApplications = db.getApplications(null, currentStudent.id);
    
    // Navigation Functions
    function showSection(section) {
        // Hide all sections
        contentSections.forEach(sec => {
            sec.classList.remove('active');
        });
        
        // Show the requested section
        section.classList.add('active');
    }
    
    // Navigation Button Event Listeners
    if (browseScholarshipsBtn) {
        browseScholarshipsBtn.addEventListener('click', () => {
            showSection(browseSection);
            loadScholarships();
        });
    }
    
    if (viewApplicationsBtn) {
        viewApplicationsBtn.addEventListener('click', () => {
            showSection(applicationsSection);
            loadStudentApplications();
        });
    }
    
    if (getRecommendationsBtn) {
        getRecommendationsBtn.addEventListener('click', () => {
            showSection(recommendationsSection);
            loadAIRecommendations();
        });
    }
    
    if (aiRecommendationsBtn) {
        aiRecommendationsBtn.addEventListener('click', () => {
            showSection(recommendationsSection);
            loadAIRecommendations();
        });
    }
    
    if (updateProfileBtn) {
        updateProfileBtn.addEventListener('click', () => {
            showUpdateProfileForm();
        });
    }
    
    if (updateProfileForAI) {
        updateProfileForAI.addEventListener('click', () => {
            showUpdateProfileForm();
        });
    }
    
    // Load Scholarships
    function loadScholarships() {
        // Get filter values
        const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
        const sortBy = document.getElementById('sortBy')?.value || 'deadline';
        
        // Filter scholarships
        let filteredScholarships = db.getScholarships(); // Gets all active scholarships
        
        if (categoryFilter !== 'all') {
            filteredScholarships = filteredScholarships.filter(s => s.category === categoryFilter);
        }
        
        // Sort scholarships
        if (sortBy === 'deadline') {
            filteredScholarships.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        } else if (sortBy === 'amount') {
            filteredScholarships.sort((a, b) => {
                const amountA = parseFloat(a.amount.replace(/[^0-9.-]+/g, ''));
                const amountB = parseFloat(b.amount.replace(/[^0-9.-]+/g, ''));
                return amountB - amountA;
            });
        } else if (sortBy === 'newest') {
            filteredScholarships.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        // Clear the list
        if (scholarshipsList) {
            scholarshipsList.innerHTML = '';
        }
        
        // Check if there are scholarships
        if (filteredScholarships.length === 0) {
            scholarshipsList.innerHTML = `
                <div class="no-results">
                    <p>No scholarships found matching your criteria.</p>
                    <button class="btn btn-primary" id="resetFiltersBtn">Reset Filters</button>
                </div>
            `;
            
            document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {
                if (document.getElementById('categoryFilter')) {
                    document.getElementById('categoryFilter').value = 'all';
                }
                if (document.getElementById('sortBy')) {
                    document.getElementById('sortBy').value = 'deadline';
                }
                loadScholarships();
            });
            
            return;
        }
        
        // Add scholarships to the list
        filteredScholarships.forEach(scholarship => {
            // Check if student has already applied
            const hasApplied = studentApplications.some(app => app.scholarshipId === scholarship.id);
            
            const card = document.createElement('div');
            card.className = 'scholarship-card';
            
            card.innerHTML = `
                <div class="scholarship-header">
                    <div class="scholarship-title">
                        <h3>${scholarship.name}</h3>
                        <p>${scholarship.provider}</p>
                    </div>
                    <div class="scholarship-amount">${scholarship.amount}</div>
                </div>
                <div class="scholarship-details">
                    <p>${scholarship.description.substring(0, 150)}...</p>
                    <p><strong>Deadline:</strong> <span class="scholarship-deadline">${formatDate(scholarship.deadline)}</span></p>
                    <p><strong>Eligibility:</strong> ${scholarship.eligibility.substring(0, 100)}...</p>
                </div>
                <div class="scholarship-actions">
                    ${hasApplied ? 
                        `<button class="btn btn-secondary" disabled>Already Applied</button>` :
                        `<button class="btn btn-primary apply-btn" data-id="${scholarship.id}">Apply Now</button>`
                    }
                    <button class="btn btn-secondary view-details-btn" data-id="${scholarship.id}">View Details</button>
                </div>
            `;
            
            scholarshipsList.appendChild(card);
        });
        
        // Add event listeners to Apply buttons
        document.querySelectorAll('.apply-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const scholarshipId = parseInt(btn.getAttribute('data-id'));
                startApplication(scholarshipId);
            });
        });
        
        // Add event listeners to View Details buttons
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const scholarshipId = parseInt(btn.getAttribute('data-id'));
                viewScholarshipDetails(scholarshipId);
            });
        });
    }
    
    // Start Application Process
    function startApplication(scholarshipId) {
        const scholarship = db.getScholarshipById(scholarshipId);
        if (!scholarship) return;
        
        // Check if already applied
        const hasApplied = studentApplications.some(app => app.scholarshipId === scholarshipId);
        if (hasApplied) {
            alert('You have already applied for this scholarship.');
            return;
        }
        
        // Check if deadline has passed
        const deadline = new Date(scholarship.deadline);
        const today = new Date();
        if (deadline < today) {
            alert('Sorry, the deadline for this scholarship has passed.');
            return;
        }
        
        // Set form title and subtitle
        document.getElementById('applicationFormTitle').textContent = `Apply for: ${scholarship.name}`;
        document.getElementById('applicationFormSubtitle').textContent = `${scholarship.provider} - ${scholarship.amount}`;
        
        // Set hidden scholarship ID
        document.getElementById('scholarshipId').value = scholarshipId;
        
        // Pre-fill student info
        document.getElementById('applicantName').value = studentProfile.name;
        document.getElementById('applicantEmail').value = studentProfile.email;
        document.getElementById('applicantGPA').value = studentProfile.gpa || '';
        document.getElementById('applicantMajor').value = studentProfile.major || '';
        
        // Clear essay field
        document.getElementById('applicantEssay').value = '';
        
        // Show application form section
        showSection(applicationFormSection);
    }
    
    // View Scholarship Details
    function viewScholarshipDetails(scholarshipId) {
        const scholarship = db.getScholarshipById(scholarshipId);
        if (!scholarship) return;
        
        // Create modal for details
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        // Check if student has already applied
        const hasApplied = studentApplications.some(app => app.scholarshipId === scholarshipId);
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" style="float: right; cursor: pointer; font-size: 24px;">&times;</span>
                <h3>${scholarship.name}</h3>
                <div class="scholarship-details-modal">
                    <p><strong>Provider:</strong> ${scholarship.provider}</p>
                    <p><strong>Amount:</strong> ${scholarship.amount}</p>
                    <p><strong>Deadline:</strong> ${formatDate(scholarship.deadline)}</p>
                    <p><strong>Category:</strong> ${getCategoryName(scholarship.category)}</p>
                    <p><strong>Description:</strong></p>
                    <p>${scholarship.description}</p>
                    <p><strong>Eligibility Criteria:</strong></p>
                    <p>${scholarship.eligibility}</p>
                    ${scholarship.maxApplicants ? `<p><strong>Maximum Applicants:</strong> ${scholarship.maxApplicants}</p>` : ''}
                    <p><strong>Applications Received:</strong> ${scholarship.applications || 0}</p>
                </div>
                <div class="modal-actions">
                    ${hasApplied ? 
                        `<button class="btn btn-secondary" disabled>Already Applied</button>` :
                        `<button class="btn btn-primary" id="applyFromModal">Apply Now</button>`
                    }
                    <button class="btn btn-secondary" id="closeModalBtn">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#closeModalBtn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        if (!hasApplied) {
            modal.querySelector('#applyFromModal').addEventListener('click', () => {
                document.body.removeChild(modal);
                startApplication(scholarshipId);
            });
        }
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // Load Student Applications
    function loadStudentApplications() {
        if (!applicationsList) return;
        
        applicationsList.innerHTML = '';
        
        // Refresh applications list
        studentApplications = db.getApplications(null, currentStudent.id);
        
        if (studentApplications.length === 0) {
            applicationsList.innerHTML = `
                <div class="no-applications">
                    <p>You haven't applied for any scholarships yet.</p>
                    <button class="btn btn-primary" id="browseFromApplications">Browse Scholarships</button>
                </div>
            `;
            
            document.getElementById('browseFromApplications')?.addEventListener('click', () => {
                showSection(browseSection);
                loadScholarships();
            });
            
            return;
        }
        
        // Update application stats
        updateApplicationStats();
        
        studentApplications.forEach(app => {
            const scholarship = db.getScholarshipById(app.scholarshipId);
            if (!scholarship) return;
            
            const item = document.createElement('div');
            item.className = 'application-item';
            
            // Determine status color
            let statusColor = '#7f8c8d'; // Default gray
            if (app.status === 'approved') statusColor = '#27ae60';
            else if (app.status === 'rejected') statusColor = '#e74c3c';
            else if (app.status === 'pending') statusColor = '#f39c12';
            
            item.innerHTML = `
                <div class="application-info">
                    <h3>${scholarship.name}</h3>
                    <p>${scholarship.provider} • Applied on ${formatDate(app.appliedDate)}</p>
                    <p>Amount: ${scholarship.amount}</p>
                    ${app.reviewedDate ? `<p>Reviewed on: ${formatDate(app.reviewedDate)}</p>` : ''}
                </div>
                <div class="application-status" style="background-color: ${statusColor}; color: white;">
                    ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </div>
            `;
            
            applicationsList.appendChild(item);
        });
    }
    
    // Update Application Statistics
    function updateApplicationStats() {
        const stats = {
            pending: studentApplications.filter(app => app.status === 'pending').length,
            approved: studentApplications.filter(app => app.status === 'approved').length,
            rejected: studentApplications.filter(app => app.status === 'rejected').length,
            total: studentApplications.length
        };
        
        // Update stats in profile sidebar
        const appliedStat = document.querySelector('.profile-stats .stat:nth-child(2) p');
        if (appliedStat) {
            appliedStat.textContent = stats.total;
        }
        
        const awardedStat = document.querySelector('.profile-stats .stat:nth-child(3) p');
        if (awardedStat) {
            awardedStat.textContent = stats.approved;
        }
        
        // Update dashboard stats bars
        updateStatsBars(stats);
    }
    
    // Update Stats Bars on Dashboard
    function updateStatsBars(stats) {
        const total = stats.total || 1; // Avoid division by zero
        
        // Update bars
        const pendingBar = document.querySelector('.stat-bar:nth-child(1) .stat-bar-fill');
        const approvedBar = document.querySelector('.stat-bar:nth-child(2) .stat-bar-fill');
        const rejectedBar = document.querySelector('.stat-bar:nth-child(3) .stat-bar-fill');
        const draftsBar = document.querySelector('.stat-bar:nth-child(4) .stat-bar-fill');
        
        // Update values
        const pendingValue = document.querySelector('.stat-bar:nth-child(1) .stat-value');
        const approvedValue = document.querySelector('.stat-bar:nth-child(2) .stat-value');
        const rejectedValue = document.querySelector('.stat-bar:nth-child(3) .stat-value');
        const draftsValue = document.querySelector('.stat-bar:nth-child(4) .stat-value');
        
        if (pendingBar && pendingValue) {
            const percentage = (stats.pending / total) * 100;
            pendingBar.style.width = `${percentage}%`;
            pendingValue.textContent = stats.pending;
        }
        
        if (approvedBar && approvedValue) {
            const percentage = (stats.approved / total) * 100;
            approvedBar.style.width = `${percentage}%`;
            approvedValue.textContent = stats.approved;
        }
        
        if (rejectedBar && rejectedValue) {
            const percentage = (stats.rejected / total) * 100;
            rejectedBar.style.width = `${percentage}%`;
            rejectedValue.textContent = stats.rejected;
        }
        
        // Drafts are always 0 in this implementation
        if (draftsBar && draftsValue) {
            draftsBar.style.width = '10%';
            draftsValue.textContent = '0';
        }
    }
    
    // Load AI Recommendations
    function loadAIRecommendations() {
        if (!recommendationsList) return;
        
        recommendationsList.innerHTML = '';
        
        // Get recommendations based on student profile
        const recommendedScholarships = getRecommendedScholarships();
        
        if (recommendedScholarships.length === 0) {
            recommendationsList.innerHTML = `
                <div class="no-recommendations">
                    <p>No recommendations available at the moment. Update your profile for better matches.</p>
                </div>
            `;
            return;
        }
        
        recommendedScholarships.forEach(scholarship => {
            // Calculate match score (simulated AI logic)
            let matchScore = calculateMatchScore(scholarship);
            
            const card = document.createElement('div');
            card.className = 'recommendation-card';
            
            card.innerHTML = `
                <h4>${scholarship.name}</h4>
                <p>${scholarship.description.substring(0, 120)}...</p>
                <div class="match-score">
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${matchScore}%"></div>
                    </div>
                    <div class="score-value">${matchScore}% Match</div>
                </div>
                <div class="scholarship-details">
                    <p><strong>Amount:</strong> ${scholarship.amount}</p>
                    <p><strong>Deadline:</strong> ${formatDate(scholarship.deadline)}</p>
                    <p><strong>Provider:</strong> ${scholarship.provider}</p>
                </div>
                <button class="btn btn-primary apply-recommendation-btn" data-id="${scholarship.id}">Apply Now</button>
            `;
            
            recommendationsList.appendChild(card);
        });
        
        // Add event listeners to Apply buttons in recommendations
        document.querySelectorAll('.apply-recommendation-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const scholarshipId = parseInt(btn.getAttribute('data-id'));
                startApplication(scholarshipId);
            });
        });
    }
    
    // Calculate Match Score (AI Logic)
    function calculateMatchScore(scholarship) {
        let score = 50; // Base score
        
        // Adjust based on GPA match
        if (scholarship.eligibility.toLowerCase().includes('gpa')) {
            const gpaMatch = studentProfile.gpa >= 3.5 ? 20 : 
                            studentProfile.gpa >= 3.0 ? 10 : 0;
            score += gpaMatch;
        }
        
        // Adjust based on category match
        if (scholarship.category === 'stem' && studentProfile.interests?.some(i => 
            i.toLowerCase().includes('technology') || 
            i.toLowerCase().includes('programming') || 
            i.toLowerCase().includes('ai') ||
            i.toLowerCase().includes('science') ||
            i.toLowerCase().includes('engineering') ||
            i.toLowerCase().includes('math'))) {
            score += 15;
        }
        
        // Adjust based on major match
        if (scholarship.eligibility.toLowerCase().includes(studentProfile.major.toLowerCase())) {
            score += 10;
        }
        
        // Ensure score is between 0 and 100
        return Math.min(100, Math.max(0, score));
    }
    
    // Get recommended scholarships (AI Logic)
    function getRecommendedScholarships() {
        const allScholarships = db.getScholarships();
        
        // Filter out scholarships the student has already applied for
        const appliedIds = studentApplications.map(app => app.scholarshipId);
        const notApplied = allScholarships.filter(s => !appliedIds.includes(s.id));
        
        // Sort by match score (highest first)
        const scoredScholarships = notApplied.map(scholarship => ({
            ...scholarship,
            matchScore: calculateMatchScore(scholarship)
        }));
        
        scoredScholarships.sort((a, b) => b.matchScore - a.matchScore);
        
        // Return top 4 recommendations
        return scoredScholarships.slice(0, 4);
    }
    
    // Handle Application Form Submission
    if (studentApplicationForm) {
        studentApplicationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const scholarshipId = parseInt(document.getElementById('scholarshipId').value);
            const scholarship = db.getScholarshipById(scholarshipId);
            
            if (!scholarship) {
                alert('Error: Scholarship not found.');
                return;
            }
            
            // Check if already applied
            if (studentApplications.some(app => app.scholarshipId === scholarshipId)) {
                alert('You have already applied for this scholarship.');
                return;
            }
            
            // Create new application
            const applicationData = {
                studentId: currentStudent.id,
                applicantName: document.getElementById('applicantName').value,
                email: document.getElementById('applicantEmail').value,
                scholarshipId: scholarshipId,
                gpa: parseFloat(document.getElementById('applicantGPA').value),
                major: document.getElementById('applicantMajor').value,
                essay: document.getElementById('applicantEssay').value
            };
            
            // Add to database
            try {
                const newApplication = db.createApplication(applicationData);
                
                // Add to local applications list
                studentApplications.push(newApplication);
                
                // Show success message
                alert('Application submitted successfully! The scholarship provider will review your application.');
                
                // Return to dashboard
                showSection(dashboardSection);
                
                // Update UI
                updateDeadlines();
                updateApplicationStats();
                
            } catch (error) {
                alert('Error submitting application: ' + error.message);
            }
        });
    }
    
    // Save as Draft
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => {
            alert('Draft saved! (In a real app, this would save your progress to the database)');
        });
    }
    
    // Cancel Application
    if (cancelApplicationBtn) {
        cancelApplicationBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                showSection(dashboardSection);
            }
        });
    }
    
    // Apply Filters
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            loadScholarships();
        });
    }
    
    // Update Deadlines
    function updateDeadlines() {
        if (!deadlineList) return;
        
        deadlineList.innerHTML = '';
        
        // Get upcoming deadlines (next 30 days)
        const today = new Date();
        const nextMonth = new Date();
        nextMonth.setDate(today.getDate() + 30);
        
        const allScholarships = db.getScholarships();
        const upcomingScholarships = allScholarships
            .filter(s => {
                const deadline = new Date(s.deadline);
                return deadline >= today && deadline <= nextMonth && s.status === 'active';
            })
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 3); // Show only top 3
        
        if (upcomingScholarships.length === 0) {
            deadlineList.innerHTML = '<p class="no-deadlines">No upcoming deadlines</p>';
            return;
        }
        
        upcomingScholarships.forEach(scholarship => {
            // Check if student has already applied
            const hasApplied = studentApplications.some(app => app.scholarshipId === scholarship.id);
            
            const deadlineItem = document.createElement('div');
            deadlineItem.className = 'deadline-item';
            
            deadlineItem.innerHTML = `
                <div class="deadline-name">${scholarship.name}</div>
                <div class="deadline-date">${formatDate(scholarship.deadline)}</div>
                ${hasApplied ? '<div class="deadline-status">Applied</div>' : ''}
            `;
            
            deadlineList.appendChild(deadlineItem);
        });
    }
    
    // Show Update Profile Form
    function showUpdateProfileForm() {
        // Create modal for profile update
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" style="float: right; cursor: pointer; font-size: 24px;">&times;</span>
                <h3>Update Your Profile</h3>
                <form id="updateProfileForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="updateName">Full Name *</label>
                            <input type="text" id="updateName" value="${studentProfile.name}" required>
                        </div>
                        <div class="form-group">
                            <label for="updateEmail">Email *</label>
                            <input type="email" id="updateEmail" value="${studentProfile.email}" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="updateGPA">Current GPA</label>
                            <input type="number" id="updateGPA" step="0.1" min="0" max="4.0" value="${studentProfile.gpa}">
                        </div>
                        <div class="form-group">
                            <label for="updateMajor">Major/Field</label>
                            <input type="text" id="updateMajor" value="${studentProfile.major}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="updateInterests">Interests (comma-separated)</label>
                        <input type="text" id="updateInterests" value="${studentProfile.interests.join(', ')}">
                        <p class="form-help">Example: Technology, Programming, AI, Research</p>
                    </div>
                    
                    <div class="form-group">
                        <label for="updateIncome">Income Level</label>
                        <select id="updateIncome">
                            <option value="low" ${studentProfile.incomeLevel === 'low' ? 'selected' : ''}>Low Income</option>
                            <option value="middle" ${studentProfile.incomeLevel === 'middle' ? 'selected' : ''}>Middle Class</option>
                            <option value="high" ${studentProfile.incomeLevel === 'high' ? 'selected' : ''}>High Income</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="updateCategory">Category</label>
                        <select id="updateCategory">
                            <option value="general" ${studentProfile.category === 'general' ? 'selected' : ''}>General</option>
                            <option value="stem" ${studentProfile.category === 'stem' ? 'selected' : ''}>STEM</option>
                            <option value="arts" ${studentProfile.category === 'arts' ? 'selected' : ''}>Arts & Humanities</option>
                            <option value="sports" ${studentProfile.category === 'sports' ? 'selected' : ''}>Sports</option>
                            <option value="minority" ${studentProfile.category === 'minority' ? 'selected' : ''}>Minority Groups</option>
                        </select>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="submit" class="btn btn-primary">Update Profile</button>
                        <button type="button" class="btn btn-secondary" id="cancelUpdate">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#cancelUpdate').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#updateProfileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Update student profile
            studentProfile.name = document.getElementById('updateName').value;
            studentProfile.email = document.getElementById('updateEmail').value;
            studentProfile.gpa = parseFloat(document.getElementById('updateGPA').value) || 0;
            studentProfile.major = document.getElementById('updateMajor').value;
            studentProfile.interests = document.getElementById('updateInterests').value.split(',').map(i => i.trim()).filter(i => i);
            studentProfile.incomeLevel = document.getElementById('updateIncome').value;
            studentProfile.category = document.getElementById('updateCategory').value;
            
            // Update in database (in a real app, this would update the user record)
            alert('Profile updated successfully! Your AI recommendations will be updated accordingly.');
            
            document.body.removeChild(modal);
            
            // Refresh recommendations
            loadAIRecommendations();
            
            // Update UI
            updateStudentUI({...currentStudent, ...studentProfile});
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        try {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        } catch (e) {
            return dateString;
        }
    }
    
    // Helper function to get category name
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
    
    // Initialize Student Dashboard
    function initDashboard() {
        // Load initial data
        loadScholarships();
        loadStudentApplications();
        loadAIRecommendations();
        updateDeadlines();
        updateApplicationStats();
        
        // Set up filter change listeners
        const categoryFilter = document.getElementById('categoryFilter');
        const sortBy = document.getElementById('sortBy');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', loadScholarships);
        }
        
        if (sortBy) {
            sortBy.addEventListener('change', loadScholarships);
        }
    }
    
    // Initialize when page loads
    initDashboard();
}