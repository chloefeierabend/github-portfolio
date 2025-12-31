/**
 * Work Page - Search and Filter Functionality
 * Handles project filtering by category and text search
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const searchInput = document.getElementById("project-search");
  const searchClear = document.querySelector(".search-clear");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const projectsGrid = document.querySelector(".projects-grid");
  const noResults = document.querySelector(".no-results");
  const resultsCount = document.querySelector(".results-count");
  const resetFiltersBtn = document.querySelector(".reset-filters-btn");
  const activeFiltersContainer = document.querySelector(".active-filters");
  const activeFiltersTags = document.querySelector(".active-filters-tags");
  const clearAllFiltersBtn = document.querySelector(".clear-all-filters");

  // State
  let currentFilter = "all";
  let currentSearch = "";

  // Initialize counts
  updateFilterCounts();
  updateResultsDisplay();

  // Search functionality
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value.toLowerCase().trim();

    // Show/hide clear button
    searchClear.hidden = !currentSearch;

    filterProjects();
  });

  // Clear search
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    currentSearch = "";
    searchClear.hidden = true;
    filterProjects();
    searchInput.focus();
  });

  // Filter button clicks
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active state
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.dataset.filter;
      filterProjects();
    });
  });

  // Reset filters button (in no results)
  resetFiltersBtn?.addEventListener("click", resetAllFilters);

  // Clear all filters button
  clearAllFiltersBtn?.addEventListener("click", resetAllFilters);

  /**
   * Filter projects based on current filter and search
   */
  function filterProjects() {
    let visibleCount = 0;

    projectCards.forEach((card, index) => {
      const category = card.dataset.category;
      const tags = card.dataset.tags?.toLowerCase() || "";
      const title =
        card.querySelector(".project-title")?.textContent.toLowerCase() || "";
      const description =
        card.querySelector(".project-description")?.textContent.toLowerCase() ||
        "";

      // Check category filter
      const matchesFilter =
        currentFilter === "all" || category === currentFilter;

      // Check search query
      const searchableText = `${title} ${description} ${tags} ${category}`;
      const matchesSearch =
        !currentSearch || searchableText.includes(currentSearch);

      // Show/hide card
      const isVisible = matchesFilter && matchesSearch;
      card.classList.toggle("hidden", !isVisible);

      if (isVisible) {
        visibleCount++;
        // Reset animation
        card.style.animation = "none";
        card.offsetHeight; // Trigger reflow
        card.style.animation = "";
        card.style.animationDelay = `${visibleCount * 60}ms`;
      }
    });

    // Show/hide no results message
    noResults.hidden = visibleCount > 0;
    projectsGrid.style.display = visibleCount > 0 ? "grid" : "none";

    // Update results count
    updateResultsDisplay(visibleCount);

    // Update active filters display
    updateActiveFilters();
  }

  /**
   * Update the filter count badges
   */
  function updateFilterCounts() {
    const counts = {
      all: projectCards.length,
      "ux-ui": 0,
      "web-dev": 0,
      graphic: 0,
      other: 0,
    };

    projectCards.forEach((card) => {
      const category = card.dataset.category;
      if (counts.hasOwnProperty(category)) {
        counts[category]++;
      }
    });

    // Update count badges
    document.querySelectorAll(".filter-count").forEach((badge) => {
      const filterType = badge.dataset.count;
      if (counts.hasOwnProperty(filterType)) {
        badge.textContent = counts[filterType];
      }
    });
  }

  /**
   * Update results display text
   */
  function updateResultsDisplay(count = null) {
    if (count === null) {
      count = projectCards.length;
    }

    const projectWord = count === 1 ? "project" : "projects";

    if (currentSearch || currentFilter !== "all") {
      resultsCount.textContent = `Showing ${count} ${projectWord}`;
    } else {
      resultsCount.textContent = `${count} ${projectWord}`;
    }
  }

  /**
   * Update active filters display
   */
  function updateActiveFilters() {
    const hasActiveFilters = currentFilter !== "all" || currentSearch;
    activeFiltersContainer.hidden = !hasActiveFilters;

    // Clear existing tags
    activeFiltersTags.innerHTML = "";

    if (!hasActiveFilters) return;

    // Add category filter tag
    if (currentFilter !== "all") {
      const filterName = getFilterName(currentFilter);
      const tag = createFilterTag(filterName, "category");
      activeFiltersTags.appendChild(tag);
    }

    // Add search filter tag
    if (currentSearch) {
      const tag = createFilterTag(`"${currentSearch}"`, "search");
      activeFiltersTags.appendChild(tag);
    }
  }

  /**
   * Create a filter tag element
   */
  function createFilterTag(text, type) {
    const tag = document.createElement("span");
    tag.className = "active-filter-tag";
    tag.innerHTML = `
      ${text}
      <button type="button" aria-label="Remove filter: ${text}">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    `;

    tag.querySelector("button").addEventListener("click", () => {
      if (type === "category") {
        // Reset to "All" filter
        filterButtons.forEach((b) => b.classList.remove("active"));
        document.querySelector('[data-filter="all"]').classList.add("active");
        currentFilter = "all";
      } else if (type === "search") {
        searchInput.value = "";
        currentSearch = "";
        searchClear.hidden = true;
      }
      filterProjects();
    });

    return tag;
  }

  /**
   * Get human-readable filter name
   */
  function getFilterName(filter) {
    const names = {
      "ux-ui": "UX/UI",
      "web-dev": "Web Dev",
      graphic: "Graphic",
      other: "Other",
    };
    return names[filter] || filter;
  }

  /**
   * Reset all filters to default state
   */
  function resetAllFilters() {
    // Reset search
    searchInput.value = "";
    currentSearch = "";
    searchClear.hidden = true;

    // Reset category filter
    filterButtons.forEach((b) => b.classList.remove("active"));
    document.querySelector('[data-filter="all"]').classList.add("active");
    currentFilter = "all";

    filterProjects();
    searchInput.focus();
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Focus search on "/" key (if not already in an input)
    if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
      e.preventDefault();
      searchInput.focus();
    }

    // Clear search on Escape
    if (e.key === "Escape" && document.activeElement === searchInput) {
      if (currentSearch) {
        searchInput.value = "";
        currentSearch = "";
        searchClear.hidden = true;
        filterProjects();
      } else {
        searchInput.blur();
      }
    }
  });
});
