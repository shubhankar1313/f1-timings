export function loadFooter() {
  fetch('static/components/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-placeholder').innerHTML = data;
      requestAnimationFrame(updateDynamicFooterLink);
    })
    .catch(error => {
      console.error("Failed to load footer:", error);
    });
}

export function updateDynamicFooterLink() {
  const dynamicLink = document.getElementById("dynamic-footer-link");
  if (dynamicLink) {
    if (window.location.pathname.includes("changelog.html")) {
      dynamicLink.href = "index.html";
      dynamicLink.textContent = "Home";
    } else {
      dynamicLink.href = "changelog.html";
      dynamicLink.textContent = "Changelog";
    }
  }
}
