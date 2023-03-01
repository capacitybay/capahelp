async function request(action) {
  const data = await fetch(`/admin/${action}/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  document.location.reload();
}
var actionButton = document.getElementById('actionButton');
var userId = document.getElementById('userId').value.trim();

actionButton.addEventListener('click', (event) => {
  if (
    actionButton.textContent.trim().toLocaleLowerCase() === 'deactivate user'
  ) {
    request('deactivate');
  } else {
    request('reactivate');
  }
});
