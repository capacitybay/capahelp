function myFunction() {
  var x = document.getElementById('myLinks');
  if (x.style.display === 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';
  }
}
const profile = document.getElementById('toggleProfile');
const getProfile = document.querySelector('.show-profile');
profile.addEventListener('click', (e) => {
  getProfile.classList.toggle('toggle-profile');
});
