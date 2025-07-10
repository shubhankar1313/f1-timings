export function initChangelogReveal() {
  const btn = document.getElementById("show-more-btn");
  const hidden = document.getElementById("changelog-hidden");

  if (btn && hidden) {
    btn.addEventListener("click", () => {
      hidden.style.display = "block";
      btn.style.display = "none";
    });
  }
}
