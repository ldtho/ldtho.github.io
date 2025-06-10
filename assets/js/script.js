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

// Media loading functionality
document.addEventListener('DOMContentLoaded', function() {
  // Handle image loading
  const images = document.querySelectorAll('.media-container img.loading');
  images.forEach(img => {
    const loadingOverlay = img.parentElement.querySelector('.loading-overlay');
    
    // Function to hide loading overlay
    const hideLoading = () => {
      img.classList.remove('loading');
      img.style.opacity = '1';
      if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
      }
    };
    
    // Check if image is already loaded (cached)
    if (img.complete) {
      hideLoading();
    } else {
      // Add load event listener
      img.addEventListener('load', hideLoading);
      img.addEventListener('error', hideLoading); // Hide loading even on error
    }
  });
  
  // Handle video loading
  const videos = document.querySelectorAll('.media-container video.loading');
  videos.forEach(video => {
    const loadingOverlay = video.parentElement.querySelector('.loading-overlay');
    
    // Function to hide loading overlay
    const hideLoading = () => {
      video.classList.remove('loading');
      video.style.opacity = '1';
      if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
      }
    };
    
    // Add event listeners for video loading
    video.addEventListener('loadeddata', hideLoading);
    video.addEventListener('canplay', hideLoading);
    video.addEventListener('error', hideLoading); // Hide loading even on error
    
    // Check if video is already loaded
    if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
      hideLoading();
    }
  });
});