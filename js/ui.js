/**
 * UI HANDLING MODULE
 * Manages user interface interactions and display
 * Created by: Member 4 - Integration
 */

// UI State Management
const UIState = {
  currentMatches: [],
  savedScholarships: new Set(),
  userProfile: null,
  currentFilters: {
    minMatch: 50,
    sortBy: "match",
  },
  isLoading: false,
};

function initSmartSearch() {}

function extractKeywords(query) {
  const stopWords = [
    "for",
    "in",
    "the",
    "a",
    "an",
    "with",
    "below",
    "above",
    "and",
    "or",
    "scholarship",
    "scholarships",
  ];

  const words = query.toLowerCase().split(" ");
  return words.filter(
    (word) => word.length > 2 && !stopWords.includes(word) && !/\d+/.test(word),
  );
}

function displaySearchResults(results, query) {
  const container = document.getElementById("resultsContainer");
  let html = `
        <div class="search-results-header">
            <h3><i class="fas fa-robot"></i> AI Search Results for "${query}"</h3>
            <p>Found ${results.length} matching scholarships</p>
        </div>
    `;

  results.forEach((scholarship, index) => {
    html += `
            <div class="scholarship-card search-result">
                <div class="scholarship-header">
                    <div class="scholarship-name">${scholarship.name}</div>
                    <div class="match-badge">
                        <i class="fas fa-search"></i> Relevance: ${scholarship.searchScore}%
                    </div>
                </div>
                
                ${
                  scholarship.searchMatches.length > 0
                    ? `
                    <div class="search-matches">
                        <strong>Why it matches:</strong>
                        ${scholarship.searchMatches
                          .map(
                            (match) =>
                              `<span class="match-tag">${match}</span>`,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
                
                <div class="scholarship-details">
                    <div class="detail-item">
                        <span class="detail-label">Amount</span>
                        <span class="detail-value amount">₹${scholarship.amount.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Education</span>
                        <span class="detail-value">${scholarship.degree}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Income Limit</span>
                        <span class="detail-value">₹${scholarship.incomeLimit.toLocaleString()}</span>
                    </div>
                </div>
                
                <div class="scholarship-footer">
                    <button class="btn btn-small view-details" data-id="${scholarship.id}">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    <button class="btn btn-small save-scholarship" data-id="${scholarship.id}">
                        <i class="far fa-bookmark"></i> Save
                    </button>
                </div>
            </div>
        `;
  });

  container.innerHTML = html;

  // Re-attach event listeners
  attachCardEventListeners();
}

/**
 * Initialize category search
 */
function initCategorySearch() {
  // Add category search bar to HTML dynamically
  const filtersDiv = document.querySelector(".filters");
  if (filtersDiv && !document.getElementById("categorySearch")) {
    const categorySearchHtml = `
            <div class="category-search-container">
                <div class="search-input-group">
                    <i class="fas fa-filter"></i>
                    <input type="text" 
                           id="categorySearch" 
                           placeholder="Search by category: engineering, medical, law, phd, honors, arts..."
                           list="categorySuggestions">
                    <datalist id="categorySuggestions">
                        <option value="engineering">Engineering</option>
                        <option value="medical">Medical</option>
                        <option value="law">Law</option>
                        <option value="phd">PhD/Research</option>
                        <option value="honors">Honors Programs</option>
                        <option value="arts">Arts & Humanities</option>
                        <option value="science">Science</option>
                        <option value="commerce">Commerce</option>
                        <option value="management">Management</option>
                        <option value="sports">Sports</option>
                        <option value="girls">Girls Only</option>
                        <option value="all">All Fields</option>
                    </datalist>
                    <button class="btn btn-small" id="categorySearchBtn">
                        <i class="fas fa-search"></i> Search
                    </button>
                </div>
                <div class="category-tags">
                    <span class="category-tag" data-category="engineering">Engineering</span>
                    <span class="category-tag" data-category="medical">Medical</span>
                    <span class="category-tag" data-category="law">Law</span>
                    <span class="category-tag" data-category="phd">PhD/Research</span>
                    <span class="category-tag" data-category="honors">Honors</span>
                    <span class="category-tag" data-category="arts">Arts</span>
                    <span class="category-tag" data-category="science">Science</span>
                    <span class="category-tag" data-category="commerce">Commerce</span>
                    <span class="category-tag" data-category="management">Management</span>
                    <span class="category-tag" data-category="sports">Sports</span>
                </div>
            </div>
        `;

    filtersDiv.insertAdjacentHTML("afterend", categorySearchHtml);

    // Add event listeners
    document
      .getElementById("categorySearchBtn")
      .addEventListener("click", performCategorySearch);
    document
      .getElementById("categorySearch")
      .addEventListener("keypress", function (e) {
        if (e.key === "Enter") performCategorySearch();
      });

    // Add click events to category tags
    document.querySelectorAll(".category-tag").forEach((tag) => {
      tag.addEventListener("click", function () {
        const category = this.getAttribute("data-category");
        document.getElementById("categorySearch").value = category;
        performCategorySearch();
      });
    });
  }
}

/**
 * Perform category search
 */
function performCategorySearch() {
  const query = document
    .getElementById("categorySearch")
    .value.trim()
    .toLowerCase();
  if (!query) return;

  const scholarships = scholarshipData.getAllScholarships();
  const results = searchByCategory(query, scholarships);

  // Display results
  if (results.length > 0) {
    displayCategorySearchResults(results, query);
  } else {
    document.getElementById("resultsContainer").innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search fa-3x"></i>
                <h3>No scholarships found for "${query}"</h3>
                <p>Try these categories: engineering, medical, law, phd, honors, arts, science, commerce, management</p>
            </div>
        `;
    updateResultsCount(0);
  }
}

/**
 * Search scholarships by category
 */
function searchByCategory(query, scholarships) {
  const searchCategories = scholarshipData.searchCategories || {};
  const queryLower = query.toLowerCase();

  // Find matching scholarships
  const results = scholarships.filter((scholarship) => {
    // Check if query matches any predefined category
    if (searchCategories[queryLower]) {
      const categoryKeywords = searchCategories[queryLower];
      return categoryKeywords.some(
        (keyword) =>
          scholarship.fields.some((field) =>
            field.toLowerCase().includes(keyword.toLowerCase()),
          ) ||
          scholarship.name.toLowerCase().includes(keyword.toLowerCase()) ||
          scholarship.description.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    // General search across fields
    return (
      // Search in fields
      scholarship.fields.some((field) =>
        field.toLowerCase().includes(queryLower),
      ) ||
      // Search in name
      scholarship.name.toLowerCase().includes(queryLower) ||
      // Search in description
      scholarship.description.toLowerCase().includes(queryLower) ||
      // Search in degree/study level
      scholarship.degree.toLowerCase().includes(queryLower) ||
      // Search in tags (if available)
      (scholarship.tags &&
        scholarship.tags.some((tag) =>
          tag.toLowerCase().includes(queryLower),
        )) ||
      // Search in studyLevel (if available)
      (scholarship.studyLevel &&
        scholarship.studyLevel.some((level) =>
          level.toLowerCase().includes(queryLower),
        ))
    );
  });

  // Score and sort results
  const scoredResults = results.map((scholarship) => {
    let score = 0;
    let matches = [];

    // Field matches
    scholarship.fields.forEach((field) => {
      if (field.toLowerCase().includes(queryLower)) {
        score += 40;
        matches.push(`Field: ${field}`);
      }
    });

    // Name matches
    if (scholarship.name.toLowerCase().includes(queryLower)) {
      score += 30;
      matches.push("Name contains keyword");
    }

    // Description matches
    if (scholarship.description.toLowerCase().includes(queryLower)) {
      score += 20;
      matches.push("Description mentions");
    }

    // Tag matches
    if (
      scholarship.tags &&
      scholarship.tags.some((tag) => tag.toLowerCase().includes(queryLower))
    ) {
      score += 25;
      matches.push("Tag matches");
    }

    return {
      ...scholarship,
      searchScore: score,
      searchMatches: matches.slice(0, 3),
    };
  });

  return scoredResults
    .filter((s) => s.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore);
}

/**
 * Display category search results
 */
function displayCategorySearchResults(results, query) {
  const container = document.getElementById("resultsContainer");
  let html = `
        <div class="search-results-header">
            <h3><i class="fas fa-filter"></i> Category Search: "${query}"</h3>
            <p>Found ${results.length} matching scholarships</p>
            <button class="btn btn-small" onclick="clearCategorySearch()" style="margin-top: 10px;">
                <i class="fas fa-times"></i> Clear Search
            </button>
        </div>
    `;

  results.forEach((scholarship, index) => {
    const match = aiMatching.calculateEnhancedMatch(
      UIState.currentStudent || {
        educationLevel: "UG",
        marks: 70,
        category: "General",
        income: 300000,
        region: "India",
      },
      scholarship,
    );

    html += `
            <div class="scholarship-card search-result">
                <div class="scholarship-header">
                    <div class="scholarship-name">${scholarship.name}</div>
                    <div class="match-badge">
                        <i class="fas fa-search"></i> Relevance: ${scholarship.searchScore || 0}%
                    </div>
                </div>
                
                ${
                  scholarship.searchMatches &&
                  scholarship.searchMatches.length > 0
                    ? `
                    <div class="search-matches">
                        <strong>Why it matches:</strong>
                        ${scholarship.searchMatches
                          .map(
                            (match) =>
                              `<span class="match-tag">${match}</span>`,
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
                
                <div class="scholarship-details">
                    <div class="detail-item">
                        <span class="detail-label">Amount</span>
                        <span class="detail-value amount">₹${scholarship.amount.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Education</span>
                        <span class="detail-value">${scholarshipData.educationLevels[scholarship.degree] || scholarship.degree}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Fields</span>
                        <span class="detail-value">${scholarship.fields.join(", ")}</span>
                    </div>
                </div>
                
                <div class="scholarship-footer">
                    <div class="explanation">
                        <i class="fas fa-lightbulb"></i> ${match.explanation || "Matches your search criteria"}
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
  });

  container.innerHTML = html;
  updateResultsCount(results.length);

  // Re-attach event listeners
  attachCardEventListeners();
}

/**
 * Clear category search
 */
function clearCategorySearch() {
  document.getElementById("categorySearch").value = "";
  if (UIState.currentMatches.length > 0) {
    displayResults(UIState.currentMatches);
  } else {
    document.getElementById("resultsContainer").innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search fa-3x"></i>
                <h3>No scholarships yet</h3>
                <p>Fill out the form and click "Find Scholarships" to see matching opportunities</p>
            </div>
        `;
    updateResultsCount(0);
  }
}

/**
 * Initialize all UI event listeners
 */
function initUI() {
  console.log("Initializing UI...");

  // Form submission
  const form = document.getElementById("studentForm");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
    console.log("Form event listener added");
  }

  // Reset form
  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetForm);
  }

  // Filter controls
  const minMatchSlider = document.getElementById("minMatch");
  const matchValue = document.getElementById("matchValue");
  const sortSelect = document.getElementById("sortBy");
  const applyFiltersBtn = document.getElementById("applyFilters");

  if (minMatchSlider && matchValue) {
    minMatchSlider.addEventListener("input", function () {
      matchValue.textContent = `${this.value}%`;
      UIState.currentFilters.minMatch = parseInt(this.value);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      UIState.currentFilters.sortBy = this.value;
    });
  }

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", applyFilters);
  }

  // Modal controls
  const modal = document.getElementById("detailsModal");
  const closeModalBtns = document.querySelectorAll(".close-modal");

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal();
      }
    });
  }

  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  // Load saved scholarships from localStorage
  loadSavedScholarships();

  // Update saved count in navigation
  updateSavedCount();

  // Initialize empty state
  updateResultsCount(0);

  // Ensure saved section has correct structure
  ensureSavedSectionStructure();

  // Add dashboard and search features
  initSmartSearch();
  initCategorySearch();
  initNavigation();
  initDeadlineAlerts();

  // Make sure Find Scholarships tab is active by default
  setTimeout(() => {
    const findTab = document.querySelector('.nav-item[data-tab="find"]');
    if (findTab && !document.querySelector(".nav-item.active")) {
      switchTab("find");
    }
  }, 100);



   // Load user profile if exists
    setTimeout(() => {
        const savedProfile = localStorage.getItem('scholarshipAI_profile');
        if (savedProfile) {
            try {
                UIState.userProfile = JSON.parse(savedProfile);
            } catch (error) {
                console.error('Error loading user profile:', error);
            }
        }
    }, 1000);
  console.log("UI initialization complete");
}

/**
 * Initialize navigation event listeners
 */
function initNavigation() {
  // Add click event listeners to navigation items
  const navItems = document.querySelectorAll(".nav-item");
  console.log("Found navigation items:", navItems.length);

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const tabName = this.getAttribute("data-tab");
      console.log("Navigation clicked:", tabName);
      if (tabName) {
        switchTab(tabName);
      }
    });
  });
}

/**
 * Ensure saved section has the correct HTML structure
 */
function ensureSavedSectionStructure() {
  const savedSection = document.querySelector(".saved-section");
  if (!savedSection) return;

  // Check if saved section has the container
  const container = document.getElementById("savedContainer");
  if (!container) {
    // Recreate the saved section structure
    savedSection.innerHTML = `
            <div class="card">
                <h2><i class="far fa-bookmark"></i> Saved Scholarships</h2>
                <div class="saved-container" id="savedContainer">
                    <p class="empty-saved">Loading saved scholarships...</p>
                </div>
            </div>
        `;
  }
}

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
  event.preventDefault();
  console.log("=== FORM SUBMISSION STARTED ===");

  if (UIState.isLoading) return;

  // Get form values
  const formData = {
    educationLevel: document.getElementById("educationLevel").value,
    marks: document.getElementById("marks").value,
    category: document.getElementById("category").value,
    income: document.getElementById("income").value,
    region: document.getElementById("region").value,
    interests: document.getElementById("interests").value,
  };

  console.log("Form data collected:", formData);

  // Show loading state
  setLoadingState(true);

  try {
    // Create student profile
    const student = new aiMatching.StudentProfile(formData);
    console.log("Student profile created:", student);

    // Validate form
    const errors = student.validate();
    console.log("Validation errors:", errors);

    if (errors.length > 0) {
      alert("Please fix the following errors:\n" + errors.join("\n"));
      setLoadingState(false);
      return;
    }

    // Get all scholarships
    const scholarships = scholarshipData.getAllScholarships();
    console.log("Total scholarships available:", scholarships.length);

    // Find matches using AI - without timeout for debugging
    console.log("Starting AI matching...");
    const matches = aiMatching.findMatchingScholarships(student, scholarships);
    console.log("AI matching complete. Found:", matches.length, "matches");

    if (matches.length === 0) {
      console.log("No matches found. Showing sample results instead.");
      showSampleResults();
      setLoadingState(false);
      return;
    }

    // Apply personalization
    console.log("Applying personalization...");
    const personalized = aiMatching.getPersonalizedRecommendations(
      student,
      matches,
    );
    console.log("Personalization complete:", personalized.length);

    // Update UI state
    UIState.currentMatches = personalized;
    console.log("UIState updated with matches");

    // Apply current filters
    console.log("Applying filters...");
    const filtered = aiMatching.filterScholarships(
      personalized,
      UIState.currentFilters,
    );
    console.log("Filtering complete:", filtered.length);

    // Display results
    console.log("Displaying results...");
    displayResults(filtered);
  } catch (error) {
    console.error("Error in form submission:", error);
    console.error("Error stack:", error.stack);

    document.getElementById("resultsContainer").innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle fa-3x"></i>
                <h3>Error finding scholarships</h3>
                <p>${error.message || "Unknown error"}</p>
                <p><small>Check console for details (F12 → Console)</small></p>
                <button class="btn btn-primary" onclick="showSampleResults()" style="margin-top: 1rem;">
                    <i class="fas fa-eye"></i> Show Sample Results
                </button>
            </div>
        `;
  }

  // Hide loading state
  setLoadingState(false);
  console.log("=== FORM SUBMISSION COMPLETE ===");
}

/**
 * Display scholarship results
 */
function displayResults(matches) {
  const container = document.getElementById("resultsContainer");

  if (!container) {
    console.error("Results container not found!");
    return;
  }

  console.log("Displaying", matches?.length || 0, "results");

  if (!matches || matches.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search fa-3x"></i>
                <h3>No scholarships found</h3>
                <p>Try adjusting your criteria or use the search bar.</p>
                <button class="btn btn-primary" onclick="showSampleResults()" style="margin-top: 1rem;">
                    <i class="fas fa-eye"></i> Show Sample Results
                </button>
            </div>
        `;
    updateResultsCount(0);
    return;
  }

  // Generate scholarship cards
  let resultsHTML = "";

  matches.forEach((match) => {
    console.log("Processing match:", match.name, "Score:", match.matchScore);
    resultsHTML += scholarshipData.getScholarshipCardHTML(
      match,
      match.matchScore,
      match.explanation,
    );
  });

  container.innerHTML = resultsHTML;
  updateResultsCount(matches.length);
  console.log("Displayed", matches.length, "scholarships");

  // Add event listeners to new cards
  attachCardEventListeners();
}

/**
 * Show sample results for testing
 */
function showSampleResults() {
  console.log("Showing sample results");

  const scholarships = scholarshipData.getAllScholarships();
  const sampleMatches = scholarships.slice(0, 5).map((scholarship, index) => ({
    ...scholarship,
    matchScore: 100 - index * 15,
    explanation: "Sample result for testing purposes",
    strengths: ["Sample data"],
    weaknesses: [],
  }));

  UIState.currentMatches = sampleMatches;
  displayResults(sampleMatches);
  showNotification("Showing 5 sample scholarships for testing", "info");
}

/**
 * Attach event listeners to scholarship cards
 */
function attachCardEventListeners() {
  // View details buttons
  const viewDetailBtns = document.querySelectorAll(".view-details");
  viewDetailBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const scholarshipId = parseInt(this.getAttribute("data-id"));
      showScholarshipDetails(scholarshipId);
    });
  });

  // Save scholarship buttons
  const saveBtns = document.querySelectorAll(".save-scholarship");
  saveBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const scholarshipId = parseInt(this.getAttribute("data-id"));
      toggleSaveScholarship(scholarshipId);
    });
  });

  // Scholarship card click (entire card)
  const cards = document.querySelectorAll(".scholarship-card");
  cards.forEach((card) => {
    card.addEventListener("click", function (e) {
      if (!e.target.closest(".btn")) {
        const scholarshipId = parseInt(this.getAttribute("data-id"));
        showScholarshipDetails(scholarshipId);
      }
    });
  });
}

/**
 * Show detailed scholarship view in modal
 */
function showScholarshipDetails(scholarshipId) {
  const scholarship = scholarshipData.getScholarshipById(scholarshipId);

  if (!scholarship) {
    console.error("Scholarship not found:", scholarshipId);
    return;
  }

  // Find match score for this scholarship
  const match = UIState.currentMatches.find((m) => m.id === scholarshipId);
  const matchScore = match ? match.matchScore : 0;

  // Get detailed HTML
  const detailsHTML = scholarshipData.getScholarshipDetailsHTML(
    scholarship,
    matchScore,
  );

  // Update modal
  document.getElementById("modalTitle").textContent = scholarship.name;
  document.getElementById("modalBody").innerHTML = detailsHTML;

  // Update save button
  const saveBtn = document.getElementById("saveBtn");
  if (UIState.savedScholarships.has(scholarshipId)) {
    saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Remove from Saved';
    saveBtn.classList.add("saved");
  } else {
    saveBtn.innerHTML = '<i class="far fa-bookmark"></i> Save Scholarship';
    saveBtn.classList.remove("saved");
  }

  // Update save button event listener
  saveBtn.onclick = () => toggleSaveScholarship(scholarshipId);

  // Show modal
  document.getElementById("detailsModal").style.display = "flex";
}

/**
 * Toggle save status of a scholarship
 */
function toggleSaveScholarship(scholarshipId) {
  console.log("Toggling scholarship ID:", scholarshipId);

  if (UIState.savedScholarships.has(scholarshipId)) {
    UIState.savedScholarships.delete(scholarshipId);
    console.log("Removed from saved");
    showNotification("Removed from saved scholarships", "info");
  } else {
    UIState.savedScholarships.add(scholarshipId);
    console.log("Added to saved");
    showNotification("Scholarship saved!", "success");
  }

  // Update the navigation count
  updateSavedCount();

  // Update save buttons
  updateSaveButtonStates();

  // Save to localStorage
  saveToLocalStorage();

  // If we're on the saved tab, update the display
  const activeNav = document.querySelector(".nav-item.active");
  if (activeNav && activeNav.getAttribute("data-tab") === "saved") {
    displayEnhancedSaved();
  }
}

/**
 * Update saved count in navigation
 */
function updateSavedCount() {
  const savedCountElement = document.getElementById("nav-saved-count");
  if (savedCountElement) {
    savedCountElement.textContent = UIState.savedScholarships.size;
  }
}

/**
 * Update all save button states
 */
function updateSaveButtonStates() {
  // Update buttons in results
  const saveBtns = document.querySelectorAll(".save-scholarship");
  saveBtns.forEach((btn) => {
    const scholarshipId = parseInt(btn.getAttribute("data-id"));
    if (UIState.savedScholarships.has(scholarshipId)) {
      btn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
      btn.classList.add("saved");
    } else {
      btn.innerHTML = '<i class="far fa-bookmark"></i> Save';
      btn.classList.remove("saved");
    }
  });

  // Update modal save button
  const modalSaveBtn = document.getElementById("saveBtn");
  const scholarshipId = modalSaveBtn.onclick
    ? parseInt(modalSaveBtn.onclick.toString().match(/\d+/)?.[0])
    : null;

  if (scholarshipId && UIState.savedScholarships.has(scholarshipId)) {
    modalSaveBtn.innerHTML =
      '<i class="fas fa-bookmark"></i> Remove from Saved';
    modalSaveBtn.classList.add("saved");
  } else if (modalSaveBtn) {
    modalSaveBtn.innerHTML = '<i class="far fa-bookmark"></i> Save Scholarship';
    modalSaveBtn.classList.remove("saved");
  }
}

/**
 * Display saved scholarships
 */
function displaySavedScholarships() {
  const container = document.getElementById("savedContainer");

  if (!container) return;

  if (UIState.savedScholarships.size === 0) {
    container.innerHTML =
      '<p class="empty-saved">No saved scholarships yet</p>';
    return;
  }

  let savedHTML = "";

  UIState.savedScholarships.forEach((scholarshipId) => {
    const scholarship = scholarshipData.getScholarshipById(scholarshipId);
    if (!scholarship) return;

    const match = UIState.currentMatches.find((m) => m.id === scholarshipId);
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
  document.querySelectorAll(".view-saved").forEach((btn) => {
    btn.addEventListener("click", function () {
      const scholarshipId = parseInt(this.getAttribute("data-id"));
      showScholarshipDetails(scholarshipId);
    });
  });

  document.querySelectorAll(".remove-saved").forEach((btn) => {
    btn.addEventListener("click", function () {
      const scholarshipId = parseInt(this.getAttribute("data-id"));
      toggleSaveScholarship(scholarshipId);
    });
  });
}

/**
 * Apply filters to current results
 */
function applyFilters() {
  if (UIState.currentMatches.length === 0) {
    showNotification("No scholarships to filter", "info");
    return;
  }

  const filtered = aiMatching.filterScholarships(
    UIState.currentMatches,
    UIState.currentFilters,
  );

  displayResults(filtered);
}

/**
 * Reset form to initial state
 */
function resetForm() {
  document.getElementById("studentForm").reset();
  document.getElementById("resultsContainer").innerHTML = `
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
 */
function setLoadingState(isLoading) {
  UIState.isLoading = isLoading;
  const findBtn = document.getElementById("findBtn");
  const loadingSpinner = document.getElementById("loadingSpinner");

  if (isLoading) {
    findBtn.disabled = true;
    loadingSpinner.style.display = "inline-block";
    findBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Finding Scholarships...';
  } else {
    findBtn.disabled = false;
    loadingSpinner.style.display = "none";
    findBtn.innerHTML = '<i class="fas fa-search"></i> Find Scholarships';
  }
}

/**
 * Update results count display
 */
function updateResultsCount(count) {
  const countElement = document.getElementById("resultsCount");
  if (countElement) {
    countElement.textContent = count;
  }
}

/**
 * Close modal dialog
 */
function closeModal() {
  document.getElementById("detailsModal").style.display = "none";
}

/**
 * Show notification
 */
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
        <span>${message}</span>
    `;

  // Add to body
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => notification.classList.add("show"), 10);

  // Remove after delay
  setTimeout(() => {
    notification.classList.remove("show");
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
    filters: UIState.currentFilters,
  };

  localStorage.setItem("scholarshipAI", JSON.stringify(savedData));
}

/**
 * Load data from localStorage
 */
function loadSavedScholarships() {
  const savedData = localStorage.getItem("scholarshipAI");

  if (savedData) {
    try {
      const data = JSON.parse(savedData);

      if (data.savedScholarships && Array.isArray(data.savedScholarships)) {
        UIState.savedScholarships = new Set(data.savedScholarships);
        console.log(
          "Loaded saved scholarships:",
          UIState.savedScholarships.size,
        );
      }

      if (data.filters) {
        UIState.currentFilters = { ...UIState.currentFilters, ...data.filters };

        // Update UI
        const minMatchSlider = document.getElementById("minMatch");
        const matchValue = document.getElementById("matchValue");
        const sortSelect = document.getElementById("sortBy");

        if (minMatchSlider && matchValue) {
          minMatchSlider.value = UIState.currentFilters.minMatch;
          matchValue.textContent = `${UIState.currentFilters.minMatch}%`;
        }

        if (sortSelect) {
          sortSelect.value = UIState.currentFilters.sortBy;
        }
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  }
}

/**
 * Switch between tabs
 */
function switchTab(tabName) {
  console.log("Switching to tab:", tabName);

  // Update active state in navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Activate clicked tab
  const activeTab = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
  if (activeTab) {
    activeTab.classList.add("active");
  }

  // Get all sections
  const formSection = document.querySelector(".form-section");
  const resultsSection = document.querySelector(".results-section");
  const savedSection = document.querySelector(".saved-section");

  // Hide all sections first
  if (formSection) formSection.style.display = "none";
  if (resultsSection) resultsSection.style.display = "none";
  if (savedSection) {
    // Always ensure saved section has the correct structure
    ensureSavedSectionStructure();
    savedSection.style.display = "none";
  }

  // Show the appropriate section
  switch (tabName) {
    case "find":
      // Show find section (form + results)
      if (formSection) formSection.style.display = "block";
      if (resultsSection) resultsSection.style.display = "block";
      break;

    case "saved":
      // Show saved section
      if (savedSection) {
        savedSection.style.display = "block";
        // Ensure we have the correct structure before displaying
        ensureSavedSectionStructure();
        displayEnhancedSaved();
      }
      break;

    case "profile":
      // Show profile in saved section
      if (savedSection) {
        savedSection.style.display = "block";
        // Show user profile
        showUserProfile();
      }
      break;
  }

  // Also hide the smart search if it's showing
  const smartSearch = document.querySelector(".smart-search-container");
  if (smartSearch && tabName !== "find") {
    smartSearch.style.display = "none";
  }
}

/**
 * Display enhanced saved scholarships view
 */
function displayEnhancedSaved() {
  // First ensure the saved container exists
  let container = document.getElementById("savedContainer");

  // If container doesn't exist, recreate the saved section structure
  if (!container) {
    ensureSavedSectionStructure();
    container = document.getElementById("savedContainer");
    if (!container) {
      console.error("Cannot find saved container even after recreating");
      return;
    }
  }

  console.log("Displaying saved scholarships:", UIState.savedScholarships.size);

  if (UIState.savedScholarships.size === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <i class="far fa-bookmark fa-3x"></i>
                <h3>No saved scholarships yet</h3>
                <p>Find scholarships and click the save button to add them here</p>
                <button class="btn btn-primary" onclick="switchTab('find')">
                    <i class="fas fa-search"></i> Find Scholarships
                </button>
            </div>
        `;
    return;
  }

  let html = `
        <div class="saved-stats">
            <div class="stat-card">
                <i class="fas fa-bookmark"></i>
                <div class="stat-number">${UIState.savedScholarships.size}</div>
                <div class="stat-label">Total Saved</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-calendar-alt"></i>
                <div class="stat-number">${getUpcomingDeadlines()}</div>
                <div class="stat-label">Upcoming Deadlines</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-rupee-sign"></i>
                <div class="stat-number">₹${getTotalAmount().toLocaleString()}</div>
                <div class="stat-label">Total Amount</div>
            </div>
        </div>
        
        <div class="saved-list-header">
            <h4>Your Saved Scholarships</h4>
            <button class="btn btn-small" onclick="exportSaved()">
                <i class="fas fa-download"></i> Export List
            </button>
        </div>
    `;

  // Convert Set to Array for easier iteration
  const savedArray = Array.from(UIState.savedScholarships);

  savedArray.forEach((scholarshipId) => {
    const scholarship = scholarshipData.getScholarshipById(scholarshipId);
    if (!scholarship) {
      console.warn("Scholarship not found for ID:", scholarshipId);
      return;
    }

    const deadline = new Date(scholarship.deadline);
    const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));

    html += `
            <div class="saved-scholarship enhanced" data-id="${scholarshipId}">
                <div class="saved-main">
                    <div class="saved-name">${scholarship.name}</div>
                    <div class="saved-provider">${scholarship.provider}</div>
                    <div class="saved-details">
                        <span class="saved-amount">₹${scholarship.amount.toLocaleString()}</span>
                        <span class="saved-deadline ${daysLeft < 30 ? "urgent" : ""}">
                            <i class="fas fa-clock"></i> ${daysLeft} days left
                        </span>
                    </div>
                </div>
                <div class="saved-actions">
                    <a href="${scholarship.website}" target="_blank" class="btn btn-small">
                        <i class="fas fa-external-link-alt"></i> Apply
                    </a>
                    <button class="btn btn-small remove-saved" data-id="${scholarshipId}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
  });

  container.innerHTML = html;

  // Add event listeners for remove buttons
  document.querySelectorAll(".remove-saved").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const scholarshipId = parseInt(this.dataset.id);
      console.log("Removing from saved:", scholarshipId);
      toggleSaveScholarship(scholarshipId);
    });
  });
}

function getUpcomingDeadlines() {
  let count = 0;
  UIState.savedScholarships.forEach((id) => {
    const scholarship = scholarshipData.getScholarshipById(id);
    if (scholarship) {
      const deadline = new Date(scholarship.deadline);
      const daysLeft = Math.ceil(
        (deadline - new Date()) / (1000 * 60 * 60 * 24),
      );
      if (daysLeft < 30) count++;
    }
  });
  return count;
}

function getTotalAmount() {
  let total = 0;
  UIState.savedScholarships.forEach((id) => {
    const scholarship = scholarshipData.getScholarshipById(id);
    if (scholarship) total += scholarship.amount;
  });
  return total;
}

/**
 * Show user profile
 */
function showUserProfile() {
  const savedSection = document.querySelector(".saved-section");
  if (!savedSection) return;

  // Save the original container HTML before replacing
//   const container = document.getElementById("savedContainer");
//   if (container && !window.originalSavedHTML) {
//     window.originalSavedHTML = savedSection.innerHTML;
//   }

  // Replace with profile content
  savedSection.innerHTML = `
        <!-- In showUserProfile() function in ui.js, update the profile section HTML: -->

    <div class="card">
    <h2><i class="fas fa-user-circle"></i> My Profile</h2>
    
    <div class="profile-section">
        <h4><i class="fas fa-user-edit"></i> Edit Your Profile</h4>
        <div class="profile-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="profileName"><i class="fas fa-user"></i> Full Name</label>
                    <input type="text" id="profileName" placeholder="Enter your full name">
                </div>
                <div class="form-group">
                    <label for="profileEmail"><i class="fas fa-envelope"></i> Email</label>
                    <input type="email" id="profileEmail" placeholder="Enter your email">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="profilePhone"><i class="fas fa-phone"></i> Phone Number</label>
                    <input type="tel" id="profilePhone" placeholder="Enter your phone number">
                </div>
                <div class="form-group">
                    <label for="profileDOB"><i class="fas fa-calendar"></i> Date of Birth</label>
                    <input type="date" id="profileDOB">
                </div>
            </div>
            
            <div class="form-group">
                <label for="profileAddress"><i class="fas fa-home"></i> Address</label>
                <textarea id="profileAddress" rows="3" placeholder="Enter your full address"></textarea>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="profileCity"><i class="fas fa-city"></i> City</label>
                    <input type="text" id="profileCity" placeholder="Enter your city">
                </div>
                <div class="form-group">
                    <label for="profileState"><i class="fas fa-map-marker-alt"></i> State</label>
                    <input type="text" id="profileState" placeholder="Enter your state">
                </div>
                <div class="form-group">
                    <label for="profilePincode"><i class="fas fa-map-pin"></i> Pincode</label>
                    <input type="text" id="profilePincode" placeholder="Enter pincode">
                </div>
            </div>
            
            <div class="form-group">
                <label for="profileEducation"><i class="fas fa-graduation-cap"></i> Current Education</label>
                <input type="text" id="profileEducation" placeholder="e.g., B.Tech 2nd Year, Delhi University">
            </div>
            
            <div class="form-group">
                <label for="profileCollege"><i class="fas fa-university"></i> College/University</label>
                <input type="text" id="profileCollege" placeholder="Enter your college name">
            </div>
            
            <div class="form-group">
                <label><i class="fas fa-venus-mars"></i> Gender</label>
                <div class="gender-options">
                    <label class="radio-option">
                        <input type="radio" name="profileGender" value="Male"> Male
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="profileGender" value="Female"> Female
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="profileGender" value="Other"> Other
                    </label>
                </div>
            </div>
            
            <div class="form-actions">
                <button class="btn btn-primary" id="saveProfileBtn">
                    <i class="fas fa-save"></i> Save Profile
                </button>
                <button class="btn btn-secondary" onclick="loadProfileData()">
                    <i class="fas fa-redo"></i> Reset
                </button>
            </div>
        </div>
    </div>
    
    <div class="profile-section">
        <h4><i class="fas fa-id-card"></i> Current Profile Data</h4>
        <div class="profile-data" id="currentProfile">
            <p>No profile data saved yet. Fill the form above to create your profile.</p>
        </div>
    </div>
    
    <div class="profile-section">
        <h4><i class="fas fa-chart-line"></i> Profile Strength</h4>
        <div class="profile-strength">
            <div class="strength-meter">
                <div class="strength-fill" id="profileStrength"></div>
            </div>
            <div class="strength-text" id="strengthText">Complete your profile to improve matches</div>
        </div>
    </div>
    
    <div class="profile-section">
        <h4><i class="fas fa-bolt"></i> Quick Actions</h4>
        <div class="quick-actions">
            <button class="btn btn-small" onclick="switchTab('find')">
                <i class="fas fa-search"></i> Find Scholarships
            </button>
            <button class="btn btn-small" onclick="exportProfile()">
                <i class="fas fa-download"></i> Export Profile
            </button>
            <button class="btn btn-small btn-danger" onclick="clearProfile()">
                <i class="fas fa-trash"></i> Clear Profile
            </button>
        </div>
    </div>
    </div>
    `;
    initProfileFunctionality();

  // Update profile data if form was filled
  updateProfileDisplay();
}



/**
 * Initialize profile functionality
 */
function initProfileFunctionality() {
    // Load saved profile if exists
    loadProfileData();
    
    // Add save button event listener
    const saveBtn = document.getElementById('saveProfileBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveProfile);
    }
    
    // Initialize auto-save (optional)
    initProfileAutoSave();
}

/**
 * Update profile display with current data
 */
function updateProfileDisplay() {
  const profileContainer = document.getElementById("currentProfile");
  if (!profileContainer || !UIState.userProfile) return;

  const profile = UIState.userProfile;

  let profileHTML = `
        <div class="profile-display-grid">
            <div class="profile-item">
                <span class="profile-label"><i class="fas fa-user"></i> Name:</span>
                <span class="profile-value">${profile.name || "Not set"}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label"><i class="fas fa-envelope"></i> Email:</span>
                <span class="profile-value">${profile.email || "Not set"}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label"><i class="fas fa-phone"></i> Phone:</span>
                <span class="profile-value">${profile.phone || "Not set"}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label"><i class="fas fa-calendar"></i> Date of Birth:</span>
                <span class="profile-value">${profile.dob ? new Date(profile.dob).toLocaleDateString() : "Not set"}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label"><i class="fas fa-home"></i> Address:</span>
                <span class="profile-value">${profile.address || "Not set"}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label"><i class="fas fa-city"></i> City:</span>
                <span class="profile-value">${profile.city || "Not set"}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label"><i class="fas fa-map-marker-alt"></i> State:</span>
                <span class="profile-value">${profile.state || "Not set"}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label"><i class="fas fa-graduation-cap"></i> Education:</span>
                <span class="profile-value">${profile.education || "Not set"}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label"><i class="fas fa-university"></i> College:</span>
                <span class="profile-value">${profile.college || "Not set"}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label"><i class="fas fa-venus-mars"></i> Gender:</span>
                <span class="profile-value">${profile.gender || "Not set"}</span>
            </div>
            ${
              profile.lastUpdated
                ? `
            <div class="profile-item">
                <span class="profile-label"><i class="fas fa-clock"></i> Last Updated:</span>
                <span class="profile-value">${new Date(profile.lastUpdated).toLocaleString()}</span>
            </div>
            `
                : ""
            }
        </div>
    `;

  profileContainer.innerHTML = profileHTML;
}

/**
 * Calculate profile completion strength
 */
function calculateProfileStrength(profileData) {
  const fields = [
    "name",
    "email",
    "phone",
    "dob",
    "address",
    "city",
    "state",
    "pincode",
    "education",
    "college",
    "gender",
  ];

  let filledFields = 0;
  fields.forEach((field) => {
    if (profileData[field] && profileData[field].toString().trim().length > 0) {
      filledFields++;
    }
  });

  const percentage = Math.round((filledFields / fields.length) * 100);
  const strengthBar = document.getElementById("profileStrength");
  const strengthText = document.getElementById("strengthText");

  if (strengthBar && strengthText) {
    strengthBar.style.width = `${percentage}%`;

    if (percentage >= 90) {
      strengthBar.style.background = "var(--gradient-success)";
      strengthText.textContent = "Excellent profile! All details are complete.";
      strengthText.style.color = "var(--success)";
    } else if (percentage >= 70) {
      strengthBar.style.background = "var(--primary)";
      strengthText.textContent =
        "Good profile. Add more details for better recommendations.";
      strengthText.style.color = "var(--primary)";
    } else if (percentage >= 50) {
      strengthBar.style.background = "var(--warning)";
      strengthText.textContent =
        "Basic profile. Complete more fields for better results.";
      strengthText.style.color = "var(--warning)";
    } else {
      strengthBar.style.background = "var(--danger)";
      strengthText.textContent = "Profile incomplete. Fill required fields.";
      strengthText.style.color = "var(--danger)";
    }
  }

  return percentage;
}

/**
 * Export profile as JSON file
 */
function exportProfile() {
  if (!UIState.userProfile) {
    showNotification("No profile data to export", "error");
    return;
  }

  const dataStr = JSON.stringify(UIState.userProfile, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = `scholarship_profile_${new Date().toISOString().split("T")[0]}.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();

  showNotification("Profile exported successfully!", "success");
}

/**
 * Clear profile data
 */
function clearProfile() {
  if (
    confirm(
      "Are you sure you want to clear your profile data? This action cannot be undone.",
    )
  ) {
    UIState.userProfile = null;
    localStorage.removeItem("scholarshipAI_profile");

    // Clear form fields
    document.getElementById("profileName").value = "";
    document.getElementById("profileEmail").value = "";
    document.getElementById("profilePhone").value = "";
    document.getElementById("profileDOB").value = "";
    document.getElementById("profileAddress").value = "";
    document.getElementById("profileCity").value = "";
    document.getElementById("profileState").value = "";
    document.getElementById("profilePincode").value = "";
    document.getElementById("profileEducation").value = "";
    document.getElementById("profileCollege").value = "";

    // Clear gender selection
    document
      .querySelectorAll('input[name="profileGender"]')
      .forEach((radio) => {
        radio.checked = false;
      });

    // Update display
    const profileContainer = document.getElementById("currentProfile");
    if (profileContainer) {
      profileContainer.innerHTML =
        "<p>No profile data saved yet. Fill the form above to create your profile.</p>";
    }

    // Reset strength meter
    const strengthBar = document.getElementById("profileStrength");
    const strengthText = document.getElementById("strengthText");
    if (strengthBar) strengthBar.style.width = "0%";
    if (strengthText)
      strengthText.textContent = "Complete your profile to improve matches";

    showNotification("Profile cleared successfully", "info");
  }
}

/**
 * Save user profile
 */
function saveProfile() {
  // Get form values
  const profileData = {
    name: document.getElementById("profileName").value.trim(),
    email: document.getElementById("profileEmail").value.trim(),
    phone: document.getElementById("profilePhone").value.trim(),
    dob: document.getElementById("profileDOB").value,
    address: document.getElementById("profileAddress").value.trim(),
    city: document.getElementById("profileCity").value.trim(),
    state: document.getElementById("profileState").value.trim(),
    pincode: document.getElementById("profilePincode").value.trim(),
    education: document.getElementById("profileEducation").value.trim(),
    college: document.getElementById("profileCollege").value.trim(),
    gender:
      document.querySelector('input[name="profileGender"]:checked')?.value ||
      "",
    lastUpdated: new Date().toISOString(),
  };

  // Basic validation
  if (!profileData.name || !profileData.email) {
    showNotification("Name and Email are required", "error");
    return;
  }

  // Save to UIState
  UIState.userProfile = profileData;

  // Save to localStorage
  localStorage.setItem("scholarshipAI_profile", JSON.stringify(profileData));

  // Update display
  updateProfileDisplay();

  // Show success message
  showNotification("Profile saved successfully!", "success");

  // Calculate profile strength
  calculateProfileStrength(profileData);
}

/**
 * Load saved profile data
 */
function loadProfileData() {
  // Try to load from localStorage
  const savedProfile = localStorage.getItem("scholarshipAI_profile");

  if (savedProfile) {
    try {
      const profileData = JSON.parse(savedProfile);
      UIState.userProfile = profileData;

      // Fill form fields
      document.getElementById("profileName").value = profileData.name || "";
      document.getElementById("profileEmail").value = profileData.email || "";
      document.getElementById("profilePhone").value = profileData.phone || "";
      document.getElementById("profileDOB").value = profileData.dob || "";
      document.getElementById("profileAddress").value =
        profileData.address || "";
      document.getElementById("profileCity").value = profileData.city || "";
      document.getElementById("profileState").value = profileData.state || "";
      document.getElementById("profilePincode").value =
        profileData.pincode || "";
      document.getElementById("profileEducation").value =
        profileData.education || "";
      document.getElementById("profileCollege").value =
        profileData.college || "";

      // Set gender radio button
      if (profileData.gender) {
        const genderRadio = document.querySelector(
          `input[name="profileGender"][value="${profileData.gender}"]`,
        );
        if (genderRadio) {
          genderRadio.checked = true;
        }
      }

      // Update display
      updateProfileDisplay();

      // Calculate profile strength
      calculateProfileStrength(profileData);

      showNotification("Profile loaded successfully!", "success");
    } catch (error) {
      console.error("Error loading profile:", error);
      showNotification("Error loading profile data", "error");
    }
  }
}

function exportSaved() {
  if (UIState.savedScholarships.size === 0) {
    showNotification("No scholarships to export", "info");
    return;
  }

  let csvContent = "Name,Provider,Amount,Deadline,Website\n";

  UIState.savedScholarships.forEach((id) => {
    const scholarship = scholarshipData.getScholarshipById(id);
    if (scholarship) {
      csvContent += `"${scholarship.name}","${scholarship.provider}",${scholarship.amount},"${scholarship.deadline}","${scholarship.website}"\n`;
    }
  });

  // Create download link
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "my-saved-scholarships.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showNotification("Scholarship list exported as CSV", "success");
}

function clearSaved() {
  if (confirm("Are you sure you want to clear all saved scholarships?")) {
    UIState.savedScholarships.clear();
    updateSavedCount();

    // If we're on the saved tab, update the display
    const activeNav = document.querySelector(".nav-item.active");
    if (activeNav && activeNav.getAttribute("data-tab") === "saved") {
      displayEnhancedSaved();
    }

    saveToLocalStorage();
    showNotification("All saved scholarships cleared", "info");
  }
}

/**
 * DEADLINE ALERTS & NOTIFICATIONS
 */
function initDeadlineAlerts() {
  const upcoming = checkUpcomingDeadlines();

  if (upcoming.length > 0) {
    showDeadlineAlert(upcoming);
  }
}

function checkUpcomingDeadlines() {
  const scholarships = scholarshipData.getAllScholarships();
  const today = new Date();
  const upcoming = [];

  scholarships.forEach((scholarship) => {
    const deadline = new Date(scholarship.deadline);
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    if (daysLeft >= 0 && daysLeft <= 30) {
      upcoming.push({
        ...scholarship,
        daysLeft: daysLeft,
      });
    }
  });

  return upcoming.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 3);
}

function showDeadlineAlert(upcoming) {
  // Create alert element
  const alertHtml = `
        <div class="deadline-alert" id="deadlineAlert">
            <div class="alert-header">
                <i class="fas fa-clock"></i>
                <h4>Upcoming Deadlines</h4>
                <button class="close-alert">&times;</button>
            </div>
            <div class="alert-body">
                ${upcoming
                  .map(
                    (scholarship) => `
                    <div class="deadline-item">
                        <div class="deadline-name">${scholarship.name}</div>
                        <div class="deadline-info">
                            <span class="deadline-days ${scholarship.daysLeft < 7 ? "urgent" : ""}">
                                ${scholarship.daysLeft} day${scholarship.daysLeft !== 1 ? "s" : ""} left
                            </span>
                            <span class="deadline-amount">₹${scholarship.amount.toLocaleString()}</span>
                        </div>
                        <button class="btn btn-small view-scholarship" data-id="${scholarship.id}">
                            View
                        </button>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `;

  // Add to page
  document.body.insertAdjacentHTML("afterbegin", alertHtml);

  // Add event listeners
  document.querySelector(".close-alert").addEventListener("click", function () {
    document.getElementById("deadlineAlert").remove();
  });

  document.querySelectorAll(".view-scholarship").forEach((btn) => {
    btn.addEventListener("click", function () {
      const scholarshipId = parseInt(this.dataset.id);
      document.getElementById("deadlineAlert").remove();
      showScholarshipDetails(scholarshipId);
    });
  });

  // Auto-remove after 10 seconds
  setTimeout(() => {
    const alert = document.getElementById("deadlineAlert");
    if (alert) {
      alert.style.opacity = "0";
      setTimeout(() => alert.remove(), 300);
    }
  }, 10000);
}

// Add notification styles
function addNotificationStyles() {
  const style = document.createElement("style");
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

// Debug function
function debugMatching() {
  console.log("=== DEBUG MATCHING ===");

  // Test student
  const testStudent = new aiMatching.StudentProfile({
    educationLevel: "UG",
    marks: "85",
    category: "General",
    income: "250000",
    region: "India",
    interests: "Engineering",
  });

  console.log("Test student:", testStudent);

  // Get scholarships
  const scholarships = scholarshipData.getAllScholarships();
  console.log("Total scholarships:", scholarships.length);

  // Test matching
  const matches = aiMatching.findMatchingScholarships(
    testStudent,
    scholarships,
  );
  console.log("Matches found:", matches.length);

  if (matches.length > 0) {
    console.log(
      "Match details:",
      matches.map((m) => ({
        name: m.name,
        score: m.matchScore,
        explanation: m.explanation,
      })),
    );
  } else {
    console.log("NO MATCHES FOUND. Checking each scholarship:");
    scholarships.forEach((scholarship) => {
      const match = aiMatching.calculateEnhancedMatch(testStudent, scholarship);
      console.log(
        `${scholarship.name}: ${match.score}% - ${match.explanation}`,
      );
    });
  }

  console.log("=== END DEBUG ===");
}

/**
 * Debug function to check saved section state
 */
function debugSectionState() {
  console.log("=== DEBUG SECTION STATE ===");
  console.log(
    "Form section display:",
    document.querySelector(".form-section")?.style.display,
  );
  console.log(
    "Results section display:",
    document.querySelector(".results-section")?.style.display,
  );
  console.log(
    "Saved section display:",
    document.querySelector(".saved-section")?.style.display,
  );
  console.log(
    "Saved container exists:",
    !!document.getElementById("savedContainer"),
  );
  console.log(
    "Active tab:",
    document.querySelector(".nav-item.active")?.getAttribute("data-tab"),
  );
  console.log("Saved scholarships:", UIState.savedScholarships.size);
  console.log("==========================");
}

// Initialize when DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     console.log('DOM loaded, initializing UI...');
//     addNotificationStyles();
//     initUI();

//     // Add debug button
//     const debugBtn = document.createElement('button');
//     debugBtn.innerHTML = '🐛 Debug Sections';
//     debugBtn.style.cssText = 'position: fixed; bottom: 10px; right: 10px; z-index: 1000; background: blue; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer;';
//     debugBtn.onclick = debugSectionState;
//     document.body.appendChild(debugBtn);
// });

// Export UI functions
window.uiHandler = {
  initUI,
  displayResults,
  showScholarshipDetails,
  toggleSaveScholarship,
  applyFilters,
  resetForm,
  showNotification,
  switchTab,
};
