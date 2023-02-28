function showMessage(msg, success) {
  if (success) {
    return `
<div class="alert alert-success alert-dismissible fade show " role="alert"
style="height: 3rem; width:100%;  ">
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
style="height: 3rem; width:100%;  ">
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

const submitElem = document.getElementById('submit');
const spinnerElem = document.querySelector('.spinner');
const formElem = document.getElementById('formElem');
const firstNameElem = document.getElementById('firstName');
const lastNameElem = document.getElementById('lastName');
const emailElem = document.getElementById('profile-email');
const phoneElem = document.getElementById('phone');
const locationElem = document.getElementById('location');
//userId
const userIdElem = document.getElementById('userId');
//error plane
const errorPlaneElem = document.querySelector('.error-plane');
//select email with checkbox

const selectEmailElem = document.getElementById('selectEmail');
const mainElem = document.getElementById('main');

spinnerElem.style.display = 'none';

submitElem.addEventListener('click', function (event) {
  const id = userIdElem.value;

  async function updateRequest(arg) {
    submitElem.disabled = true;
    spinnerElem.style.display = 'block';

    fetch(`/user/update/profile/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify({
        first_name: firstNameElem.value.trim(),
        last_name: lastNameElem.value.trim(),
        email: emailElem.value.trim(),
        phone: phoneElem.value.trim(),
        location: locationElem.value.trim(),
        checkEmail: selectEmailElem.checked,
      }),
    })
      .then((response) => {
        console.log(response);
        //location.reload()

        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data) {
          submitElem.disabled = false;
          spinnerElem.style.display = 'none';
          errorPlaneElem.innerHTML = showMessage(data.msg, data.success);
          mainElem.scrollIntoView({ behavior: 'smooth' });
        }
      })
      .catch((error) => {
        errorPlaneElem.innerHTML = showMessage(
          'Sorry, Something Went Wrong Pls Try Again',
          false
        );
        submitElem.disabled = false;
        spinnerElem.style.display = 'none';
      });
  }
  updateRequest(undefined);
});
