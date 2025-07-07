// Toggle theme logic

function toggleTheme() {
    document.body.classList.toggle('light-theme');
}

// Custom dropdown logic

function initCustomTimezoneDropdown() {
  const dropdown = document.getElementById('timezone-dropdown');
  const selected = dropdown.querySelector('.selected');
  const options = dropdown.querySelectorAll('.dropdown-options li');

  selected.addEventListener('click', () => {
    dropdown.classList.toggle('open');
  });

  options.forEach(option => {
    option.addEventListener('click', () => {
      const value = option.dataset.value;
      const flagSrc = option.querySelector('img').src;
      const label = option.textContent.trim();

      selected.innerHTML = `
        <span class="label">${label}</span>
        <img src="${flagSrc}" alt="">
        <span class="arrow">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      `;

      dropdown.classList.remove('open');

      // Hook into existing timezone system:
      document.getElementById('timezone').value = value;
      selectedTimezone = value;
      updateTimezone();
    });
  });

  // Optional: Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
}

window.onload = () => {
  initCustomTimezoneDropdown();
};

// Change timezone logic

let selectedTimezone = 'Asia/Kolkata'; // Default to IST

function convertToTimezone(utcTime, tz = selectedTimezone) {
    const date = new Date(utcTime);
    const options = { timeZone: tz };

    const day = date.toLocaleString('en-IN', { ...options, day: 'numeric' });
    const month = date.toLocaleString('en-IN', { ...options, month: 'long' });
    const year = date.toLocaleString('en-IN', { ...options, year: 'numeric' });
    const time = date.toLocaleString('en-IN', { ...options, hour: 'numeric', minute: '2-digit', hour12: true });

    const dayWithSuffix = addOrdinalSuffix(parseInt(day));
    return `${dayWithSuffix} ${month}, ${year} ${time}`;
}


function addOrdinalSuffix(day) {
    if (day > 3 && day < 21) return day + 'th';
    switch (day % 10) {
    case 1: return day + 'st';
    case 2: return day + 'nd';
    case 3: return day + 'rd';
    default: return day + 'th';
    }
}

function createRaceCard(race, isCurrent = false) {
    let html = `<div class="race-card">
                <h2>${race.raceName} (${race.Circuit.Location.locality}, ${race.Circuit.Location.country})</h2>
                <p id="race"><strong>Race: ${convertToTimezone(race.date + 'T' + race.time)}</strong></p>`;

    if (race.FirstPractice) {
        html += `<p class="session">FP1: ${convertToTimezone(race.FirstPractice.date + 'T' + race.FirstPractice.time)}</p>`;
    }
    if (race.SecondPractice) {
        html += `<p class="session">FP2: ${convertToTimezone(race.SecondPractice.date + 'T' + race.SecondPractice.time)}</p>`;
    }
    if (race.ThirdPractice) {
        html += `<p class="session">FP3: ${convertToTimezone(race.ThirdPractice.date + 'T' + race.ThirdPractice.time)}</p>`;
    }
    if (race.Sprint) {
        html += `<p class="session"><strong>Sprint: ${convertToTimezone(race.Sprint.date + 'T' + race.Sprint.time)}</strong></p>`;
    }
    if (race.Qualifying) {
        html += `<p class="session">Qualifying: ${convertToTimezone(race.Qualifying.date + 'T' + race.Qualifying.time)}</p>`;
    }
    html += `</div>`;
    return html;
}

function updateTimezone() {
    selectedTimezone = document.getElementById('timezone').value;

    // Re-render all races
    document.getElementById('current-race').innerHTML = currentRace ? createRaceCard(currentRace, true) : '';
    document.getElementById('upcoming-races').innerHTML = upcoming
      .slice(0, shownCount)
      .map(r => createRaceCard(r)).join('');
}

// Fetching race details logic

let currentRace = null;
let upcoming = [];
let shownCount = 0;
const batchSize = 3;

fetch('https://api.jolpi.ca/ergast/f1/current.json')
  .then(response => response.json())
  .then(data => {
    const races = data.MRData.RaceTable.Races;
    const now = new Date();

    for (let race of races) {
      const raceDate = new Date(race.date + 'T' + race.time);
      if (!currentRace && raceDate > now) {
        currentRace = race;
      } else if (raceDate > now) {
        upcoming.push(race);
      }
    }

    // Display the current race
    if (currentRace) {
      document.getElementById('current-race').innerHTML = createRaceCard(currentRace, true);
    }

    // Progressive display setup
    const upcomingContainer = document.getElementById('upcoming-races');
    const showMoreBtn = document.getElementById('show-more-btn');

    const renderNextBatch = () => {
      const nextBatch = upcoming.slice(shownCount, shownCount + batchSize);
      upcomingContainer.innerHTML += nextBatch.map(r => createRaceCard(r)).join('');
      shownCount += nextBatch.length;

      // Hide button if no more races to show
      if (shownCount >= upcoming.length) {
        showMoreBtn.style.display = 'none';
      }
    };

    // Initial render
    if (upcoming.length > 0) {
      renderNextBatch();
      showMoreBtn.style.display = 'block';
      showMoreBtn.onclick = renderNextBatch;
    } else {
      showMoreBtn.style.display = 'none';
    }
  })
  .catch(err => {
    document.getElementById('current-race').innerHTML = '<p>Error loading schedule.</p>';
    console.error(err);
  });
