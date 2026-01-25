// Admin Portal Access Guard
document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin portal guard loading...');
    
    // Check if ScholarshipApp is available
    if (!window.ScholarshipApp || !window.ScholarshipApp.auth) {
        console.error('ScholarshipApp not loaded');
        window.location.href = '../index.html';
        return;
    }
    
    const currentUser = window.ScholarshipApp.auth.getCurrentUser();
    console.log('Current user:', currentUser);
    
    if (!currentUser) {
        // No user logged in, redirect to main page
        alert('Please login to access admin portal');
        window.location.href = '../index.html';
        return;
    }
    
    if (currentUser.role !== 'admin') {
        // User is not an admin, redirect to main page
        alert('Access Denied: Admin portal is only for scholarship administrators');
        window.ScholarshipApp.auth.logout();
        window.location.href = '../index.html';
        return;
    }
    
    // User is a valid admin, update UI with their info
    console.log('Admin access granted');
    updateAdminUI(currentUser);
});

function updateAdminUI(admin) {
    // Update welcome message
    const welcomeElement = document.querySelector('.admin-welcome');
    if (welcomeElement) {
        welcomeElement.textContent = `Welcome, ${admin.name} (${admin.organization})`;
    }
    
    // Update profile in sidebar
    const profileName = document.querySelector('.admin-profile h3');
    if (profileName) {
        profileName.textContent = admin.name;
    }
    
    const profileOrg = document.querySelector('.admin-profile p');
    if (profileOrg) {
        profileOrg.textContent = admin.organization;
    }
    
    // Update scholarship form with admin's organization
    const providerField = document.getElementById('provider');
    if (providerField) {
        providerField.value = admin.organization;
    }
}

// Logout functionality for admin portal
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                window.ScholarshipApp?.auth?.logout();
                window.location.href = '../index.html';
            }
        });
    }
});