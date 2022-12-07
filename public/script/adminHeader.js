/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById('mySidebar').style.width = '300px';
  document.getElementById('main').style.marginLeft = '100px';
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById('mySidebar').style.width = '0';
  document.getElementById('main').style.marginLeft = '0';
}

const toggleProfile = document.getElementById('toggleProfile');
const getProfile = document.querySelector('.show-profile');

toggleProfile.addEventListener('click', (e) => {
  getProfile.classList.toggle('toggle-profile');
  toggleProfile.classList.toggle('a');
});

// sticky header
window.onscroll = function () {
  myFunction();
};

var navbar = document.getElementById('navbar');
var sticky = navbar.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add('sticky');
  } else {
    navbar.classList.remove('sticky');
  }
}
