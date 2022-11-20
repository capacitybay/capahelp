function myFunction() {
  var x = document.getElementById('myLinks');
  if (x.style.display === 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';
  }
}
const toggleProfile = document.getElementById('toggleProfile');
const getProfile = document.querySelector('.show-profile');
const toggleNotification = document.getElementById('toggleNotification');
const notification = document.querySelector('#notification');

toggleProfile.addEventListener('click', (e) => {
  getProfile.classList.toggle('toggle-profile');
  toggleProfile.classList.toggle('a');
  console.log(e.target)
});

toggleNotification.addEventListener('click', (e) => {
  notification.classList.toggle('toggle-notification');
});
