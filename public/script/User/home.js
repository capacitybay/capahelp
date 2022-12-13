// ? INTRO AND SOLUTIONS JS:
const user = document.querySelector('.user');
const userDetails = document.querySelector('.user-details');
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
const links = document.querySelectorAll('nav ul li');
const bell = document.querySelector('.fa-bell');

hamburger.addEventListener('click', function () {
  nav.classList.toggle('display-nav');
  bell.classList.toggle('display-links');
  links.forEach(function (link) {
    link.classList.toggle('display-links');
  });
  user.classList.toggle('display-links');
  hamburger.classList.toggle('active-ham');
});

user.addEventListener('click', function () {
  userDetails.classList.toggle('load');
});
