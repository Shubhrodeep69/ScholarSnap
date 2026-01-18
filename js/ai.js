/**
 * AI MATCHING MODULE
 * Contains intelligent matching algorithms and explanation generation
 * Created by: Member 3 - AI Matching
 */

/**
 * Student Profile Class
 */
class StudentProfile {
    constructor(data) {
        this.educationLevel = data.educationLevel;
        this.marks = parseInt(data.marks);
        this.category = data.category;
        this.income = parseInt(data.income);
        this.region = data.region;
        this.interests = data.interests ? 
            data.interests.split(',').map(i => i.trim()) : [];
    }

    validate() {
        const errors = [];
        
        if (!this.educationLevel) errors.push("Education level is required");
        if (isNaN(this.marks) || this.marks < 0 || this.marks > 100) 
            errors.push("Marks must be between 0 and 100");
        if (!this.category) errors.push("Category is required");
        if (isNaN(this.income) || this.income < 0) 
            errors.push("Income must be a positive number");
        if (!this.region) errors.push("Region is required");
        
        return errors;
    }
}

/**
 * Main matching function
 * @param {StudentProfile} student - Student profile
 * @param {Array} scholarships - Scholarship database
 * @returns {Array} Sorted scholarships with match scores and explanations
 */
function findMatchingScholarships(student, scholarships) {
    if (!student || !scholarships) return [];
    
    const matches = scholarships.map(scholarship => {
        const matchResult = calculateMatch(student, scholarship);
        return {
            ...scholarship,
            matchScore: matchResult.score,
            explanation: matchResult.explanation,
            matchDetails: matchResult.details
        };
    });
    
    // Filter out scholarships with 0% match
    const validMatches = matches.filter(match => match.matchScore > 0);
    
    // Sort by match score (descending)
    validMatches.sort((a, b) => b.matchScore - a.matchScore);
    
    return validMatches;
}

/**
 * Calculate match score between student and scholarship
 * @param {StudentProfile} student - Student profile
 * @param {Object} scholarship - Scholarship object
 * @returns {Object} Match result with score and explanation
 */
function calculateMatch(student, scholarship) {
    let score = 0;
    let details = [];
    let positiveFactors = [];
    let negativeFactors = [];
    
    // 1. Education Level Match (20 points)
    if (student.educationLevel === scholarship.degree) {
        score += 20;
        details.push({ factor: "Education Level", score: 20, matched: true });
        positiveFactors.push("Your education level matches perfectly");
    } else {
        details.push({ factor: "Education Level", score: 0, matched: false });
        negativeFactors.push("Education level doesn't match");
    }
    
    // 2. Marks Match (30 points)
    const marksMatch = calculateMarksMatch(student.marks, scholarship.minMarks);
    score += marksMatch.score;
    details.push({ factor: "Academic Marks", score: marksMatch.score, matched: marksMatch.score > 0 });
    if (marksMatch.score > 0) {
        positiveFactors.push(marksMatch.message);
    } else {
        negativeFactors.push(marksMatch.message);
    }
    
    // 3. Income Match (30 points)
    const incomeMatch = calculateIncomeMatch(student.income, scholarship.incomeLimit);
    score += incomeMatch.score;
    details.push({ factor: "Income", score: incomeMatch.score, matched: incomeMatch.score > 0 });
    if (incomeMatch.score > 0) {
        positiveFactors.push(incomeMatch.message);
    } else {
        negativeFactors.push(incomeMatch.message);
    }
    
    // 4. Category Match (15 points)
    const categoryMatch = calculateCategoryMatch(student.category, scholarship.category);
    score += categoryMatch.score;
    details.push({ factor: "Category", score: categoryMatch.score, matched: categoryMatch.score > 0 });
    if (categoryMatch.score > 0) {
        positiveFactors.push(categoryMatch.message);
    } else {
        negativeFactors.push(categoryMatch.message);
    }
    
    // 5. Region Match (5 points)
    const regionMatch = calculateRegionMatch(student.region, scholarship.region);
    score += regionMatch.score;
    details.push({ factor: "Region", score: regionMatch.score, matched: regionMatch.score > 0 });
    if (regionMatch.score > 0) {
        positiveFactors.push(regionMatch.message);
    }
    
    // Generate AI explanation
    const explanation = generateExplanation(score, positiveFactors, negativeFactors);
    
    return {
        score: Math.min(100, Math.round(score)),
        explanation: explanation,
        details: details
    };
}

/**
 * Calculate marks match with progressive scoring
 * @param {number} studentMarks - Student's marks
 * @param {number} requiredMarks - Required marks
 * @returns {Object} Match result
 */
function calculateMarksMatch(studentMarks, requiredMarks) {
    if (studentMarks >= requiredMarks) {
        const difference = studentMarks - requiredMarks;
        let bonus = 0;
        
        if (difference > 20) bonus = 5;
        else if (difference > 10) bonus = 3;
        else if (difference > 5) bonus = 1;
        
        return {
            score: 30 + bonus,
            message: `Your marks (${studentMarks}%) exceed the requirement (${requiredMarks}%)`
        };
    } else if (studentMarks >= requiredMarks - 5) {
        return {
            score: 15,
            message: `Your marks (${studentMarks}%) are slightly below requirement (${requiredMarks}%)`
        };
    } else if (studentMarks >= requiredMarks - 10) {
        return {
            score: 5,
            message: `Your marks (${studentMarks}%) are below requirement (${requiredMarks}%)`
        };
    } else {
        return {
            score: 0,
            message: `Your marks (${studentMarks}%) don't meet the minimum requirement (${requiredMarks}%)`
        };
    }
}

/**
 * Calculate income match
 * @param {number} studentIncome - Student's family income
 * @param {number} incomeLimit - Scholarship income limit
 * @returns {Object} Match result
 */
function calculateIncomeMatch(studentIncome, incomeLimit) {
    if (studentIncome <= incomeLimit) {
        const percentage = (studentIncome / incomeLimit) * 100;
        let bonus = 0;
        
        if (percentage < 50) bonus = 5;
        else if (percentage < 75) bonus = 3;
        
        return {
            score: 30 + bonus,
            message: `Your family income (₹${studentIncome.toLocaleString()}) is within the limit (₹${incomeLimit.toLocaleString()})`
        };
    } else if (studentIncome <= incomeLimit * 1.1) {
        return {
            score: 15,
            message: `Your family income (₹${studentIncome.toLocaleString()}) is slightly above the limit (₹${incomeLimit.toLocaleString()})`
        };
    } else if (studentIncome <= incomeLimit * 1.25) {
        return {
            score: 5,
            message: `Your family income (₹${studentIncome.toLocaleString()}) is above the limit (₹${incomeLimit.toLocaleString()})`
        };
    } else {
        return {
            score: 0,
            message: `Your family income (₹${studentIncome.toLocaleString()}) exceeds the limit (₹${incomeLimit.toLocaleString()})`
        };
    }
}

/**
 * Calculate category match
 * @param {string} studentCategory - Student's category
 * @param {Array} eligibleCategories - Scholarship's eligible categories
 * @returns {Object} Match result
 */
function calculateCategoryMatch(studentCategory, eligibleCategories) {
    if (eligibleCategories.includes("All") || eligibleCategories.includes(studentCategory)) {
        return {
            score: 15,
            message: `Your category (${studentCategory}) is eligible for this scholarship`
        };
    }
    
    // Check for general category
    if (studentCategory === "General" && eligibleCategories.includes("General")) {
        return {
            score: 15,
            message: "General category is eligible"
        };
    }
    
    return {
        score: 0,
        message: `Your category (${studentCategory}) is not in the eligible categories`
    };
}

/**
 * Calculate region match
 * @param {string} studentRegion - Student's region
 * @param {string} scholarshipRegion - Scholarship region
 * @returns {Object} Match result
 */
function calculateRegionMatch(studentRegion, scholarshipRegion) {
    if (scholarshipRegion === "India" || scholarshipRegion === "All India") {
        return {
            score: 5,
            message: "Open to all regions in India"
        };
    }
    
    if (studentRegion === scholarshipRegion) {
        return {
            score: 5,
            message: `Your region (${studentRegion}) matches the scholarship region`
        };
    }
    
    // Special cases
    if (scholarshipRegion === "North India" && 
        ["North India", "India"].includes(studentRegion)) {
        return {
            score: 5,
            message: "Open to North Indian regions"
        };
    }
    
    return {
        score: 0,
        message: `Region requirement not met (requires: ${scholarshipRegion})`
    };
}

/**
 * Generate AI-powered explanation
 * @param {number} score - Match score
 * @param {Array} positiveFactors - Positive match factors
 * @param {Array} negativeFactors - Negative match factors
 * @returns {string} Natural language explanation
 */
function generateExplanation(score, positiveFactors, negativeFactors) {
    if (score >= 90) {
        return `Excellent match! ${positiveFactors[0]} and ${positiveFactors.length > 1 ? positiveFactors[1] : 'all criteria are met perfectly'}. You have a high chance of selection.`;
    } else if (score >= 75) {
        return `Strong match. ${positiveFactors[0]}. ${negativeFactors.length > 0 ? `However, ${negativeFactors[0].toLowerCase()}` : 'All key criteria are satisfied.'}`;
    } else if (score >= 60) {
        return `Good match. ${positiveFactors[0]}. ${negativeFactors.length > 0 ? `Note: ${negativeFactors[0].toLowerCase()}` : 'Consider applying with strong supporting documents.'}`;
    } else if (score >= 40) {
        return `Moderate match. ${positiveFactors.length > 0 ? positiveFactors[0] : 'Some criteria match'}. ${negativeFactors.length > 0 ? `Main limitation: ${negativeFactors[0].toLowerCase()}` : 'May require additional qualifications.'}`;
    } else if (score >= 20) {
        return `Low match. ${negativeFactors.length > 0 ? negativeFactors[0] : 'Multiple criteria not met'}. Consider improving qualifications or looking for other scholarships.`;
    } else {
        return `Very low match. ${negativeFactors.slice(0, 2).join(' and ').toLowerCase()}. Not recommended to apply.`;
    }
}

/**
 * Get match breakdown for detailed view
 * @param {Object} matchDetails - Match details array
 * @returns {string} HTML for match breakdown
 */
function getMatchBreakdownHTML(matchDetails) {
    const totalPossible = 100;
    const achieved = matchDetails.reduce((sum, detail) => sum + detail.score, 0);
    
    const breakdownHTML = matchDetails.map(detail => `
        <div class="breakdown-item ${detail.matched ? 'matched' : 'not-matched'}">
            <div class="breakdown-factor">${detail.factor}</div>
            <div class="breakdown-score">${detail.score} points</div>
            <div class="breakdown-status">
                ${detail.matched ? '✅' : '❌'}
            </div>
        </div>
    `).join('');
    
    return `
        <div class="match-breakdown">
            <h5><i class="fas fa-chart-pie"></i> Match Breakdown</h5>
            <div class="breakdown-summary">
                <div class="score-summary">
                    <span class="achieved">${achieved}</span>
                    <span class="separator">/</span>
                    <span class="total">${totalPossible}</span>
                    <span class="points">points</span>
                </div>
                <div class="breakdown-items">
                    ${breakdownHTML}
                </div>
            </div>
        </div>
    `;
}

/**
 * Filter scholarships based on additional criteria
 * @param {Array} matches - Matching scholarships
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered scholarships
 */
function filterScholarships(matches, filters) {
    let filtered = [...matches];
    
    // Minimum match score filter
    if (filters.minMatch) {
        filtered = filtered.filter(match => match.matchScore >= filters.minMatch);
    }
    
    // Sort order
    if (filters.sortBy === "amount") {
        filtered.sort((a, b) => b.amount - a.amount);
    } else if (filters.sortBy === "deadline") {
        filtered.sort((a, b) => {
            const dateA = new Date(a.deadline);
            const dateB = new Date(b.deadline);
            return dateA - dateB;
        });
    } else {
        // Default: sort by match score
        filtered.sort((a, b) => b.matchScore - a.matchScore);
    }
    
    return filtered;
}

/**
 * Get personalized recommendations based on interests
 * @param {StudentProfile} student - Student profile
 * @param {Array} matches - Matching scholarships
 * @returns {Array} Personalized recommendations
 */
function getPersonalizedRecommendations(student, matches) {
    if (!student.interests || student.interests.length === 0) {
        return matches;
    }
    
    const personalized = matches.map(match => {
        let interestScore = 0;
        
        // Check if scholarship fields match student interests
        student.interests.forEach(interest => {
            if (match.fields.some(field => 
                field.toLowerCase().includes(interest.toLowerCase()) ||
                interest.toLowerCase().includes(field.toLowerCase())
            )) {
                interestScore += 10;
            }
        });
        
        // Add interest bonus to match score
        const finalScore = Math.min(100, match.matchScore + interestScore);
        
        return {
            ...match,
            matchScore: finalScore,
            explanation: interestScore > 0 ? 
                `${match.explanation} Plus, this aligns with your interests!` :
                match.explanation
        };
    });
    
    // Sort by new score
    personalized.sort((a, b) => b.matchScore - a.matchScore);
    
    return personalized;
}

// Export functions for use in other modules
window.aiMatching = {
    StudentProfile,
    findMatchingScholarships,
    calculateMatch,
    generateExplanation,
    getMatchBreakdownHTML,
    filterScholarships,
    getPersonalizedRecommendations
};