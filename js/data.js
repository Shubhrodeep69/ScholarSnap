/**
 * SCHOLARSHIP DATA MODULE
 * Contains all scholarship information and data management functions
 * Created by: Member 2 - Data & Details
 */

// Scholarship Database
const scholarships = [
    {
        id: 1,
        name: "National Merit Scholarship",
        degree: "UG",
        minMarks: 75,
        incomeLimit: 300000,
        category: ["General", "OBC"],
        region: "India",
        amount: 50000,
        deadline: "2024-08-15",
        description: "Awarded to meritorious undergraduate students across India. This scholarship recognizes academic excellence and provides financial support for tuition fees.",
        provider: "Ministry of Education, India",
        website: "https://scholarships.gov.in",
        renewable: true,
        fields: ["Engineering", "Medicine", "Science", "Arts", "Commerce"],
        documents: ["Marksheet", "Income Certificate", "Caste Certificate (if applicable)"]
    },
    {
        id: 2,
        name: "SC/ST Post-Matric Scholarship",
        degree: "UG",
        minMarks: 60,
        incomeLimit: 250000,
        category: ["SC", "ST"],
        region: "India",
        amount: 35000,
        deadline: "2024-09-30",
        description: "Government scholarship for SC/ST students pursuing undergraduate studies. Covers tuition fees and maintenance allowance.",
        provider: "Ministry of Social Justice and Empowerment",
        website: "https://socialjustice.gov.in",
        renewable: true,
        fields: ["All Fields"],
        documents: ["Caste Certificate", "Income Certificate", "Admission Proof"]
    },
    {
        id: 3,
        name: "Prime Minister's Scholarship Scheme",
        degree: "UG",
        minMarks: 80,
        incomeLimit: 600000,
        category: ["General", "OBC", "SC", "ST", "EWS"],
        region: "India",
        amount: 300000,
        deadline: "2024-07-20",
        description: "Prestigious scholarship for outstanding students with leadership potential. Includes mentorship opportunities.",
        provider: "Prime Minister's Office",
        website: "https://pmss.gov.in",
        renewable: true,
        fields: ["Engineering", "Medicine", "Law", "Management"],
        documents: ["Marksheet", "Income Proof", "Recommendation Letters"]
    },
    {
        id: 4,
        name: "Girl Child Education Scholarship",
        degree: "High School",
        minMarks: 70,
        incomeLimit: 150000,
        category: ["General", "OBC", "SC", "ST", "Minority"],
        region: "India",
        amount: 20000,
        deadline: "2024-10-10",
        description: "Special scholarship for girl students to promote female education and empowerment.",
        provider: "National Commission for Women",
        website: "https://ncw.nic.in",
        renewable: true,
        fields: ["All Fields"],
        documents: ["Birth Certificate", "School ID", "Income Certificate"]
    },
    {
        id: 5,
        name: "Minority Scholarship",
        degree: "PG",
        minMarks: 65,
        incomeLimit: 200000,
        category: ["Minority"],
        region: "India",
        amount: 75000,
        deadline: "2024-08-31",
        description: "For students belonging to minority communities pursuing postgraduate studies.",
        provider: "Ministry of Minority Affairs",
        website: "https://minorityaffairs.gov.in",
        renewable: true,
        fields: ["All Fields"],
        documents: ["Minority Community Certificate", "PG Admission Proof"]
    },
    {
        id: 6,
        name: "Sports Excellence Scholarship",
        degree: "UG",
        minMarks: 55,
        incomeLimit: 500000,
        category: ["General", "OBC", "SC", "ST"],
        region: "India",
        amount: 100000,
        deadline: "2024-11-15",
        description: "For students who have represented state/national level in sports. Academic requirements are relaxed.",
        provider: "Sports Authority of India",
        website: "https://sportsauthorityofindia.nic.in",
        renewable: false,
        fields: ["All Fields"],
        documents: ["Sports Certificates", "Medical Certificate", "Marksheet"]
    },
    {
        id: 7,
        name: "North-East Region Scholarship",
        degree: "UG",
        minMarks: 60,
        incomeLimit: 400000,
        category: ["General", "OBC", "SC", "ST"],
        region: "North India",
        amount: 45000,
        deadline: "2024-09-15",
        description: "Special scholarship for students from North-Eastern states of India.",
        provider: "Ministry of Development of North Eastern Region",
        website: "https://mdoner.gov.in",
        renewable: true,
        fields: ["All Fields"],
        documents: ["Domicile Certificate", "Admission Proof"]
    },
    {
        id: 8,
        name: "PhD Research Fellowship",
        degree: "PhD",
        minMarks: 75,
        incomeLimit: 800000,
        category: ["General", "OBC", "SC", "ST"],
        region: "India",
        amount: 250000,
        deadline: "2024-12-01",
        description: "For PhD candidates engaged in innovative research. Includes research grant.",
        provider: "University Grants Commission",
        website: "https://ugc.ac.in",
        renewable: true,
        fields: ["Science", "Technology", "Social Sciences", "Humanities"],
        documents: ["Research Proposal", "MPhil/Masters Marksheet", "Recommendations"]
    },
    {
        id: 9,
        name: "International Student Scholarship",
        degree: "UG",
        minMarks: 85,
        incomeLimit: 1000000,
        category: ["General"],
        region: "International",
        amount: 500000,
        deadline: "2024-07-31",
        description: "For Indian students seeking undergraduate education abroad. Covers partial tuition fees.",
        provider: "Ministry of External Affairs",
        website: "https://mea.gov.in",
        renewable: false,
        fields: ["Engineering", "Medicine", "Business", "Liberal Arts"],
        documents: ["Passport", "University Admission Letter", "Financial Statements"]
    },
    {
        id: 10,
        name: "Entrepreneurship Scholarship",
        degree: "PG",
        minMarks: 70,
        incomeLimit: 300000,
        category: ["General", "OBC", "SC", "ST"],
        region: "India",
        amount: 150000,
        deadline: "2024-10-30",
        description: "For students with entrepreneurial mindset. Includes incubation support.",
        provider: "Startup India",
        website: "https://startupindia.gov.in",
        renewable: false,
        fields: ["Business", "Technology", "Social Entrepreneurship"],
        documents: ["Business Plan", "Academic Records", "Recommendation Letters"]
    }
];

// Scholarship Categories
const categories = {
    "General": "General Category",
    "SC": "Scheduled Caste",
    "ST": "Scheduled Tribe",
    "OBC": "Other Backward Class",
    "EWS": "Economically Weaker Section",
    "Minority": "Religious Minority"
};

// Education Levels
const educationLevels = {
    "High School": "10th/12th Standard",
    "UG": "Undergraduate (Bachelor's)",
    "PG": "Postgraduate (Master's)",
    "PhD": "Doctoral/PhD",
    "Diploma": "Diploma/Certificate"
};

// Regions
const regions = {
    "India": "All India",
    "North India": "Northern States",
    "South India": "Southern States",
    "East India": "Eastern States",
    "West India": "Western States",
    "International": "Outside India"
};

/**
 * Get all scholarships
 * @returns {Array} Complete scholarship database
 */
function getAllScholarships() {
    return scholarships;
}

/**
 * Get scholarship by ID
 * @param {number} id - Scholarship ID
 * @returns {Object|null} Scholarship object or null if not found
 */
function getScholarshipById(id) {
    return scholarships.find(scholarship => scholarship.id === id) || null;
}

/**
 * Get scholarships by education level
 * @param {string} degree - Education level
 * @returns {Array} Filtered scholarships
 */
function getScholarshipsByDegree(degree) {
    return scholarships.filter(scholarship => scholarship.degree === degree);
}

/**
 * Get scholarships by category
 * @param {string} category - Student category
 * @returns {Array} Filtered scholarships
 */
function getScholarshipsByCategory(category) {
    return scholarships.filter(scholarship => 
        scholarship.category.includes(category)
    );
}

/**
 * Get scholarships by region
 * @param {string} region - Student region
 * @returns {Array} Filtered scholarships
 */
function getScholarshipsByRegion(region) {
    if (region === "India") {
        return scholarships.filter(scholarship => 
            scholarship.region === "India" || scholarship.region === "All India"
        );
    }
    return scholarships.filter(scholarship => 
        scholarship.region === region || scholarship.region === "India"
    );
}

/**
 * Get scholarship card HTML template
 * @param {Object} scholarship - Scholarship object
 * @param {number} matchScore - Match percentage
 * @param {string} explanation - AI explanation
 * @returns {string} HTML string for scholarship card
 */
function getScholarshipCardHTML(scholarship, matchScore, explanation) {
    const deadline = new Date(scholarship.deadline);
    const now = new Date();
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    
    let deadlineClass = "deadline";
    if (daysLeft < 30) deadlineClass += " urgent";
    if (daysLeft < 7) deadlineClass += " very-urgent";
    
    return `
        <div class="scholarship-card" data-id="${scholarship.id}">
            <div class="scholarship-header">
                <div class="scholarship-name">${scholarship.name}</div>
                <div class="match-badge">${matchScore}% Match</div>
            </div>
            
            <div class="scholarship-details">
                <div class="detail-item">
                    <span class="detail-label">Amount</span>
                    <span class="detail-value amount">₹${scholarship.amount.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Education Level</span>
                    <span class="detail-value">${educationLevels[scholarship.degree] || scholarship.degree}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Minimum Marks</span>
                    <span class="detail-value">${scholarship.minMarks}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Income Limit</span>
                    <span class="detail-value">₹${scholarship.incomeLimit.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Deadline</span>
                    <span class="detail-value ${deadlineClass}">
                        ${deadline.toLocaleDateString()} (${daysLeft} days left)
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Provider</span>
                    <span class="detail-value">${scholarship.provider}</span>
                </div>
            </div>
            
            <div class="scholarship-footer">
                <div class="explanation">
                    <i class="fas fa-lightbulb"></i> ${explanation}
                </div>
                <div class="action-buttons">
                    <button class="btn btn-small view-details" data-id="${scholarship.id}">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    <button class="btn btn-small save-scholarship" data-id="${scholarship.id}">
                        <i class="far fa-bookmark"></i> Save
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Get detailed view HTML for modal
 * @param {Object} scholarship - Scholarship object
 * @param {number} matchScore - Match percentage
 * @returns {string} HTML string for detailed view
 */
function getScholarshipDetailsHTML(scholarship, matchScore) {
    const deadline = new Date(scholarship.deadline);
    const now = new Date();
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    
    const categoryList = scholarship.category.map(cat => 
        `<span class="category-tag">${categories[cat] || cat}</span>`
    ).join('');
    
    const fieldList = scholarship.fields.map(field => 
        `<span class="field-tag">${field}</span>`
    ).join('');
    
    const docList = scholarship.documents.map(doc => 
        `<li><i class="fas fa-file-alt"></i> ${doc}</li>`
    ).join('');
    
    return `
        <div class="scholarship-detail">
            <div class="detail-header">
                <div class="match-score-large">
                    <div class="score-circle">${matchScore}%</div>
                    <div class="score-label">Match Score</div>
                </div>
                <div class="scholarship-info">
                    <h4>${scholarship.name}</h4>
                    <p class="provider">By ${scholarship.provider}</p>
                </div>
            </div>
            
            <div class="detail-section">
                <h5><i class="fas fa-info-circle"></i> Description</h5>
                <p>${scholarship.description}</p>
            </div>
            
            <div class="detail-grid">
                <div class="detail-item">
                    <i class="fas fa-graduation-cap"></i>
                    <div>
                        <div class="label">Education Level</div>
                        <div class="value">${educationLevels[scholarship.degree] || scholarship.degree}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-chart-line"></i>
                    <div>
                        <div class="label">Minimum Marks</div>
                        <div class="value">${scholarship.minMarks}%</div>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-rupee-sign"></i>
                    <div>
                        <div class="label">Income Limit</div>
                        <div class="value">₹${scholarship.incomeLimit.toLocaleString()}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-award"></i>
                    <div>
                        <div class="label">Scholarship Amount</div>
                        <div class="value amount-large">₹${scholarship.amount.toLocaleString()}</div>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-calendar-alt"></i>
                    <div>
                        <div class="label">Deadline</div>
                        <div class="value ${daysLeft < 30 ? 'urgent' : ''}">
                            ${deadline.toLocaleDateString()} (${daysLeft} days left)
                        </div>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-globe"></i>
                    <div>
                        <div class="label">Region</div>
                        <div class="value">${regions[scholarship.region] || scholarship.region}</div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h5><i class="fas fa-tags"></i> Eligibility Categories</h5>
                <div class="tags-container">
                    ${categoryList}
                </div>
            </div>
            
            <div class="detail-section">
                <h5><i class="fas fa-book"></i> Eligible Fields</h5>
                <div class="tags-container">
                    ${fieldList}
                </div>
            </div>
            
            <div class="detail-section">
                <h5><i class="fas fa-file-signature"></i> Required Documents</h5>
                <ul class="documents-list">
                    ${docList}
                </ul>
            </div>
            
            <div class="detail-section">
                <h5><i class="fas fa-external-link-alt"></i> Application</h5>
                <p>Apply directly on the official website:</p>
                <a href="${scholarship.website}" target="_blank" class="btn btn-small">
                    <i class="fas fa-external-link-alt"></i> Visit Website
                </a>
                ${scholarship.renewable ? 
                    '<p class="renewable-info"><i class="fas fa-sync-alt"></i> This scholarship is renewable annually</p>' : 
                    '<p class="non-renewable"><i class="fas fa-exclamation-circle"></i> One-time scholarship (non-renewable)</p>'
                }
            </div>
        </div>
    `;
}

// Export functions for use in other modules
window.scholarshipData = {
    getAllScholarships,
    getScholarshipById,
    getScholarshipsByDegree,
    getScholarshipsByCategory,
    getScholarshipsByRegion,
    getScholarshipCardHTML,
    getScholarshipDetailsHTML,
    categories,
    educationLevels,
    regions
};