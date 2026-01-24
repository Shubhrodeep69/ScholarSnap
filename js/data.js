/**
 * SCHOLARSHIP DATA MODULE
 * Contains all scholarship information and data management functions
 * Created by: Member 2 - Data & Details
 */

// Scholarship Database
const scholarships = [
  {
    id: 1,
    name: "National Engineering Merit Scholarship",
    degree: "UG",
    minMarks: 80,
    incomeLimit: 400000,
    category: ["General", "OBC", "SC", "ST"],
    region: "India",
    amount: 80000,
    deadline: "2026-08-31",
    description: "Awarded to academically outstanding engineering students across India to support tuition fees and promote technical excellence.",
    provider: "Ministry of Education",
    website: "https://scholarships.gov.in",
    renewable: true,
    fields: ["Engineering"],
    documents: ["Marksheet", "Income Certificate", "Admission Proof"]
  },

  {
    id: 2,
    name: "Future Engineers Innovation Grant",
    degree: "UG",
    minMarks: 75,
    incomeLimit: 500000,
    category: ["All"],
    region: "India",
    amount: 120000,
    deadline: "2026-09-15",
    description: "Supports undergraduate engineering students working on innovative technology-based projects.",
    provider: "AICTE",
    website: "https://www.aicte-india.org/schemes/students-development-schemes",
    renewable: false,
    fields: ["Engineering"],
    documents: ["Project Proposal", "College ID"]
  },

  {
    id: 3,
    name: "National Medical Excellence Scholarship",
    degree: "UG",
    minMarks: 85,
    incomeLimit: 600000,
    category: ["General", "OBC", "SC", "ST"],
    region: "India",
    amount: 150000,
    deadline: "2026-08-20",
    description: "Provided to meritorious medical students to assist with tuition expenses.",
    provider: "Ministry of Health",
    website: "https://scholarships.gov.in",
    renewable: true,
    fields: ["Medical"],
    documents: ["NEET Scorecard", "Admission Proof"]
  },

  {
    id: 4,
    name: "Rural Medical Support Scholarship",
    degree: "UG",
    minMarks: 70,
    incomeLimit: 300000,
    category: ["SC", "ST", "OBC"],
    region: "India",
    amount: 100000,
    deadline: "2026-09-30",
    description: "Encourages students from rural backgrounds to pursue medical education.",
    provider: "National Health Mission",
    website: "https://nhm.gov.in",
    renewable: true,
    fields: ["Medical"],
    documents: ["NEET Score", "Income Certificate"]
  },

  {
    id: 5,
    name: "National Law Merit Scholarship",
    degree: "UG",
    minMarks: 75,
    incomeLimit: 450000,
    category: ["All"],
    region: "India",
    amount: 90000,
    deadline: "2026-10-10",
    description: "Supports law students demonstrating strong academic performance.",
    provider: "Bar Council of India",
    website: "https://www.barcouncilofindia.org",
    renewable: true,
    fields: ["Law"],
    documents: ["CLAT Scorecard", "Admission Proof"]
  },

  {
    id: 6,
    name: "Justice Leaders Fellowship",
    degree: "PG",
    minMarks: 70,
    incomeLimit: 600000,
    category: ["All"],
    region: "India",
    amount: 200000,
    deadline: "2026-11-15",
    description: "Leadership-focused fellowship for postgraduate law students.",
    provider: "Legal Services Authority",
    website: "https://nalsa.gov.in",
    renewable: false,
    fields: ["Law"],
    documents: ["Statement of Purpose", "Academic Records"]
  },

  {
    id: 7,
    name: "UGC Junior Research Fellowship",
    degree: "PhD",
    minMarks: 75,
    incomeLimit: 800000,
    category: ["All"],
    region: "India",
    amount: 360000,
    deadline: "2026-12-15",
    description: "Financial assistance to PhD scholars for advanced academic research.",
    provider: "University Grants Commission",
    website: "https://ugc.ac.in",
    renewable: true,
    fields: ["PhD/Research"],
    documents: ["Research Proposal", "NET Certificate"]
  },

  {
    id: 8,
    name: "DST Young Scientist Research Grant",
    degree: "PhD",
    minMarks: 70,
    incomeLimit: 900000,
    category: ["All"],
    region: "India",
    amount: 500000,
    deadline: "2026-11-30",
    description: "Research grant for young scientists working on innovative projects.",
    provider: "Department of Science & Technology",
    website: "https://dst.gov.in",
    renewable: false,
    fields: ["PhD/Research"],
    documents: ["Research Proposal", "Guide Consent"]
  },

  {
    id: 9,
    name: "National Honors Excellence Scholarship",
    degree: "UG",
    minMarks: 85,
    incomeLimit: 350000,
    category: ["All"],
    region: "India",
    amount: 75000,
    deadline: "2026-09-20",
    description: "Awarded to students enrolled in honors programs with outstanding academic records.",
    provider: "Ministry of Education",
    website: "https://education.gov.in",
    renewable: true,
    fields: ["Honors"],
    documents: ["Honors Admission Proof"]
  },

  {
    id: 10,
    name: "Academic Distinction Honors Grant",
    degree: "UG",
    minMarks: 90,
    incomeLimit: 500000,
    category: ["All"],
    region: "India",
    amount: 100000,
    deadline: "2026-10-05",
    description: "Recognizes top-performing honors students nationwide.",
    provider: "UGC",
    website: "https://ugc.ac.in",
    renewable: true,
    fields: ["Honors"],
    documents: ["Topper Certificate"]
  },

  {
    id: 11,
    name: "National Arts Talent Scholarship",
    degree: "UG",
    minMarks: 70,
    incomeLimit: 300000,
    category: ["All"],
    region: "India",
    amount: 60000,
    deadline: "2026-10-25",
    description: "Supports students pursuing visual, fine, and performing arts.",
    provider: "Ministry of Culture",
    website: "https://indiaculture.gov.in",
    renewable: true,
    fields: ["Arts"],
    documents: ["Portfolio", "Audition Certificate"]
  },

  {
    id: 12,
    name: "Fine Arts Creative Fellowship",
    degree: "PG",
    minMarks: 65,
    incomeLimit: 400000,
    category: ["All"],
    region: "India",
    amount: 120000,
    deadline: "2026-11-20",
    description: "Provides financial support for postgraduate creative projects.",
    provider: "Lalit Kala Akademi",
    website: "https://lalitkala.gov.in",
    renewable: false,
    fields: ["Arts"],
    documents: ["Portfolio", "Statement of Purpose"]
  },

  {
    id: 13,
    name: "National Science Scholars Program",
    degree: "UG",
    minMarks: 80,
    incomeLimit: 450000,
    category: ["All"],
    region: "India",
    amount: 90000,
    deadline: "2026-09-10",
    description: "Encourages excellence and innovation among science students.",
    provider: "DST",
    website: "https://dst.gov.in",
    renewable: true,
    fields: ["Science"],
    documents: ["Marksheet", "Admission Proof"]
  },

  {
    id: 14,
    name: "Women in Science Fellowship",
    degree: "PG",
    minMarks: 75,
    incomeLimit: 500000,
    category: ["Women"],
    region: "India",
    amount: 200000,
    deadline: "2026-11-10",
    description: "Promotes women participation in scientific research.",
    provider: "DST",
    website: "https://dst.gov.in",
    renewable: true,
    fields: ["Science"],
    documents: ["Research Plan"]
  },

  {
    id: 15,
    name: "Commerce Merit Scholarship",
    degree: "UG",
    minMarks: 75,
    incomeLimit: 400000,
    category: ["All"],
    region: "India",
    amount: 70000,
    deadline: "2026-08-25",
    description: "Supports commerce students pursuing finance, economics, and accounting.",
    provider: "ICAI",
    website: "https://www.icai.org",
    renewable: true,
    fields: ["Commerce"],
    documents: ["Marksheet"]
  },

  {
    id: 16,
    name: "Chartered Professionals Grant",
    degree: "PG",
    minMarks: 70,
    incomeLimit: 600000,
    category: ["All"],
    region: "India",
    amount: 150000,
    deadline: "2026-10-15",
    description: "Financial assistance for CA, CS, CMA professional students.",
    provider: "ICAI",
    website: "https://www.icai.org",
    renewable: false,
    fields: ["Commerce"],
    documents: ["Enrollment Proof"]
  },

  {
    id: 17,
    name: "National Management Merit Scholarship",
    degree: "PG",
    minMarks: 80,
    incomeLimit: 700000,
    category: ["All"],
    region: "India",
    amount: 180000,
    deadline: "2026-09-30",
    description: "Merit-based support for MBA and management students.",
    provider: "AICTE",
    website: "https://www.aicte-india.org",
    renewable: false,
    fields: ["Management"],
    documents: ["CAT/XAT Score"]
  },

  {
    id: 18,
    name: "Future Business Leaders Fellowship",
    degree: "PG",
    minMarks: 75,
    incomeLimit: 800000,
    category: ["All"],
    region: "India",
    amount: 250000,
    deadline: "2026-11-25",
    description: "Supports leadership, entrepreneurship, and business innovation.",
    provider: "AIMA",
    website: "https://www.aima.in",
    renewable: false,
    fields: ["Management"],
    documents: ["Statement of Purpose"]
  },

  {
    id: 19,
    name: "National Sports Talent Scholarship",
    degree: "UG",
    minMarks: 55,
    incomeLimit: 500000,
    category: ["All"],
    region: "India",
    amount: 120000,
    deadline: "2026-10-31",
    description: "Supports talented athletes balancing academics and sports training.",
    provider: "Sports Authority of India",
    website: "https://sportsauthorityofindia.nic.in",
    renewable: true,
    fields: ["Sports"],
    documents: ["Sports Certificates"]
  },

  {
    id: 20,
    name: "Olympic Preparation Athlete Grant",
    degree: "UG",
    minMarks: 50,
    incomeLimit: 700000,
    category: ["All"],
    region: "India",
    amount: 300000,
    deadline: "2026-12-01",
    description: "Elite training grant for national and international level athletes.",
    provider: "Ministry of Youth Affairs & Sports",
    website: "https://yas.nic.in",
    renewable: false,
    fields: ["Sports"],
    documents: ["Federation Certificate"]
  },

  {
    id: 21,
    name: "Integrated Science–Engineering Scholarship",
    degree: "UG",
    minMarks: 85,
    incomeLimit: 500000,
    category: ["All"],
    region: "India",
    amount: 110000,
    deadline: "2026-09-05",
    description: "Encourages interdisciplinary learning between science and engineering.",
    provider: "DST",
    website: "https://dst.gov.in",
    renewable: true,
    fields: ["Science", "Engineering"],
    documents: ["Marksheet"]
  },

  {
    id: 22,
    name: "Healthcare Research Scholars Grant",
    degree: "PhD",
    minMarks: 75,
    incomeLimit: 900000,
    category: ["All"],
    region: "India",
    amount: 450000,
    deadline: "2026-12-20",
    description: "Supports advanced medical and healthcare research projects.",
    provider: "ICMR",
    website: "https://www.icmr.gov.in",
    renewable: true,
    fields: ["Medical", "PhD/Research"],
    documents: ["Research Proposal"]
  },

  {
    id: 23,
    name: "Corporate Law Honors Fellowship",
    degree: "PG",
    minMarks: 80,
    incomeLimit: 700000,
    category: ["All"],
    region: "India",
    amount: 220000,
    deadline: "2026-11-18",
    description: "Advanced fellowship in corporate and commercial law studies.",
    provider: "NLU Consortium",
    website: "https://consortiumofnlus.ac.in",
    renewable: false,
    fields: ["Law", "Honors"],
    documents: ["Academic Records"]
  },

  {
    id: 24,
    name: "Arts & Culture Research Fellowship",
    degree: "PhD",
    minMarks: 70,
    incomeLimit: 600000,
    category: ["All"],
    region: "India",
    amount: 300000,
    deadline: "2026-12-10",
    description: "Supports doctoral research in Indian arts, culture, and heritage.",
    provider: "ICCR",
    website: "https://www.iccr.gov.in",
    renewable: true,
    fields: ["Arts", "PhD/Research"],
    documents: ["Research Synopsis"]
  },

  {
    id: 25,
    name: "Young Innovators Interdisciplinary Scholarship",
    degree: "UG",
    minMarks: 85,
    incomeLimit: 500000,
    category: ["All"],
    region: "India",
    amount: 140000,
    deadline: "2026-09-18",
    description: "Encourages innovation-driven students across engineering, science, and management disciplines.",
    provider: "NITI Aayog",
    website: "https://www.niti.gov.in",
    renewable: false,
    fields: ["Engineering", "Science", "Management"],
    documents: ["Innovation Proposal"]
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

// Add this to data.js after the regions object

// Available search categories
const searchCategories = {
    "engineering": ["Engineering", "Computer Science", "Technology", "IT", "Software", "Mechanical", "Civil", "Electrical", "Electronics"],
    "medical": ["Medicine", "Medical", "Dental", "Nursing", "Pharmacy", "Healthcare", "MBBS", "BDS"],
    "law": ["Law", "Legal Studies", "LLB", "LLM", "Judicial"],
    "phd": ["PhD", "Doctoral", "Research", "Postdoctoral"],
    "honors": ["Honors", "Excellence Program"],
    "arts": ["Arts", "Humanities", "Fine Arts", "Performing Arts", "Music", "Dance", "Theater"],
    "science": ["Science", "Physics", "Chemistry", "Biology", "Mathematics", "Biotechnology"],
    "commerce": ["Commerce", "Business", "Accountancy", "Economics", "Finance"],
    "management": ["Management", "MBA", "Business Administration", "Leadership"],
    "all": ["All Fields"],
    "research": ["Research", "Innovation", "Development"],
    "diploma": ["Diploma", "Certificate", "Vocational"],
    "sports": ["Sports", "Athletics", "Physical Education"],
    "girls": ["Girls Only", "Women Empowerment", "Female Education"]
};


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
