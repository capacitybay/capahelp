// ! TICKETS JS:
const ticketBtn = Array.from(document.querySelectorAll('.ticket-toggles div'));
const ticketToggles = document.querySelector('.ticket-toggles');
const dashBoard = document.querySelector('.dashboard');
const ellipsis = document.querySelector('.ellipsis');

ticketBtn[0].addEventListener('click', function () {
  ticketBtn[0].classList.add('active-ticket');
  dashBoard.innerHTML = `
  <div class="track">
  <div class="ids">
      <div class="ids-top">
          <h1>I want to Create a Website-</h1>
          <p>TickedId: 2</p>
      </div>
      <div class="ids-bottom">
          Created on Thu, 22 Sep 2022 9:05PM
      </div>
  </div>
  <div class="track-info yellow">In Progress</div>
</div>
<div class="track">
  <div class="ids">
      <div class="ids-top">
          <h1>I need Help with Install... - </h1>
          <p>TicketId: 4</p>
      </div>
      <div class="ids-bottom">
          Created on Web, 28 Sep 2022 2:30PM
      </div>
  </div>
  <div class="track-info green">Resolved</div>
</div>
<div class="track">
  <div class="ids">
      <div class="ids-top">
          <h1>I need Help with configur... </h1>
          <p>TicketId: 8</p>
      </div>
      <div class="ids-bottom">
          Created on Tue, 27 Sep 2022 5:30PM
      </div>
  </div>
  <div class="track-info yellow">Planning</div>
</div>
<div class="track">
  <div class="ids">
      <div class="ids-top">
          <h1>I want to Create a Website-</h1>
          <p>TicketId: 12</p>
      </div>
      <div class="ids-bottom">
          Created on Mon, 26 Sep 2022 8:10PM
      </div>
  </div>
  <div class="track-info pink">Canceled</div>
</div>
</div>`;
});
ticketBtn[1].addEventListener('click', function () {
  ticketBtn[1].classList.add('active-ticket');
  dashBoard.innerHTML = `
  <div class="track">
  <div class="ids">
      <div class="ids-top">
          <h1>I want to Create a Website-</h1>
          <p>TickedId: 2</p>
      </div>
      <div class="ids-bottom">
          Created on Thu, 22 Sep 2022 9:05PM
      </div>
  </div>
  <div class="track-info yellow">In Progress</div>
</div>
<div class="track">
  <div class="ids">
      <div class="ids-top">
          <h1>I need Help with configur... </h1>
          <p>TicketId: 8</p>
      </div>
      <div class="ids-bottom">
          Created on Tue, 27 Sep 2022 5:30PM
      </div>
  </div>
  <div class="track-info yellow">Planning</div>
</div>`;
});
ticketBtn[2].addEventListener('click', function () {
  ticketBtn[2].classList.add('active-ticket');
  dashBoard.innerHTML = `
  <div class="track">
  <div class="ids">
      <div class="ids-top">
          <h1>I want to Create a Website-</h1>
          <p>TicketId: 12</p>
      </div>
      <div class="ids-bottom">
          Created on Mon, 26 Sep 2022 8:10PM
      </div>
  </div>
  <div class="track-info pink">Canceled</div>
</div>
</div>`;
});
ticketBtn[3].addEventListener('click', function () {
  ticketBtn[3].classList.add('active-ticket');
  dashBoard.innerHTML = `
  <div class="track">
  <div class="ids">
      <div class="ids-top">
          <h1>I need Help with Install... - </h1>
          <p>TicketId: 4</p>
      </div>
      <div class="ids-bottom">
          Created on Web, 28 Sep 2022 2:30PM
      </div>
  </div>
  <div class="track-info green">Resolved</div>
</div>`;
});
ticketBtn[4].addEventListener('click', function () {
  ticketBtn[4].classList.add('active-ticket');
  dashBoard.innerHTML = `
  <div class="track">
  <div class="ids">
      <div class="ids-top">
          <h1>I want to Create a Website-</h1>
          <p>TickedId: 2</p>
      </div>
      <div class="ids-bottom">
          Created on Thu, 22 Sep 2022 9:05PM
      </div>
  </div>
  <div class="track-info yellow">In Progress</div>
</div>`;
});
ticketBtn[5].addEventListener('click', function () {
  ticketBtn[5].classList.add('active-ticket');
  dashBoard.innerHTML = `
  <div class="track">
  <div class="ids">
      <div class="ids-top">
          <h1>I need Help with configur... </h1>
          <p>TicketId: 8</p>
      </div>
      <div class="ids-bottom">
          Created on Tue, 27 Sep 2022 5:30PM
      </div>
  </div>
  <div class="track-info yellow">Planning</div>
</div>`;
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
