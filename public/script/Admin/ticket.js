// still in testing

const ticketsLink = document.getElementById('ticketsLink');
const activeTicketLink = document.getElementById('activeTicketLink');
const cancelledTicketsLink = document.getElementById('cancelledTicketsLink');
const resolvedTicketsLink = document.getElementById('resolvedTicketsLink');
const inProgressTicketLink = document.getElementById('inProgressTicketLink');
const pendingTicketsLink = document.getElementById('pendingTicketsLink');

const button = document.getElementById('button');
function getElementIds() {}
const ticketId = document.querySelectorAll('.view-ticket');
ticketId.forEach((element, idx) => {
  //let id = element.value.trim();
  element.addEventListener('click', (e) => {
    let id = element.dataset.ticket.trim();
    console.log(element.dataset.ticket);
    window.location.href = `/admin/view/ticket/${id}`;
  });
});

ticketsLink.addEventListener(
  'click',
  function (event) {
    event.preventDefault();
    window.location.href = ticketsLink.dataset.url;
  },
  true
);
activeTicketLink.addEventListener('click', function (event) {
  event.preventDefault();

  window.location.href = activeTicketLink.dataset.url;
});
cancelledTicketsLink.addEventListener(
  'click',
  (event) => {
    // event.preventDefault();
    window.location.href = cancelledTicketsLink.dataset.url;
  },
  true
);
resolvedTicketsLink.addEventListener('click', function (event) {
  event.preventDefault();

  window.location.href = resolvedTicketsLink.dataset.url;
});
inProgressTicketLink.addEventListener('click', (e) => {
  window.location.href = inProgressTicketLink.dataset.url;
  // e.preventDefault();
});
pendingTicketsLink.addEventListener('click', (event) => {
  event.preventDefault();

  window.location.href = pendingTicketsLink.dataset.url;
});
