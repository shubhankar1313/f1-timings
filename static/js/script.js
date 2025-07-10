import { toggleTheme, applyStoredTheme } from './theme.js';
import { initCustomTimezoneDropdown } from './timezone.js';
import { fetchAndRenderRaces } from './races.js';
import { loadFooter, updateDynamicFooterLink } from './footer.js';
import { initChangelogReveal } from './changelog.js';

window.addEventListener("DOMContentLoaded", () => {
  applyStoredTheme();
  loadFooter();
  initCustomTimezoneDropdown();
  initChangelogReveal();
  fetchAndRenderRaces();
  updateDynamicFooterLink();

  const themeButton = document.querySelector('.toggle-button');
  if (themeButton) {
    themeButton.addEventListener('click', toggleTheme);
  }
});
