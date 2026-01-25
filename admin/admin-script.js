// Secure Admin Portal JavaScript - FIXED VERSION

// Check if user is a valid admin
document.addEventListener('DOMContentLoaded', () => {
    // Access control is handled by portal-guard.js
    // This script runs only after portal-guard confirms user is an admin
    
    const currentAdmin = window.ScholarshipApp?.auth?.getCurrentUser();
    const db = window.ScholarshipApp?.db;
    
    if (!currentAdmin || !db) {
        console.error('Admin portal initialization failed');
        return;
    }
    
    // Initialize admin portal
    initAdminPortal(currentAdmin, db);
});

function initAdminPortal(currentAdmin, db) {
    // DOM Elements
    const logoutBtn = document.getElementById('logoutBtn');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const contentSections = document.querySelectorAll('.content-section');
    const scholarshipForm = document.getElementById('scholarshipForm');
    const scholarshipsTable = document.querySelector('#scholarshipsTable tbody');
    const applicationsContainer = document.querySelector('.applications-container');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmActionBtn = document.getElementById('confirmAction');
    const cancelActionBtn = document.getElementById('cancelAction');
    
    // Admin data
    let adminScholarships = db.getScholarships(currentAdmin.id);
    let adminApplications = db.getApplications(currentAdmin.id);
    
    // Sidebar Navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get the target section
            const targetSection = link.getAttribute('data-section');
            
            // Hide all sections
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            document.getElementById(targetSection).classList.add('active');
            
            // Refresh data based on section
            if (targetSection === 'applications') {
                loadApplications();
            } else if (targetSection === 'manage-scholarships') {
                loadScholarshipsTable();
            } else if (targetSection === 'statistics') {
                loadCharts();
            }
        });
    });
    
    // Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                window.ScholarshipApp?.auth?.logout();
                window.location.href = '../index.html';
            }
        });
    }
    
    // Handle Scholarship Form Submission
    if (scholarshipForm) {
        scholarshipForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('scholarshipName').value;
            const amount = document.getElementById('amount').value;
            const deadline = document.getElementById('deadline').value;
            const description = document.getElementById('description').value;
            const eligibility = document.getElementById('eligibility').value;
            const category = document.getElementById('category').value;
            const maxApplicants = document.getElementById('maxApplicants').value;
            
            // Validate form
            if (!name || !amount || !deadline || !description || !eligibility || !category) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Check if editing existing scholarship
            const editingId = scholarshipForm.dataset.editingId;
            
            if (editingId) {
                // Update existing scholarship
                const updates = {
                    name,
                    amount,
                    deadline,
                    description,
                    eligibility,
                    category,
                    maxApplicants: maxApplicants || null
                };
                
                const updated = db.updateScholarship(parseInt(editingId), updates);
                
                if (updated) {
                    // Refresh local data
                    adminScholarships = db.getScholarships(currentAdmin.id);
                    
                    // Reset form
                    scholarshipForm.reset();
                    delete scholarshipForm.dataset.editingId;
                    
                    // Set default deadline
                    const defaultDeadline = new Date();
                    defaultDeadline.setDate(defaultDeadline.getDate() + 30);
                    document.getElementById('deadline').valueAsDate = defaultDeadline;
                    
                    // Update provider field
                    document.getElementById('provider').value = currentAdmin.organization;
                    
                    // Change button back to "Create Scholarship"
                    const submitBtn = scholarshipForm.querySelector('button[type="submit"]');
                    submitBtn.textContent = 'Create Scholarship';
                    
                    // Remove the editing submit handler
                    scholarshipForm.removeEventListener('submit', arguments.callee);
                    scholarshipForm.addEventListener('submit', arguments.callee);
                    
                    alert('Scholarship updated successfully!');
                    
                    // Switch to manage scholarships section
                    document.querySelector('[data-section="manage-scholarships"]').click();
                } else {
                    alert('Failed to update scholarship.');
                }
            } else {
                // Create new scholarship object
                const newScholarship = {
                    name,
                    provider: currentAdmin.organization,
                    amount,
                    deadline,
                    description,
                    eligibility,
                    category,
                    maxApplicants: maxApplicants || null,
                    status: "active",
                    adminId: currentAdmin.id
                };
                
                // Add to database
                try {
                    const createdScholarship = db.createScholarship(newScholarship);
                    
                    // Refresh local data
                    adminScholarships = db.getScholarships(currentAdmin.id);
                    
                    // Reset form
                    scholarshipForm.reset();
                    
                    // Set default deadline to 30 days from now
                    const defaultDeadline = new Date();
                    defaultDeadline.setDate(defaultDeadline.getDate() + 30);
                    document.getElementById('deadline').valueAsDate = defaultDeadline;
                    
                    // Show success message
                    alert('Scholarship created successfully!');
                    
                    // Switch to manage scholarships section
                    document.querySelector('[data-section="manage-scholarships"]').click();
                    
                } catch (error) {
                    alert('Error creating scholarship: ' + error.message);
                }
            }
        });
    }
    
    // Load Scholarships Table
    function loadScholarshipsTable() {
        if (!scholarshipsTable) return;
        
        scholarshipsTable.innerHTML = '';
        
        // Refresh scholarships list
        adminScholarships = db.getScholarships(currentAdmin.id);
        
        if (adminScholarships.length === 0) {
            scholarshipsTable.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px;">
                        <p>You haven't created any scholarships yet.</p>
                        <button class="btn btn-primary" onclick="document.querySelector('[data-section=\\'add-scholarship\\']').click()">
                            Create Your First Scholarship
                        </button>
                    </td>
                </tr>
            `;
            return;
        }
        
        adminScholarships.forEach(scholarship => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${scholarship.name}</td>
                <td>${scholarship.amount}</td>
                <td>${formatDate(scholarship.deadline)}</td>
                <td>${scholarship.applications || 0}</td>
                <td><span class="status-badge status-${scholarship.status}">${scholarship.status === 'active' ? 'Active' : 'Closed'}</span></td>
                <td class="table-actions">
                    <button class="action-btn edit-btn" data-id="${scholarship.id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${scholarship.id}">Delete</button>
                </td>
            `;
            
            scholarshipsTable.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                editScholarship(id);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                showDeleteConfirmation(id);
            });
        });
    }
    
    // Edit Scholarship
    function editScholarship(id) {
        const scholarship = adminScholarships.find(s => s.id === id);
        if (!scholarship) return;
        
        // Verify admin owns this scholarship
        if (scholarship.adminId !== currentAdmin.id) {
            alert('You do not have permission to edit this scholarship.');
            return;
        }
        
        // Fill form with scholarship data
        document.getElementById('scholarshipName').value = scholarship.name;
        document.getElementById('amount').value = scholarship.amount;
        document.getElementById('deadline').value = scholarship.deadline;
        document.getElementById('description').value = scholarship.description;
        document.getElementById('eligibility').value = scholarship.eligibility;
        document.getElementById('category').value = scholarship.category;
        document.getElementById('maxApplicants').value = scholarship.maxApplicants || '';
        
        // Mark form as editing
        scholarshipForm.dataset.editingId = id;
        
        // Change button text
        const submitBtn = scholarshipForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Scholarship';
        
        // Switch to add scholarship section
        document.querySelector('[data-section="add-scholarship"]').click();
    }
    
    // Show Delete Confirmation
    let scholarshipToDelete = null;
    
    function showDeleteConfirmation(id) {
        const scholarship = adminScholarships.find(s => s.id === id);
        
        // Verify admin owns this scholarship
        if (!scholarship || scholarship.adminId !== currentAdmin.id) {
            alert('You do not have permission to delete this scholarship.');
            return;
        }
        
        scholarshipToDelete = id;
        document.getElementById('modalTitle').textContent = 'Delete Scholarship';
        document.getElementById('modalMessage').textContent = `Are you sure you want to delete "${scholarship.name}"? This action cannot be undone. All applications for this scholarship will also be deleted.`;
        confirmationModal.style.display = 'block';
    }
    
    // Handle Confirmation Modal Actions
    if (confirmActionBtn && cancelActionBtn) {
        confirmActionBtn.addEventListener('click', () => {
            if (scholarshipToDelete) {
                // Delete scholarship
                const success = db.deleteScholarship(scholarshipToDelete, currentAdmin.id);
                
                if (success) {
                    // Refresh local data
                    adminScholarships = db.getScholarships(currentAdmin.id);
                    adminApplications = db.getApplications(currentAdmin.id);
                    
                    // Refresh UI
                    loadScholarshipsTable();
                    loadApplications();
                    updateDashboardStats();
                    
                    alert('Scholarship deleted successfully!');
                } else {
                    alert('Failed to delete scholarship. You may not have permission.');
                }
                
                scholarshipToDelete = null;
            }
            
            confirmationModal.style.display = 'none';
        });
        
        cancelActionBtn.addEventListener('click', () => {
            scholarshipToDelete = null;
            confirmationModal.style.display = 'none';
        });
    }
    
    // Load Applications - FIXED VERSION
    function loadApplications() {
        if (!applicationsContainer) return;
        
        applicationsContainer.innerHTML = '';
        
        // Refresh applications list
        adminApplications = db.getApplications(currentAdmin.id);
        
        if (adminApplications.length === 0) {
            applicationsContainer.innerHTML = `
                <div class="no-applications">
                    <p>No applications received yet for your scholarships.</p>
                    <p>Students will see your scholarships once you create them.</p>
                </div>
            `;
            return;
        }
        
        // Sort by application date (newest first)
        adminApplications.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
        
        adminApplications.forEach(app => {
            const scholarship = db.getScholarshipById(app.scholarshipId);
            if (!scholarship) return;
            
            const card = document.createElement('div');
            card.className = 'application-card';
            
            card.innerHTML = `
                <div class="application-header">
                    <div class="applicant-info">
                        <h4>${app.applicantName}</h4>
                        <p>${app.email}</p>
                        <p><strong>Applied for:</strong> ${scholarship.name}</p>
                        <p><strong>Applied on:</strong> ${formatDate(app.appliedDate)}</p>
                    </div>
                    <span class="application-status status-${app.status}-badge">${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span>
                </div>
                <div class="application-details">
                    <p><strong>GPA:</strong> ${app.gpa}</p>
                    <p><strong>Major:</strong> ${app.major}</p>
                    <p><strong>Essay Excerpt:</strong> ${app.essay ? app.essay.substring(0, 150) + '...' : 'No essay provided'}</p>
                </div>
                <div class="application-actions">
                    ${app.status === 'pending' ? `
                        <button class="btn btn-primary approve-btn" data-id="${app.id}">Approve</button>
                        <button class="btn btn-secondary reject-btn" data-id="${app.id}">Reject</button>
                    ` : ''}
                    <button class="btn btn-secondary view-btn" data-id="${app.id}">View Details</button>
                    ${app.status !== 'pending' && app.reviewedDate ? `
                        <span class="reviewed-info">Reviewed on: ${formatDate(app.reviewedDate)}</span>
                    ` : ''}
                </div>
            `;
            
            applicationsContainer.appendChild(card);
        });
        
        // Add event listeners to action buttons - FIXED
        setTimeout(() => {
            document.querySelectorAll('.approve-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(btn.getAttribute('data-id'));
                    console.log('Approve clicked for application ID:', id);
                    updateApplicationStatus(id, 'approved');
                });
            });
            
            document.querySelectorAll('.reject-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(btn.getAttribute('data-id'));
                    console.log('Reject clicked for application ID:', id);
                    updateApplicationStatus(id, 'rejected');
                });
            });
            
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(btn.getAttribute('data-id'));
                    viewApplicationDetails(id);
                });
            });
        }, 100);
    }
    
    // Update Application Status - FIXED VERSION
    function updateApplicationStatus(id, status) {
        console.log('Updating application', id, 'to status:', status);
        
        const result = db.updateApplicationStatus(id, status, currentAdmin.id);
        
        if (result) {
            console.log('Application updated successfully');
            // Refresh local data
            adminApplications = db.getApplications(currentAdmin.id);
            
            // Refresh UI
            loadApplications();
            updateDashboardStats();
            
            alert(`Application ${status} successfully!`);
        } else {
            console.log('Failed to update application');
            alert('Failed to update application. You may not have permission or the application may not exist.');
        }
    }
    
    // View Application Details
    function viewApplicationDetails(id) {
        const application = adminApplications.find(app => app.id === id);
        if (!application) {
            alert('Application not found');
            return;
        }
        
        const scholarship = db.getScholarshipById(application.scholarshipId);
        
        // Create modal for application details
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <span class="close-modal" style="float: right; cursor: pointer; font-size: 24px;">&times;</span>
                <h3>Application Details</h3>
                <div class="application-details-modal">
                    <div class="detail-section">
                        <h4>Applicant Information</h4>
                        <p><strong>Name:</strong> ${application.applicantName}</p>
                        <p><strong>Email:</strong> ${application.email}</p>
                        <p><strong>GPA:</strong> ${application.gpa}</p>
                        <p><strong>Major:</strong> ${application.major}</p>
                        <p><strong>Applied on:</strong> ${formatDate(application.appliedDate)}</p>
                        <p><strong>Status:</strong> <span class="status-${application.status}-badge" style="padding: 3px 8px; border-radius: 3px;">${application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span></p>
                        ${application.reviewedDate ? `<p><strong>Reviewed on:</strong> ${formatDate(application.reviewedDate)}</p>` : ''}
                    </div>
                    
                    <div class="detail-section">
                        <h4>Scholarship Information</h4>
                        <p><strong>Scholarship:</strong> ${scholarship?.name || 'N/A'}</p>
                        <p><strong>Provider:</strong> ${scholarship?.provider || 'N/A'}</p>
                        <p><strong>Amount:</strong> ${scholarship?.amount || 'N/A'}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Personal Essay</h4>
                        <div class="essay-content" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; max-height: 300px; overflow-y: auto;">
                            ${application.essay || 'No essay provided'}
                        </div>
                    </div>
                </div>
                <div class="modal-actions" style="margin-top: 20px;">
                    ${application.status === 'pending' ? `
                        <button class="btn btn-primary" id="approveFromModal">Approve</button>
                        <button class="btn btn-secondary" id="rejectFromModal">Reject</button>
                    ` : ''}
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
        
        if (application.status === 'pending') {
            modal.querySelector('#approveFromModal').addEventListener('click', () => {
                document.body.removeChild(modal);
                updateApplicationStatus(id, 'approved');
            });
            
            modal.querySelector('#rejectFromModal').addEventListener('click', () => {
                document.body.removeChild(modal);
                updateApplicationStatus(id, 'rejected');
            });
        }
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // Update Dashboard Statistics
    function updateDashboardStats() {
        const stats = db.getStatistics(currentAdmin.id);
        
        document.getElementById('activeScholarships').textContent = stats.activeScholarships;
        document.getElementById('totalApplications').textContent = stats.totalApplications;
        document.getElementById('pendingReviews').textContent = stats.pendingApplications;
        document.getElementById('awardedScholarships').textContent = stats.approvedApplications;
        
        // Update recent activity
        updateRecentActivity();
    }
    
    // Update Recent Activity
    function updateRecentActivity() {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;
        
        activityList.innerHTML = '';
        
        // Get recent applications (last 5)
        const recentApplications = [...adminApplications]
            .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
            .slice(0, 5);
        
        if (recentApplications.length === 0) {
            activityList.innerHTML = '<p class="no-activity">No recent activity</p>';
            return;
        }
        
        recentApplications.forEach(app => {
            const scholarship = db.getScholarshipById(app.scholarshipId);
            if (!scholarship) return;
            
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            activityItem.innerHTML = `
                <div class="activity-info">
                    <h4>${app.applicantName}</h4>
                    <p>Applied for ${scholarship.name}</p>
                    <p class="activity-status status-${app.status}">Status: ${app.status}</p>
                </div>
                <div class="activity-date">${formatDate(app.appliedDate)}</div>
            `;
            
            activityList.appendChild(activityItem);
        });
    }
    
    // Load Charts
    function loadCharts() {
        // Applications by Status Chart
        const statusCtx = document.getElementById('statusChart');
        if (statusCtx) {
            const statusCounts = {
                pending: adminApplications.filter(app => app.status === 'pending').length,
                approved: adminApplications.filter(app => app.status === 'approved').length,
                rejected: adminApplications.filter(app => app.status === 'rejected').length
            };
            
            // Clear previous chart if exists
            if (statusCtx.chart) {
                statusCtx.chart.destroy();
            }
            
            statusCtx.chart = new Chart(statusCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Pending', 'Approved', 'Rejected'],
                    datasets: [{
                        data: [statusCounts.pending, statusCounts.approved, statusCounts.rejected],
                        backgroundColor: ['#f39c12', '#27ae60', '#e74c3c'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
        
        // Scholarship Popularity Chart
        const popularityCtx = document.getElementById('popularityChart');
        if (popularityCtx && adminScholarships.length > 0) {
            const scholarshipNames = adminScholarships.map(s => 
                s.name.length > 15 ? s.name.substring(0, 15) + '...' : s.name
            );
            const applicationCounts = adminScholarships.map(s => s.applications || 0);
            
            // Clear previous chart if exists
            if (popularityCtx.chart) {
                popularityCtx.chart.destroy();
            }
            
            popularityCtx.chart = new Chart(popularityCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: scholarshipNames,
                    datasets: [{
                        label: 'Number of Applications',
                        data: applicationCounts,
                        backgroundColor: '#3498db',
                        borderColor: '#2980b9',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
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
    
    // Initialize Admin Dashboard
    function initDashboard() {
        // Update scholarship form with admin's organization
        const providerField = document.getElementById('provider');
        if (providerField) {
            providerField.value = currentAdmin.organization;
        }
        
        // Set default deadline to 30 days from now
        const defaultDeadline = new Date();
        defaultDeadline.setDate(defaultDeadline.getDate() + 30);
        const deadlineField = document.getElementById('deadline');
        if (deadlineField) {
            deadlineField.valueAsDate = defaultDeadline;
        }
        
        // Load initial data
        updateDashboardStats();
        loadScholarshipsTable();
        loadApplications();
        loadCharts();
    }
    
    // Initialize when page loads
    initDashboard();
}