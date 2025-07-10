export function toggleTheme() {
  const html = document.documentElement;
  const currentIsLight = html.classList.contains('light-theme');

  if (currentIsLight) {
    html.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
  }
}

export function applyStoredTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-theme');
  }
}
