// still in testing

const ticketsLink = document.getElementById('ticketsLink');
const activeTicketLink = document.getElementById('activeTicketLink');
const cancelledTicketsLink = document.getElementById('cancelledTicketsLink');
const resolvedTicketsLink = document.getElementById('resolvedTicketsLink');
const inProgressTicketLink = document.getElementById('inProgressTicketLink');
const pendingTicketsLink = document.getElementById('pendingTicketsLink');

const button = document.getElementById('button');

button.addEventListener('click', (e) => {
  console.log(button.dataset.ticket);
  window.location.href = '/admin/view/ticket/' + button.dataset.ticket;
});

ticketsLink.addEventListener(
  'click',
  (e) => {
    window.location.href = ticketsLink.dataset.url;
    e.preventDefault();
  },
  true
);
activeTicketLink.addEventListener(
  'click',
  (e) => {
    window.location.href = activeTicketLink.dataset.url;
    e.preventDefault();
  },
  true
);
cancelledTicketsLink.addEventListener(
  'click',
  (e) => {
    window.location.href = cancelledTicketsLink.dataset.url;
    e.preventDefault();
  },
  true
);
resolvedTicketsLink.addEventListener(
  'click',
  (e) => {
    window.location.href = resolvedTicketsLink.dataset.url;
    e.preventDefault();
  },
  true
);
inProgressTicketLink.addEventListener(
  'click',
  (e) => {
    window.location.href = inProgressTicketLink.dataset.url;
    e.preventDefault();
  },
  true
);
pendingTicketsLink.addEventListener(
  'click',
  (e) => {
    window.location.href = pendingTicketsLink.dataset.url;
    e.preventDefault();
  },
  true
);
// function getUrl(e, url) {

//   window.location.href = url;
//   e.target.classList.add('bg-color');
//   e.preventDefault();
//   e.stopImmediatePropagation();
// }
// window.location.href='/ticket/list'
