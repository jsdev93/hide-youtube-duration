// Add hover listeners to thumbnails to re-hide overlays
document.querySelectorAll("ytd-thumbnail, #thumbnail").forEach((thumb) => {
  thumb.addEventListener("mouseover", hideDurations, { passive: true });
  thumb.addEventListener("mouseout", hideDurations, { passive: true });
});
// Hides video durations on YouTube thumbnails and video player
function hideDurations() {
  // Hide durations on thumbnails
  // Try all known selectors and also generic overlays
  const thumbnailSelectors = [
    ".yt-thumbnail-overlay-badge-view-model",
    ".yt-badge-shape__text",
  ];
  thumbnailSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.textContent = "";
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("visibility", "hidden", "important");
      el.style.setProperty("opacity", "0", "important");
    });
  });
  // Also try to hide overlays in shadow DOM
  document.querySelectorAll("ytd-thumbnail").forEach((thumb) => {
    if (thumb.shadowRoot) {
      thumb.shadowRoot
        .querySelectorAll(
          "ytd-thumbnail-overlay-time-status-renderer, span, div"
        )
        .forEach((el) => {
          el.textContent = "";
          el.style.setProperty("display", "none", "important");
          el.style.setProperty("visibility", "hidden", "important");
          el.style.setProperty("opacity", "0", "important");
        });
    }
  });

  // Hide duration in the video player
  const playerSelectors = [
    ".ytp-time-duration",
    ".ytp-time-display",
    ".ytp-chrome-bottom .ytp-time-duration",
    ".ytp-chrome-bottom .ytp-time-display",
  ];
  playerSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.style.visibility = "hidden";
    });
  });
}

// Observe DOM changes to hide durations dynamically
const observer = new MutationObserver(hideDurations);
observer.observe(document.body, { childList: true, subtree: true });

// Initial hide
hideDurations();
