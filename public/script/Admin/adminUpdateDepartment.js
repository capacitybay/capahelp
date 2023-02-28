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
style="height: 3rem; width:100%;">
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
const errorPlaneElem = document.querySelector('.error-plane');

const deleteMember = (id) => {
  fetch(`/department/remove_agent/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => error.message);
};
let members = [];
getMembers.forEach((member) => members.push(member._id));
console.log(members);

if (document.querySelectorAll('.cancel__Icon')) {
  document.querySelectorAll('.cancel__Icon').forEach((element) => {
    members.push(element.getAttribute('id').trim());
    element.addEventListener('click', (event) => {
      console.log(element.getAttribute('id').trim());
      let urlString = window.location.href.split('/');

      let deptId = urlString[urlString.length - 1].trim();
      fetch(`/department/remove/agent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          deptId: deptId,
          agentId: element.getAttribute('id').trim(),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            errorPlaneElem.innerHTML = showMessage(data.payload, data.success);
            element.remove();
            errorPlaneElem.scrollIntoView({ behavior: 'smooth' });
          } else {
            errorPlaneElem.innerHTML = showMessage(data.payload, data.success);
          }
        })
        .catch((error) => {
          errorPlaneElem.innerHTML = showMessage(
            'Sorry,Something Went Wrong',
            false
          );
        });
      let elementIndex = members.indexOf(element.getAttribute('id').trim());
      members.splice(elementIndex, 1);
    });
  });
}

//this stores the members selected
const deptNameElem = document.getElementById('dept_name');
const agentElem = document.getElementById('headAgent');
const emailElem = document.getElementById('email');
const statusElem = document.getElementById('status');
const submitBtnElem = document.getElementById('submitBtn');
//error message container
//spinner element
const spinnerElem = document.querySelector('.spinner');
spinnerElem.style.display = 'none';
let urlString = window.location.href.split('/');

let deptId = urlString[urlString.length - 1].trim();

const displayUsersElem = document.getElementById('displayUsers');

/**
 * *@params-{accepts select input}
 * * fn: selects single or multiple agents from the system
 */
function selected(select) {
  //creates  span and list element
  let spanElem = document.createElement('span');
  let listElem = document.createElement('li');
  //gets the text content and value of select option
  let selectedText = select.options[select.selectedIndex].text;
  let selectedValue = select.options[select.selectedIndex].value;
  //sets id attribute to the value gotten from select option  span element
  spanElem.setAttribute('id', selectedValue);

  console.log('qwerty', spanElem.getAttribute('id'));
  spanElem.classList.add('span');
  listElem.className = 'fa-solid fa-xmark deleteIcon';
  //adds event listener for individual icons
  listElem.addEventListener('click', (event) => {
    spanElem.remove();
    let elementIndex = members.indexOf(spanElem.getAttribute('id').trim());
    members.splice(elementIndex, 1);
  });
  //appends cancel icon to span element
  spanElem.appendChild(listElem);
  //appends  member's name to span element
  spanElem.append(selectedText);
  //checks id member is already selected before appending a specified member
  if (!document.getElementById(selectedValue)) {
    displayUsersElem.appendChild(spanElem);
    //populate the members array with the selected members ids
    members.push(select.options[select.selectedIndex].value.trim());
  } else {
    //alerts error if selected member already exists in the selection list
    alert(`Agent, " ${selectedText}" already exist!`);
  }
}

var actionButton = document.getElementById('actionButton');
function request(action) {
  fetch(`/admin/${action}/department/${deptId}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      dept_name: deptNameElem.value,
      head_agent: agentElem.value,
      email: emailElem.value,
      status: statusElem.value,
      members: members.length > 0 ? members : [],
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      members.length = 0;
      if (data) {
        errorPlaneElem.innerHTML = showMessage(data.msg, data.success);
        submitBtnElem.disabled = false;
        spinnerElem.style.display = 'none';
        errorPlaneElem.scrollIntoView({ behavior: 'smooth' });
      } else {
        errorPlaneElem.innerHTML = showMessage(
          'Sorry, we encountered an error while processing your request. Please try again later',
          false
        );
        submitBtnElem.disabled = false;
        spinnerElem.style.display = 'none';
        errorPlaneElem.scrollIntoView({ behavior: 'smooth' });
      }
    })
    .catch((error) => {
      if (error) {
        submitBtnElem.disabled = false;
        spinnerElem.style.display = 'none';
        errorPlaneElem.innerHTML = showMessage(
          'Sorry, we encountered an error while processing your request. Please try again later',
          false
        );
        errorPlaneElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
}

submitBtnElem.addEventListener('click', (event) => {
  event.preventDefault();
  spinnerElem.style.display = 'block';
  request('update');
});
