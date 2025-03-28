//
// demo.js
// Theme module
//

import { Collapse, Popover } from 'bootstrap';

const popover = document.querySelector('#popoverDemo');
const form = document.querySelector('#offcanvasDemo');
const topnav = document.querySelector('#topnav');
const topbar = document.querySelector('#topbar');
const sidebar = document.querySelector('#sidebar');
const sidebarSmall = document.querySelector('#sidebarSmall');
const sidebarUser = document.querySelector('#sidebarUser');
const sidebarUserSmall = document.querySelector('#sidebarSmallUser');
const sidebarSizeContainer = document.querySelector('#sidebarSizeContainer');
const navPositionToggle = document.querySelectorAll('input[name="navPosition"]');
const containers = document.querySelectorAll('[class^="container"]');

const config = {
  showPopover: localStorage.getItem('dashkitShowPopover') ? localStorage.getItem('dashkitShowPopover') : true,
  colorScheme: localStorage.getItem('dashkitColorScheme') ? localStorage.getItem('dashkitColorScheme') : 'light',
  navPosition: localStorage.getItem('dashkitNavPosition') ? localStorage.getItem('dashkitNavPosition') : 'sidenav',
  navColor: localStorage.getItem('dashkitNavColor') ? localStorage.getItem('dashkitNavColor') : 'default',
  sidebarSize: localStorage.getItem('dashkitSidebarSize') ? localStorage.getItem('dashkitSidebarSize') : 'base',
};

const sidebarSizeCollapse = sidebarSizeContainer ? new Collapse(sidebarSizeContainer) : null;

function togglePopover() {
  if (popover) {
    const showPopover = JSON.parse(config.showPopover) && config.sidebarSize === 'base';

    const demoPopover = new Popover(popover, {
      offset: [0, 16],
      placement: 'top',
      customClass: 'popover-lg d-none d-md-block',
      trigger: 'manual',
      container: document.getElementById('popoverDemoContainer'),
    });

    // Show popover on load
    if (showPopover) {
      demoPopover.show();
    }

    // Hide popover on click
    popover.addEventListener('click', function () {
      if (showPopover) {
        demoPopover.hide();
      }

      localStorage.setItem('dashkitShowPopover', false);
    });
  }
}

function parseUrl() {
  const search = window.location.search.substring(1);
  const params = search.split('&');

  for (let i = 0; i < params.length; i++) {
    const arr = params[i].split('=');
    const prop = arr[0];
    const val = arr[1];

    if (prop == 'colorScheme' || prop == 'navPosition' || prop == 'navColor' || prop == 'sidebarSize') {
      // Save to localStorage
      localStorage.setItem('dashkit' + prop.charAt(0).toUpperCase() + prop.slice(1), val);

      // Update local variables
      config[prop] = val;
    }
  }
}

function toggleColorScheme(colorScheme) {
  const colorTheme = colorScheme === 'light' ? '' : 'dark';
  document.documentElement.setAttribute('data-bs-theme', colorTheme);
}

function toggleNavPosition(navPosition) {
  if (topnav && topbar && sidebar && sidebarSmall && sidebarUser && sidebarUserSmall) {
    if (navPosition == 'topnav') {
      hideNode(topbar);
      hideNode(sidebar);
      hideNode(sidebarSmall);

      for (let i = 0; i < containers.length; i++) {
        containers[i].classList.remove('container-fluid');
        containers[i].classList.add('container');
      }
    } else if (navPosition == 'combo') {
      hideNode(topnav);
      hideNode(sidebarUser);
      hideNode(sidebarUserSmall);

      for (let i = 0; i < containers.length; i++) {
        containers[i].classList.remove('container');
        containers[i].classList.add('container-fluid');
      }
    } else if (navPosition == 'sidenav') {
      hideNode(topnav);
      hideNode(topbar);

      for (let i = 0; i < containers.length; i++) {
        containers[i].classList.remove('container');
        containers[i].classList.add('container-fluid');
      }
    }
  }
}

function toggleNavColor(navColor) {
  if (sidebar && sidebarSmall && topnav) {
    const colorTheme = navColor === 'default' ? '' : navColor === 'vibrant' ? 'vibrant' : config.colorScheme === 'light' ? 'dark' : 'light';

    sidebar.parentNode.setAttribute('data-bs-theme', colorTheme);
    sidebarSmall.parentNode.setAttribute('data-bs-theme', colorTheme);
    topnav.parentNode.setAttribute('data-bs-theme', colorTheme);
  }
}

function toggleSidebarSize(sidebarSize) {
  if (sidebarSize == 'base') {
    hideNode(sidebarSmall);
  } else if (sidebarSize == 'small') {
    hideNode(sidebar);
  }
}

function toggleFormControls(form, colorScheme, navPosition, navColor, sidebarSize) {
  form.querySelector('[name="colorScheme"][value="' + colorScheme + '"]').checked = true;
  form.querySelector('[name="navPosition"][value="' + navPosition + '"]').checked = true;
  form.querySelector('[name="navColor"][value="' + navColor + '"]').checked = true;
  form.querySelector('[name="sidebarSize"][value="' + sidebarSize + '"]').checked = true;
}

function toggleSidebarSizeContainer(navPosition) {
  if (navPosition == 'topnav') {
    sidebarSizeCollapse.hide();
  } else {
    sidebarSizeCollapse.show();
  }
}

function submitForm(form) {
  const colorScheme = form.querySelector('[name="colorScheme"]:checked').value;
  const navPosition = form.querySelector('[name="navPosition"]:checked').value;
  const navColor = form.querySelector('[name="navColor"]:checked').value;
  const sidebarSize = form.querySelector('[name="sidebarSize"]:checked').value;

  // Save data to localStorage
  localStorage.setItem('dashkitColorScheme', colorScheme);
  localStorage.setItem('dashkitNavPosition', navPosition);
  localStorage.setItem('dashkitNavColor', navColor);
  localStorage.setItem('dashkitSidebarSize', sidebarSize);

  // Reload page
  window.location = window.location.pathname;
}

function hideNode(node) {
  node && node.setAttribute('style', 'display: none !important');
}

//
// Events
//

// Toggle popover
togglePopover();

// Parse url
parseUrl();

// Toggle color scheme
toggleColorScheme(config.colorScheme);

// Toggle nav position
toggleNavPosition(config.navPosition);

// Toggle sidebar color
toggleNavColor(config.navColor);

// Toggle sidebar size
toggleSidebarSize(config.sidebarSize);

// Toggle form controls
if (form) {
  toggleFormControls(form, config.colorScheme, config.navPosition, config.navColor, config.sidebarSize);
}

// Toggle sidebarSize container
if (sidebarSizeContainer) {
  toggleSidebarSizeContainer(config.navPosition);
}

// Enable body
document.body.style.display = 'block';

if (form) {
  // Form submitted
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    submitForm(form);
  });

  // Nav position changed
  navPositionToggle.forEach(function (toggle) {
    toggle.parentElement.addEventListener('click', function () {
      const navPosition = toggle.value;

      toggleSidebarSizeContainer(navPosition);
    });
  });
}
