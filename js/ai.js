/**
 * ENHANCED AI MATCHING FOR HACKATHON
 * More sophisticated scoring with weights and explanations
 */

class StudentProfile {
    constructor(data) {
        this.educationLevel = data.educationLevel;
        this.marks = parseInt(data.marks);
        this.category = data.category;
        this.income = parseInt(data.income);
        this.region = data.region;
        this.interests = data.interests ? data.interests.split(',').map(i => i.trim()) : [];
        this.stream = data.stream || '';
    }

    validate() {
        const errors = [];
        
        if (!this.educationLevel) errors.push("Education level is required");
        
        // Fix marks validation
        if (isNaN(this.marks) || this.marks < 0 || this.marks > 100) {
            errors.push("Marks must be between 0 and 100");
        }
        
        if (!this.category) errors.push("Category is required");
        
        // Fix income validation
        if (isNaN(this.income) || this.income < 0) {
            errors.push("Income must be a positive number");
        }
        
        if (!this.region) errors.push("Region is required");
        
        console.log('Validation errors:', errors);
        return errors;
    }
}

// Enhanced matching with weights
const MATCH_WEIGHTS = {
    EDUCATION: 25,      // 25 points
    MARKS: 30,          // 30 points  
    INCOME: 25,         // 25 points
    CATEGORY: 15,       // 15 points
    REGION: 5           // 5 points
};

// Helper functions
function matchEducation(studentEdu, requiredEdu) {
    if (studentEdu === requiredEdu) {
        return { points: 25, message: "Perfect education level match" };
    }
    
    // Partial matches (UG matches with PG, etc.)
    const eduHierarchy = ["High School", "UG", "PG", "PhD"];
    const studentIndex = eduHierarchy.indexOf(studentEdu);
    const requiredIndex = eduHierarchy.indexOf(requiredEdu);
    
    if (studentIndex >= requiredIndex) {
        return { points: 20, message: "Education level meets requirement" };
    } else if (studentIndex + 1 === requiredIndex) {
        return { points: 10, message: "Education level slightly below requirement" };
    }
    
    return { points: 0, message: "Education level doesn't match" };
}

function matchMarks(studentMarks, requiredMarks) {
    const difference = studentMarks - requiredMarks;
    
    if (difference >= 10) {
        return { 
            points: 30, 
            message: `Excellent marks (${studentMarks}% vs required ${requiredMarks}%)` 
        };
    } else if (difference >= 0) {
        return { 
            points: 25, 
            message: `Marks meet requirement (${studentMarks}%)` 
        };
    } else if (difference >= -5) {
        return { 
            points: 15, 
            message: `Marks slightly below (${studentMarks}% vs ${requiredMarks}%)` 
        };
    } else if (difference >= -10) {
        return { 
            points: 5, 
            message: `Marks below requirement (${studentMarks}% vs ${requiredMarks}%)` 
        };
    }
    
    return { 
        points: 0, 
        message: `Marks significantly below requirement` 
    };
}

function matchIncome(studentIncome, incomeLimit) {
    if (studentIncome <= incomeLimit) {
        const percentage = (studentIncome / incomeLimit) * 100;
        if (percentage < 50) {
            return { 
                points: 30, 
                message: "Well within income limit" 
            };
        }
        return { 
            points: 25, 
            message: "Within income limit" 
        };
    }
    
    const excessPercentage = ((studentIncome - incomeLimit) / incomeLimit) * 100;
    if (excessPercentage <= 10) {
        return { 
            points: 15, 
            message: "Slightly above income limit" 
        };
    } else if (excessPercentage <= 25) {
        return { 
            points: 5, 
            message: "Above income limit" 
        };
    }
    
    return { 
        points: 0, 
        message: "Exceeds income limit significantly" 
    };
}

function matchCategory(studentCategory, eligibleCategories) {
    if (eligibleCategories.includes(studentCategory) || eligibleCategories.includes("All")) {
        return { 
            points: 15, 
            message: `Your category (${studentCategory}) is eligible` 
        };
    }
    
    // Check for similar categories
    if ((studentCategory === "OBC" && eligibleCategories.includes("General")) ||
        (studentCategory === "General" && eligibleCategories.includes("OBC"))) {
        return { 
            points: 10, 
            message: "Category partially matches" 
        };
    }
    
    return { 
        points: 0, 
        message: "Category not eligible" 
    };
}

function matchRegion(studentRegion, scholarshipRegion) {
    if (scholarshipRegion === "India" || studentRegion === scholarshipRegion) {
        return { points: 5, message: "Region matches" };
    }
    
    // Check if regions are compatible (e.g., North India matches with India)
    if (scholarshipRegion === "India" || 
        (studentRegion.includes("India") && scholarshipRegion.includes("India"))) {
        return { points: 3, message: "Region compatible" };
    }
    
    return { points: 0, message: "Region doesn't match" };
}

function generateAIExplanation(score, strengths, weaknesses) {
    if (score >= 85) {
        return `🎯 Excellent match! ${strengths[0]}. You have a very high chance of selection.`;
    } else if (score >= 70) {
        return `✅ Strong match. ${strengths[0]}. ${weaknesses.length > 0 ? `Note: ${weaknesses[0]}` : ''}`;
    } else if (score >= 55) {
        return `👍 Good potential. ${strengths.length > 0 ? strengths[0] : 'Meets basic criteria'}.`;
    } else if (score >= 40) {
        return `⚠️ Moderate match. ${weaknesses.length > 0 ? weaknesses[0] : 'Some criteria not fully met'}.`;
    } else {
        return `❌ Low match. Multiple criteria not met. Consider other options.`;
    }
}

function calculateEnhancedMatch(student, scholarship) {
    let score = 0;
    let strengths = [];
    let weaknesses = [];
    
    // 1. Education Match (25 points)
    const eduScore = matchEducation(student.educationLevel, scholarship.degree);
    score += eduScore.points;
    if (eduScore.points > 20) strengths.push(eduScore.message);
    else if (eduScore.points < 10) weaknesses.push(eduScore.message);
    
    // 2. Marks Match (30 points)
    const marksScore = matchMarks(student.marks, scholarship.minMarks);
    score += marksScore.points;
    if (marksScore.points > 20) strengths.push(marksScore.message);
    else if (marksScore.points < 10) weaknesses.push(marksScore.message);
    
    // 3. Income Match (25 points)
    const incomeScore = matchIncome(student.income, scholarship.incomeLimit);
    score += incomeScore.points;
    if (incomeScore.points > 20) strengths.push(incomeScore.message);
    else if (incomeScore.points < 10) weaknesses.push(incomeScore.message);
    
    // 4. Category Match (15 points)
    const categoryScore = matchCategory(student.category, scholarship.category);
    score += categoryScore.points;
    if (categoryScore.points > 10) strengths.push(categoryScore.message);
    else if (categoryScore.points === 0) weaknesses.push(categoryScore.message);
    
    // 5. Region Match (5 points)
    const regionScore = matchRegion(student.region, scholarship.region);
    score += regionScore.points;
    
    // Generate AI explanation
    const explanation = generateAIExplanation(score, strengths, weaknesses);
    
    return {
        score: Math.min(100, Math.round(score)),
        explanation,
        strengths,
        weaknesses
    };
}

function findMatchingScholarships(student, scholarships) {
    console.log('Finding matches for:', student);
    console.log('Total scholarships:', scholarships.length);
    
    const matches = scholarships.map(scholarship => {
        const match = calculateEnhancedMatch(student, scholarship);
        return {
            ...scholarship,
            matchScore: match.score,
            explanation: match.explanation,
            strengths: match.strengths,
            weaknesses: match.weaknesses
        };
    });
    
    // Show all matches with score > 0 for debugging
    console.log('All matches with scores:', matches.map(m => ({
        name: m.name,
        score: m.matchScore
    })));
    
    // Filter and sort - make threshold lower (from 30 to 20)
    const filtered = matches
        .filter(m => m.matchScore > 10) // Lowered threshold to 10
        .sort((a, b) => b.matchScore - a.matchScore);
    
    console.log('Filtered matches:', filtered.length);
    return filtered;
}

/**
 * Get personalized recommendations based on interests
 */
function getPersonalizedRecommendations(student, matches) {
    if (!student.interests || student.interests.length === 0) {
        return matches;
    }
    
    const personalized = matches.map(match => {
        let interestScore = 0;
        
        // Check if scholarship fields match student interests
        student.interests.forEach(interest => {
            if (match.fields && match.fields.some(field => 
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

/**
 * Filter scholarships based on criteria
 */
function filterScholarships(matches, filters) {
    if (!filters) return matches;
    
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
 * Get match breakdown HTML for detailed view
 */
function getMatchBreakdownHTML(matchDetails) {
    if (!matchDetails || !Array.isArray(matchDetails)) {
        return '';
    }
    
    const totalPossible = 100;
    const achieved = matchDetails.reduce((sum, detail) => sum + (detail.score || 0), 0);
    
    const breakdownHTML = matchDetails.map(detail => `
        <div class="breakdown-item ${detail.matched ? 'matched' : 'not-matched'}">
            <div class="breakdown-factor">${detail.factor || 'Unknown'}</div>
            <div class="breakdown-score">${detail.score || 0} points</div>
            <div class="breakdown-status">
                ${(detail.score || 0) > 0 ? '✅' : '❌'}
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

// Export functions for use in other modules
window.aiMatching = {
    StudentProfile,
    findMatchingScholarships,
    calculateEnhancedMatch,
    generateAIExplanation,
    getMatchBreakdownHTML,
    filterScholarships,
    getPersonalizedRecommendations
};
