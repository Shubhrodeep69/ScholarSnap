// Student Portal Access Guard
document.addEventListener('DOMContentLoaded', () => {
    console.log('Student portal guard loading...');
    
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
        alert('Please login to access student portal');
        window.location.href = '../index.html';
        return;
    }
    
    if (currentUser.role !== 'student') {
        // User is not a student, redirect to main page
        alert('Access Denied: Student portal is only for students');
        window.ScholarshipApp.auth.logout();
        window.location.href = '../index.html';
        return;
    }
    
    // User is a valid student, update UI with their info
    console.log('Student access granted');
    updateStudentUI(currentUser);
});

function updateStudentUI(student) {
    // Update welcome message
    const welcomeElement = document.querySelector('.student-welcome');
    if (welcomeElement) {
        welcomeElement.textContent = `Welcome, ${student.name}`;
    }
    
    // Update profile in sidebar
    const profileName = document.querySelector('.student-profile h3');
    if (profileName) {
        profileName.textContent = student.name;
    }
    
    const profileMajor = document.querySelector('.student-profile p');
    if (profileMajor && student.major) {
        profileMajor.textContent = `${student.major} Major`;
    }
    
    // Update GPA in stats if available
    if (student.gpa) {
        const gpaElement = document.querySelector('.profile-stats .stat:nth-child(1) p');
        if (gpaElement) {
            gpaElement.textContent = student.gpa;
        }
    }
}

// Logout functionality for student portal
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