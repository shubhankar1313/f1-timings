function toggleTheme() {
    document.body.classList.toggle('light-theme');
}

function convertToIST(utcTime) {
    const date = new Date(utcTime);
    const options = { timeZone: 'Asia/Kolkata' };

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
                <p><strong>Date:</strong> ${convertToIST(race.date + 'T' + race.time)}</p>`;

    if (race.FirstPractice) {
    html += `<p class="session">FP1: ${convertToIST(race.FirstPractice.date + 'T' + race.FirstPractice.time)}</p>`;
    }
    if (race.SecondPractice) {
    html += `<p class="session">FP2: ${convertToIST(race.SecondPractice.date + 'T' + race.SecondPractice.time)}</p>`;
    }
    if (race.ThirdPractice) {
    html += `<p class="session">FP3: ${convertToIST(race.ThirdPractice.date + 'T' + race.ThirdPractice.time)}</p>`;
    }
    if (race.Sprint) {
    html += `<p class="session">Sprint: ${convertToIST(race.Sprint.date + 'T' + race.Sprint.time)}</p>`;
    }
    if (race.Qualifying) {
    html += `<p class="session">Qualifying: ${convertToIST(race.Qualifying.date + 'T' + race.Qualifying.time)}</p>`;
    }
    html += `</div>`;
    return html;
}

fetch('https://api.jolpi.ca/ergast/f1/current.json')
    .then(response => response.json())
    .then(data => {
    const races = data.MRData.RaceTable.Races;
    const now = new Date();
    let currentRace = null;
    const upcoming = [];

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

    const upcomingHTML = upcoming.map(r => createRaceCard(r)).join('');
    document.getElementById('upcoming-races').innerHTML = upcomingHTML;
    })
    .catch(err => {
    document.getElementById('current-race').innerHTML = '<p>Error loading schedule.</p>';
    console.error(err);
    });