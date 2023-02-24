// ! TICKETS JS:
const ticketBtn = Array.from(document.querySelectorAll('.ticket-toggles div'));
const ticketToggles = document.querySelector('.ticket-toggles');
const dashBoard = document.querySelector('.dashboard');
const ellipsis = document.querySelector('.ellipsis');

const data = parsedTickets;
var monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

ticketBtn[0].addEventListener('click', function () {
  var d;
  var m;
  var y;
  let hr;
  let mins;
  // console.log(m);
  ticketBtn[0].classList.add('active-ticket');
  if (data.length > 0) {
    dashBoard.innerHTML = '';
    data?.forEach((ticket) => {
      const date = new Date(ticket.createdAt);
      d = date.getDate();
      m = monthNames[date.getMonth()];
      y = date.getFullYear();
      hr = parseInt(date.getHours());
      mins = date.getMinutes();
      dashBoard.innerHTML += `
      <div class="track">
        <div class="ids">
            <div class="ids-top">
                <h1>${ticket.title}</h1>
                <p>TicketId: ${ticket._id}</p>
            </div>
            <div class="ids-bottom">
           ${
             d +
             ' ' +
             m +
             ' ' +
             y +
             ' ' +
             (hr > 12 ? hr - 12 : hr) +
             ' :'.trim() +
             mins +
             ':' +
             (hr > 12 ? ' PM' : 'AM')
           }
            </div>
        </div>
        <div class="track-info green">Resolved</div>
      </div>
      `;
    });
  } else {
    dashBoard.innerHTML = '';
    dashBoard.innerHTML = `
    <div class="error__display">
      <h1>
          Nothing To Display  
      </h1>
    
    </div>
    `;
  }
});
ticketBtn[1].addEventListener('click', function () {
  var d;
  var m;
  var y;
  let hr;
  let mins;
  ticketBtn[1].classList.add('active-ticket');
  let activeTickets = [];

  data.forEach((ticket) => {
    if (
      ticket.hasOwnProperty('ticket_status') &&
      ticket.ticket_status === 'active'
    ) {
      activeTickets.push(ticket);
    }
  });
  if (activeTickets.length > 0) {
    activeTickets?.forEach((ticket) => {
      const date = new Date(ticket.createdAt);
      d = date.getDate();
      m = monthNames[date.getMonth()];
      y = date.getFullYear();
      hr = parseInt(date.getHours());
      mins = date.getMinutes();
      dashBoard.innerHTML = '';

      dashBoard.innerHTML = `
    <div class="track">
    <div class="ids">
        <div class="ids-top">
            <h1>${ticket.title}</h1>
            <p>TickedId: ${ticket._id}</p>
    
        </div>
        <div class="ids-bottom">
        ${
          d +
          ' ' +
          m +
          ' ' +
          y +
          ' ' +
          (hr > 12 ? hr - 12 : hr) +
          ' :'.trim() +
          mins +
          ':' +
          (hr > 12 ? ' PM' : 'AM')
        }
        </div>
    </div>
    <div class="track-info yellow">Active</div>
  </div>
  `;
    });
  } else {
    dashBoard.innerHTML = '';
    dashBoard.innerHTML = `
    <div class="error__display">
      <h1>
          Nothing To Display  
      </h1>
    
    </div>
    `;
  }
});
ticketBtn[2].addEventListener('click', function () {
  var d;
  var m;
  var y;
  let hr;
  let mins;
  ticketBtn[2].classList.add('active-ticket');
  let activeTickets = [];

  data.forEach((ticket) => {
    if (
      ticket.hasOwnProperty('ticket_status') &&
      ticket.ticket_status === 'cancelled'
    ) {
      activeTickets.push(ticket);
    }
  });

  if (activeTickets.length > 0) {
    activeTickets?.forEach((ticket) => {
      const date = new Date(ticket.createdAt);
      d = date.getDate();
      m = monthNames[date.getMonth()];
      y = date.getFullYear();
      hr = parseInt(date.getHours());
      mins = date.getMinutes();
      dashBoard.innerHTML = '';

      dashBoard.innerHTML = `
    <div class="track">
    <div class="ids">
        <div class="ids-top">
            <h1>${ticket.title}</h1>
            <p>TickedId: ${ticket._id}</p>
    
        </div>
        <div class="ids-bottom">
        ${
          d +
          ' ' +
          m +
          ' ' +
          y +
          ' ' +
          (hr > 12 ? hr - 12 : hr) +
          ' :'.trim() +
          mins +
          ':' +
          (hr > 12 ? ' PM' : 'AM')
        }
        </div>
    </div>
    <div class="track-info yellow">Cancelled</div>
  </div>
  `;
    });
  } else {
    dashBoard.innerHTML = '';
    dashBoard.innerHTML = `
    <div class="error__display">
      <h1>
          Nothing To Display  
      </h1>
    
    </div>
    `;
  }
});
ticketBtn[3].addEventListener('click', function () {
  var d;
  var m;
  var y;
  let hr;
  let mins;
  ticketBtn[3].classList.add('active-ticket');
  let activeTickets = [];

  data.forEach((ticket) => {
    if (
      ticket.hasOwnProperty('ticket_status') &&
      ticket.ticket_status === 'resolved'
    ) {
      activeTickets.push(ticket);
    }
  });

  if (activeTickets.length > 0) {
    activeTickets?.forEach((ticket) => {
      const date = new Date(ticket.createdAt);
      d = date.getDate();
      m = monthNames[date.getMonth()];
      y = date.getFullYear();
      hr = parseInt(date.getHours());
      mins = date.getMinutes();
      dashBoard.innerHTML = '';

      dashBoard.innerHTML = `
    <div class="track">
    <div class="ids">
        <div class="ids-top">
            <h1>${ticket.title}</h1>
            <p>TickedId: ${ticket._id}</p>
    
        </div>
        <div class="ids-bottom">
        ${
          d +
          ' ' +
          m +
          ' ' +
          y +
          ' ' +
          (hr > 12 ? hr - 12 : hr) +
          ' :'.trim() +
          mins +
          ':' +
          (hr > 12 ? ' PM' : 'AM')
        }
        </div>
    </div>
    <div class="track-info yellow">Resolved</div>
  </div>
  `;
    });
  } else {
    dashBoard.innerHTML = '';
    dashBoard.innerHTML = `
    <div class="error__display">
      <h1>
          Nothing To Display  
      </h1>
    
    </div>
    `;
  }
});
ticketBtn[4].addEventListener('click', function () {
  var d;
  var m;
  var y;
  let hr;
  let mins;
  ticketBtn[4].classList.add('active-ticket');
  let activeTickets = [];

  data.forEach((ticket) => {
    if (
      ticket.hasOwnProperty('ticket_status') &&
      ticket.ticket_status === 'in progress'
    ) {
      activeTickets.push(ticket);
    }
  });

  if (activeTickets.length > 0) {
    activeTickets?.forEach((ticket) => {
      const date = new Date(ticket.createdAt);
      d = date.getDate();
      m = monthNames[date.getMonth()];
      y = date.getFullYear();
      hr = parseInt(date.getHours());
      mins = date.getMinutes();
      dashBoard.innerHTML = '';

      dashBoard.innerHTML = `
    <div class="track">
    <div class="ids">
        <div class="ids-top">
            <h1>${ticket.title}</h1>
            <p>TickedId: ${ticket._id}</p>
    
        </div>
        <div class="ids-bottom">
        ${
          d +
          ' ' +
          m +
          ' ' +
          y +
          ' ' +
          (hr > 12 ? hr - 12 : hr) +
          ' :'.trim() +
          mins +
          ':' +
          (hr > 12 ? ' PM' : 'AM')
        }
        </div>
    </div>
    <div class="track-info yellow">In Progress</div>
  </div>
  `;
    });
  } else {
    dashBoard.innerHTML = '';
    dashBoard.innerHTML = `
    <div class="error__display">
      <h1>
          Nothing To Display  
      </h1>
    
    </div>
    `;
  }
});
ticketBtn[5].addEventListener('click', function () {
  var d;
  var m;
  var y;
  let hr;
  let mins;
  ticketBtn[5].classList.add('active-ticket');
  let activeTickets = [];

  data.forEach((ticket) => {
    if (
      ticket.hasOwnProperty('ticket_status') &&
      ticket.ticket_status === 'pending'
    ) {
      activeTickets.push(ticket);
    }
  });

  if (activeTickets.length > 0) {
    activeTickets?.forEach((ticket) => {
      const date = new Date(ticket.createdAt);
      d = date.getDate();
      m = monthNames[date.getMonth()];
      y = date.getFullYear();
      hr = parseInt(date.getHours());
      mins = date.getMinutes();
      dashBoard.innerHTML = '';

      dashBoard.innerHTML = `
    <div class="track">
    <div class="ids">
        <div class="ids-top">
            <h1>${ticket.title}</h1>
            <p>TickedId: ${ticket._id}</p>
    
        </div>
        <div class="ids-bottom">
        ${
          d +
          ' ' +
          m +
          ' ' +
          y +
          ' ' +
          (hr > 12 ? hr - 12 : hr) +
          ' :'.trim() +
          mins +
          ':' +
          (hr > 12 ? ' PM' : 'AM')
        }
        </div>
    </div>
    <div class="track-info yellow">Pending</div>
  </div>
  `;
    });
  } else {
    dashBoard.innerHTML = '';
    dashBoard.innerHTML = `
    <div class="error__display">
      <h1>
          Nothing To Display  
      </h1>
    
    </div>
    `;
  }
});

ticketToggles.onclick = function (e) {
  if (e.target !== ticketBtn[0] && e.target !== ticketToggles) {
    ticketBtn[0].classList.remove('active-ticket');
  }
  if (e.target !== ticketBtn[1] && e.target !== ticketToggles) {
    ticketBtn[1].classList.remove('active-ticket');
  }
  if (e.target !== ticketBtn[2] && e.target !== ticketToggles) {
    ticketBtn[2].classList.remove('active-ticket');
  }
  if (e.target !== ticketBtn[3] && e.target !== ticketToggles) {
    ticketBtn[3].classList.remove('active-ticket');
  }
  if (e.target !== ticketBtn[4] && e.target !== ticketToggles) {
    ticketBtn[4].classList.remove('active-ticket');
  }
  if (e.target !== ticketBtn[5] && e.target !== ticketToggles) {
    ticketBtn[5].classList.remove('active-ticket');
  }
};

ellipsis.addEventListener('click', function () {
  ticketToggles.classList.add('show-toggle');
  ticketToggles.classList.remove('none');
});

ticketToggles.addEventListener('click', function () {
  ticketToggles.classList.add('none');
});
