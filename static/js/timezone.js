import { updateTimezone } from './races.js';

export let selectedTimezone = 'Asia/Kolkata';

export function initCustomTimezoneDropdown() {
  const dropdown = document.getElementById('timezone-dropdown');
  if (!dropdown) return;
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      `;

      dropdown.classList.remove('open');
      document.getElementById('timezone').value = value;
      selectedTimezone = value;
      updateTimezone();
    });
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
}
