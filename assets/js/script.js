'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = (this.dataset.filterValue || this.innerText)
      .toLowerCase()
      .trim();

    /* Update the visible label in the dropdown so the user always sees the
       * currently-selected category. */
    selectValue.innerText = this.innerText;

    elementToggleFunc(select);
    filterFunc(selectedValue);

    /* Sync the desktop filter buttons with the dropdown selection so the
       * highlighted (active) state is always accurate, regardless of which
       * control the user interacts with. */
    if (lastClickedBtn) {
      lastClickedBtn.classList.remove("active");
    }

    const correspondingBtn = Array.from(filterBtn).find(
      (btn) => ((btn.dataset.filterValue || btn.innerText).toLowerCase().trim() === selectedValue)
    );

    if (correspondingBtn) {
      correspondingBtn.classList.add("active");
      lastClickedBtn = correspondingBtn;
    }

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = (this.dataset.filterValue || this.innerText).toLowerCase().trim();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// Fullscreen video function
function openFullscreen(video) {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.webkitRequestFullscreen) { /* Safari */
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) { /* IE11 */
    video.msRequestFullscreen();
  }
  
  // Play video when entering fullscreen
  video.play();
}

// Citation counter functionality
function fetchCitationCount() {
  const citationCountElement = document.getElementById('citationCount');
  const citationCounter = document.getElementById('citationCounter');
  
  // Check if we have a cached citation count
  const cachedData = getCachedCitationData();
  if (cachedData && cachedData.count) {
    // Use cached data if it's less than 24 hours old
    citationCountElement.textContent = formatCitationCount(cachedData.count);
    citationCounter.style.display = 'inline-flex';
    console.log('Using cached citation count:', cachedData.count);
    return;
  }
  
  // Show loading state
  citationCountElement.textContent = 'Loading...';
  citationCounter.style.display = 'inline-flex';
  
  const scholarUrl = 'https://scholar.google.com/citations?user=ufvAmAIAAAAJ&hl=en';
  
  // Try multiple approaches to get citation count
  tryJSONPFetch()
    .then(success => {
      if (!success) {
        return trySimpleProxy();
      }
      return true;
    })
    .then(success => {
      if (!success) {
        return tryAlternativeProxy();
      }
      return true;
    })
    .then(success => {
      if (!success) {
        // If all methods fail, hide the citation counter
        hideCitationCounter();
      }
    })
    .catch(error => {
      console.log('All citation fetch methods failed:', error);
      hideCitationCounter();
    });
}

// Cache management functions
function getCachedCitationData() {
  try {
    const cached = localStorage.getItem('scholar_citation_data');
    if (cached) {
      const data = JSON.parse(cached);
      const now = new Date().getTime();
      const cacheAge = now - data.timestamp;
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (cacheAge < oneDay) {
        return data;
      } else {
        // Cache expired, remove it
        localStorage.removeItem('scholar_citation_data');
      }
    }
  } catch (error) {
    console.log('Error reading cached citation data:', error);
    localStorage.removeItem('scholar_citation_data');
  }
  return null;
}

function setCachedCitationData(count) {
  try {
    const data = {
      count: count,
      timestamp: new Date().getTime()
    };
    localStorage.setItem('scholar_citation_data', JSON.stringify(data));
    console.log('Citation count cached:', count);
  } catch (error) {
    console.log('Error caching citation data:', error);
  }
}

function hideCitationCounter() {
  const citationCounter = document.getElementById('citationCounter');
  if (citationCounter) {
    citationCounter.style.display = 'none';
    console.log('Citation counter hidden due to fetch failure');
  }
}

// Method 1: Try JSONP approach
function tryJSONPFetch() {
  return new Promise((resolve) => {
    // This method typically doesn't work for Google Scholar but let's try a simple fetch first
    const citationCountElement = document.getElementById('citationCount');
    
    // Try a direct approach with no-cors mode (will be limited but might work)
    fetch('https://scholar.google.com/citations?user=ufvAmAIAAAAJ&hl=en', {
      mode: 'no-cors',
      method: 'GET'
    })
    .then(() => {
      // no-cors won't give us the content, so this won't work for parsing
      resolve(false);
    })
    .catch(() => {
      resolve(false);
    });
  });
}

// Method 2: Try a simpler proxy
function trySimpleProxy() {
  return new Promise((resolve) => {
    const citationCountElement = document.getElementById('citationCount');
    const scholarUrl = 'https://scholar.google.com/citations?user=ufvAmAIAAAAJ&hl=en';
    
    // Try with a different proxy service
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${scholarUrl}`;
    
    fetch(proxyUrl, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(html => {
      const citationCount = parseCitationFromHTML(html);
      if (citationCount) {
        citationCountElement.textContent = formatCitationCount(citationCount);
        setCachedCitationData(citationCount); // Cache the successful result
        resolve(true);
      } else {
        resolve(false);
      }
    })
    .catch(error => {
      console.log('Simple proxy fetch failed:', error);
      resolve(false);
    });
  });
}

// Method 3: Try alternative proxy
function tryAlternativeProxy() {
  return new Promise((resolve) => {
    const citationCountElement = document.getElementById('citationCount');
    const scholarUrl = 'https://scholar.google.com/citations?user=ufvAmAIAAAAJ&hl=en';
    
    // Try with thingproxy
    const proxyUrl = `https://thingproxy.freeboard.io/fetch/${scholarUrl}`;
    
    fetch(proxyUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(html => {
      const citationCount = parseCitationFromHTML(html);
      if (citationCount) {
        citationCountElement.textContent = formatCitationCount(citationCount);
        setCachedCitationData(citationCount); // Cache the successful result
        resolve(true);
      } else {
        resolve(false);
      }
    })
    .catch(error => {
      console.log('Alternative proxy fetch failed:', error);
      resolve(false);
    });
  });
}

// Parse citation count from HTML
function parseCitationFromHTML(html) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Look for citation count in Google Scholar page
    // Google Scholar typically shows citations in a table with specific selectors
    let citationElements = doc.querySelectorAll('#gsc_rsb_st .gsc_rsb_std');
    
    if (citationElements && citationElements.length > 0) {
      const citationText = citationElements[0].textContent.trim();
      const citationCount = parseInt(citationText.replace(/,/g, ''));
      if (!isNaN(citationCount)) {
        return citationCount;
      }
    }
    
    // Try alternative selectors
    citationElements = doc.querySelectorAll('.gsc_rsb_std');
    if (citationElements && citationElements.length > 0) {
      const citationText = citationElements[0].textContent.trim();
      const citationCount = parseInt(citationText.replace(/,/g, ''));
      if (!isNaN(citationCount)) {
        return citationCount;
      }
    }
    
    // Try to find citation count using regex
    const citationMatch = html.match(/Citations<\/td><td class="gsc_rsb_std">(\d+(?:,\d+)*)<\/td>/);
    if (citationMatch) {
      const citationCount = parseInt(citationMatch[1].replace(/,/g, ''));
      if (!isNaN(citationCount)) {
        return citationCount;
      }
    }
    
    return null;
  } catch (error) {
    console.log('Error parsing HTML:', error);
    return null;
  }
}

// Fallback method using a different proxy
function fallbackCitationFetch() {
  // This function is now integrated into the main flow
  hideCitationCounter();
}

// Show manual update option when automatic fetching fails
function showManualCitationUpdate() {
  // This function is replaced by hideCitationCounter()
  hideCitationCounter();
}

// Format citation count with proper number formatting
function formatCitationCount(count) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
}

// Initialize citation counter when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Add a small delay to ensure the page is fully loaded, but only fetch once
  setTimeout(() => {
    // Only fetch if we're on the researches page or if we don't have cached data
    const cachedData = getCachedCitationData();
    if (!cachedData) {
      fetchCitationCount();
    } else {
      // Show cached data immediately
      const citationCountElement = document.getElementById('citationCount');
      const citationCounter = document.getElementById('citationCounter');
      if (citationCountElement && citationCounter) {
        citationCountElement.textContent = formatCitationCount(cachedData.count);
        citationCounter.style.display = 'inline-flex';
      }
    }
  }, 1000);
});

// Don't refetch when navigating to researches page if we have cached data
document.addEventListener('click', function(e) {
  if (e.target.matches('[data-nav-link]') && e.target.textContent.toLowerCase() === 'researches') {
    const cachedData = getCachedCitationData();
    if (cachedData) {
      // Just show cached data, don't refetch
      const citationCountElement = document.getElementById('citationCount');
      const citationCounter = document.getElementById('citationCounter');
      if (citationCountElement && citationCounter) {
        citationCountElement.textContent = formatCitationCount(cachedData.count);
        citationCounter.style.display = 'inline-flex';
      }
    } else {
      // Only fetch if we don't have cached data
      setTimeout(fetchCitationCount, 500);
    }
  }
});