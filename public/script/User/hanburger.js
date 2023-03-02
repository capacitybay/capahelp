// ? INTRO AND SOLUTIONS JS:
const user = document.querySelector('.user');
const userDetails = document.querySelector('.user-details');
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.solution-nav');
const links = document.querySelectorAll('.main-navigation li a');

const xMark = document.querySelector('.x-mark');
const create = document.querySelector('.solutions-create');

hamburger.addEventListener('click', function () {
  nav.classList.add('display-nav');
  // bell.classList.add('display-links');
  create.classList.add('display-links');
  links.forEach(function (link) {
    link.classList.add('display-links');
  });

  user.classList.add('display-links');
  hamburger.classList.add('active-ham');
  xMark.classList.add('display-links');
});

xMark.addEventListener('click', function () {
  nav.classList.remove('display-nav');
  bell.classList.remove('display-links');
  create.classList.remove('display-links');
  links.forEach(function (link) {
    link.classList.remove('display-links');
  });

  user.classList.remove('display-links');
  hamburger.classList.remove('active-ham');
  xMark.classList.remove('display-links');
});

user.addEventListener('click', function () {
  userDetails.classList.toggle('load');
});
