import { addOrdinalSuffix } from './utils.js';
import { selectedTimezone } from './timezone.js';

let currentRace = null;
let upcoming = [];
let shownCount = 0;
const batchSize = 2;

export function convertToTimezone(utcTime, tz = selectedTimezone) {
  const date = new Date(utcTime);
  const options = { timeZone: tz };

  const day = date.toLocaleString('en-IN', { ...options, day: 'numeric' });
  const month = date.toLocaleString('en-IN', { ...options, month: 'long' });
  const year = date.toLocaleString('en-IN', { ...options, year: 'numeric' });
  const time = date.toLocaleString('en-IN', { ...options, hour: 'numeric', minute: '2-digit', hour12: true });

  return `${addOrdinalSuffix(parseInt(day))} ${month}, ${year} ${time}`;
}

export function createRaceCard(race, isCurrent = false) {
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
  if (race.SprintQualifying) {
    html += `<p class="session">Sprint Qualifying: ${convertToTimezone(race.SprintQualifying.date + 'T' + race.SprintQualifying.time)}</p>`;
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

export function updateTimezone() {
  document.getElementById('current-race').innerHTML = currentRace ? createRaceCard(currentRace, true) : '';
  document.getElementById('upcoming-races').innerHTML = upcoming
    .slice(0, shownCount)
    .map(r => createRaceCard(r)).join('');
}

export function fetchAndRenderRaces() {
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

      if (currentRace) {
        document.getElementById('current-race').innerHTML = createRaceCard(currentRace, true);
      }

      const upcomingContainer = document.getElementById('upcoming-races');
      const showMoreBtn = document.getElementById('show-more-btn');

      const renderNextBatch = () => {
        const nextBatch = upcoming.slice(shownCount, shownCount + batchSize);
        upcomingContainer.innerHTML += nextBatch.map(r => createRaceCard(r)).join('');
        shownCount += nextBatch.length;

        if (shownCount >= upcoming.length) {
          showMoreBtn.style.display = 'none';
        }
      };

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
}
