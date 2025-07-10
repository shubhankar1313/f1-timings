export async function initChangelogReveal() {
  const container = document.getElementById("changelog-updates");
  const showMoreBtn = document.getElementById("show-more-btn");

  try {
    const res = await fetch("static/data/changelog.json");
    const data = await res.json();

    let shownCount = 0;
    const batchSize = 3;

    function renderEntries(entries) {
      return entries.map(entry => {
        const items = entry.entries.map(e => `<li>${e}</li>`).join("");
        return `
          <div class="changelog-group">
            <h3 class="changelog-date">${entry.date}</h3>
            <ul>${items}</ul>
          </div>`;
      }).join("");
    }

    function revealNextBatch() {
      const nextBatch = data.slice(shownCount, shownCount + batchSize);
      container.innerHTML += renderEntries(nextBatch);
      shownCount += batchSize;

      if (shownCount >= data.length) {
        showMoreBtn.style.display = "none";
      }
    }

    revealNextBatch(); // initial render
    showMoreBtn.addEventListener("click", revealNextBatch);

  } catch (err) {
    container.innerHTML = "<p>Failed to load changelog.</p>";
    console.error(err);
  }
}
