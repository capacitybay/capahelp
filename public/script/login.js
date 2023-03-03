const inputField = document.getElementById('password');
const toggleView = document.querySelector('.toggleView');
let password = false;
function setPasswordState() {
  if (password) {
    inputField.setAttribute('type', 'password');
    toggleView.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
  } else {
    inputField.setAttribute('type', 'text');
    toggleView.innerHTML = '<i class="fa-solid fa-eye"></i>';
  }
  password = !password;
}
toggleView.addEventListener('click', setPasswordState);

function showMessage(msg, success) {
  if (success) {
    return `
        <div class="alert alert-success alert-dismissible fade show " role="alert"
        style="height: 3rem;   ">
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
        style="height: 3rem;  ">
            <h6 style="font-size:0.9rem;"  class="text-center">
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

const loginFormElem = document.getElementById('loginForm');
const emailElem = document.getElementById('email');
const passwordElem = document.getElementById('password');
const loginSubmitElem = document.getElementById('loginSubmit');
//error plane
const errorPlaneElem = document.querySelector('.error-plane');
console.log(loginSubmitElem);
//spinner element
const spinnerElem = document.querySelector('.spinner');
spinnerElem.style.display = 'none';
loginSubmitElem.addEventListener('click', function (event) {
  event.preventDefault();
  loginSubmitElem.disabled = true;
  spinnerElem.style.display = 'block';

  fetch('/login', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      email: emailElem.value,
      password: passwordElem.value,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data) {
        function changeUrl(url) {
          let splitUrl = window.location.toString();
          return splitUrl.replace(/login/, url);
        }
        loginSubmitElem.disabled = false;
        spinnerElem.style.display = 'none';
        if (data.success) {
          if (data.user_type === 3) {
            window.location.href = changeUrl('admin/dashboard');
          } else {
            window.location.href = changeUrl('user');
          }
        } else {
          if ((data.user_type === 3 || data.user_type === 0) && data.payload) {
            errorPlaneElem.innerHTML = showMessage(data.payload, false);
          } else {
            errorPlaneElem.innerHTML = showMessage(data.payload.message, false);

            loginSubmitElem.disabled = false;
            spinnerElem.style.display = 'none';
          }
        }
      } else {
        errorPlaneElem.innerHTML = showMessage(
          'Sorry, Something Went Wrong Pls Try Again.',
          false
        );
        loginSubmitElem.disabled = false;
        spinnerElem.style.display = 'none';
      }
    })
    .catch((error) => {
      if (error) {
        loginSubmitElem.disabled = false;
        spinnerElem.style.display = 'none';
        errorPlaneElem.innerHTML = showMessage(
          'Sorry!, Something Went Wrong Pls Try Again',
          false
        );
      }
    });
});
