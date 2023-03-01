function showMessage(msg, success) {
  if (success) {
    return `
<div class="alert alert-success alert-dismissible fade show " role="alert" style="height: 3rem;  width:100%;">
    <h6 style="font-size:0.9rem;" class="text-center">
        ${msg}
    </h6>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close" style="width:1rem">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
`;
  } else {
    return `
<div class="alert alert-danger alert-dismissible fade show" role="alert"
    style="height: 3rem; width: 100%; ">
    <h6 style="font-size:0.9rem;" class="text-center">
        ${msg}
    </h6>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close"
        style="width:1rem">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
`;
  }
}
const formElem = document.getElementById('createUserForm');
const firstNameElem = document.getElementById('first_name');
const lastNameElem = document.getElementById('last_name');
const emailElem = document.getElementById('email');
const phoneElem = document.getElementById('phone');
const passwordElem = document.getElementById('password');
const confirmPasswordElem = document.getElementById('confirmPassword');
const genderElem = document.getElementById('gender');
const roleElem = document.getElementById('role');
const locationElem = document.getElementById('location');
const inputButtonElem = document.getElementById('inputButton');
//error message container

const errorPlaneElem = document.querySelector('.error-plane');
//spinner element
const spinnerElem = document.querySelector('.spinner');
spinnerElem.style.display = 'none';
formElem.addEventListener('submit', (event) => {
  event.preventDefault();
  inputButtonElem.disabled = true;
  spinnerElem.style.display = 'block';
  fetch('/admin/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      first_name: firstNameElem.value,
      last_name: lastNameElem.value,
      email: emailElem.value,
      phone: phoneElem.value,
      password: passwordElem.value,
      confirmPassword: confirmPasswordElem.value,
      gender: genderElem.value,
      user_type: roleElem.value,
      location: locationElem.value,
    }),
  })
    .then((response) => {
      console.log(response);

      if (!response) {
        errorPlaneElem.innerHTML = showMessage(
          'Sorry,Something Went Wrong!',
          false
        );
      } else {
        return response.json();
      }
    })
    .then((data) => {
      console.log(data);
      if (data) {
        errorPlaneElem.innerHTML = showMessage(data.msg, data.success);
        inputButtonElem.disabled = false;
        spinnerElem.style.display = 'none';
        errorPlaneElem.scrollIntoView({ behavior: 'smooth' });
      } else {
        inputButtonElem.disabled = false;
        spinnerElem.style.display = 'none';
        errorPlaneElem.innerHTML = showMessage(
          'Sorry,Something Went Wrong!',
          false
        );
        errorPlaneElem.scrollIntoView({ behavior: 'smooth' });
      }
    })
    .catch((error) => {
      if (error) {
        inputButtonElem.disabled = false;
        spinnerElem.style.display = 'none';
        errorPlaneElem.innerHTML = showMessage(error.msg, false);
        errorPlaneElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
});
