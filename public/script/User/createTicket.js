function showMessage(msg, success) {
  if (success) {
    return `
    <div class="alert alert-success alert-dismissible fade show " role="alert"
    style="height: 3rem;  ">
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
    style="height: 3rem; ">
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

const createTicketFormElem = document.getElementById('createTicketForm');
const ticketTypeElem = document.getElementById('ticketType');
const ticketTitleElem = document.getElementById('ticketTitle');
const emailElem = document.getElementById('email');
const priorityElem = document.getElementById('priority');
const descriptionElem = document.getElementById('description');
const submitBtnElem = document.getElementById('submitBtn');
//error message container
const errorPlaneElem = document.querySelector('.error-plane');
//spinner element
const spinnerElem = document.querySelector('.spinner');
spinnerElem.style.display = 'none';
submitBtnElem.addEventListener('click', function (event) {
  submitBtnElem.disabled = true;
  spinnerElem.style.display = 'block';

  event.preventDefault();
  //console.log(submitBtnElem.getAttributeNames())

  //set loader
  fetch('/user/create/ticket', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      ticket_type: ticketTypeElem.value,
      title: ticketTitleElem.value,
      customer_id: emailElem.value,
      priority: priorityElem.value,
      description: descriptionElem.value,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data) {
        errorPlaneElem.innerHTML = showMessage(data.msg, data.success);
        submitBtnElem.disabled = false;
        spinnerElem.style.display = 'none';
        errorPlaneElem.scrollIntoView({ behavior: 'smooth' });
      }
    })
    .catch((error) => {
      if (error) {
        submitBtnElem.disabled = false;
        spinnerElem.style.display = 'none';
        errorPlaneElem.innerHTML = showMessage(error.msg, false);
        errorPlaneElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
});
