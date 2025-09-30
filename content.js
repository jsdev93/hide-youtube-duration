const THUMBNAIL_SELECTORS = [
  ".yt-thumbnail-overlay-badge-view-model",
  ".yt-badge-shape__text",
];
const PLAYER_SELECTORS = [
  ".ytp-time-duration",
  ".ytp-time-display",
  ".ytp-chrome-bottom .ytp-time-duration",
  ".ytp-chrome-bottom .ytp-time-display",
];
const PROGRESS_BAR_SELECTOR = ".ytp-progress-bar-container";
const PROGRESS_BAR_STYLE_ID = "hyd-progress-bar-style";

function injectProgressBarStyle() {
  if (!document.getElementById(PROGRESS_BAR_STYLE_ID)) {
    const style = document.createElement("style");
    style.id = PROGRESS_BAR_STYLE_ID;
    style.textContent = `${PROGRESS_BAR_SELECTOR} { display: none !important; visibility: hidden !important; opacity: 0 !important; }`;
    document.head.appendChild(style);
  }
}

function removeProgressBarStyle() {
  const style = document.getElementById(PROGRESS_BAR_STYLE_ID);
  if (style) style.remove();
}

function setStyles(elements, styles) {
  elements.forEach((el) => {
    for (const [prop, value] of Object.entries(styles)) {
      el.style.setProperty(prop, value, "important");
    }
  });
}

function removeStyles(elements, props) {
  elements.forEach((el) => {
    props.forEach((prop) => el.style.removeProperty(prop));
  });
}

function handleThumbnails(hide) {
  const styleProps = ["display", "visibility", "opacity"];
  if (hide) {
    THUMBNAIL_SELECTORS.forEach((selector) => {
      setStyles(document.querySelectorAll(selector), {
        display: "none",
        visibility: "hidden",
        opacity: "0",
      });
    });
    document.querySelectorAll("ytd-thumbnail").forEach((thumb) => {
      if (thumb.shadowRoot) {
        setStyles(
          thumb.shadowRoot.querySelectorAll(
            "ytd-thumbnail-overlay-time-status-renderer, span, div"
          ),
          { display: "none", visibility: "hidden", opacity: "0" }
        );
      }
    });
  } else {
    THUMBNAIL_SELECTORS.forEach((selector) => {
      removeStyles(document.querySelectorAll(selector), styleProps);
    });
    document.querySelectorAll("ytd-thumbnail").forEach((thumb) => {
      if (thumb.shadowRoot) {
        removeStyles(
          thumb.shadowRoot.querySelectorAll(
            "ytd-thumbnail-overlay-time-status-renderer, span, div"
          ),
          styleProps
        );
      }
    });
  }
}

function handlePlayerDurations(hide) {
  if (hide) {
    PLAYER_SELECTORS.forEach((selector) => {
      setStyles(document.querySelectorAll(selector), { visibility: "hidden" });
    });
  } else {
    PLAYER_SELECTORS.forEach((selector) => {
      removeStyles(document.querySelectorAll(selector), ["visibility"]);
    });
  }
}

function handleProgressBar(hide) {
  if (hide) {
    injectProgressBarStyle();
  } else {
    removeProgressBarStyle();
    removeStyles(document.querySelectorAll(PROGRESS_BAR_SELECTOR), [
      "display",
      "visibility",
      "opacity",
    ]);
  }
}

function hideDurations() {
  try {
    chrome.storage.sync.get(
      ["hideEnabled", "hideProgressBar"],
      function (result) {
        handleThumbnails(!!result.hideEnabled);
        handlePlayerDurations(!!result.hideEnabled);
        handleProgressBar(!!result.hideProgressBar);
      }
    );
  } catch (e) {
    // Suppress extension context invalidated errors
    // console.error(e);
  }
}

function addHoverListeners() {
  document.querySelectorAll("ytd-thumbnail, #thumbnail").forEach((thumb) => {
    thumb.addEventListener("mouseover", hideDurations, { passive: true });
    thumb.addEventListener("mouseout", hideDurations, { passive: true });
  });
}
addHoverListeners();

// Observe DOM changes to hide durations dynamically
const observer = new MutationObserver(hideDurations);
observer.observe(document.body, { childList: true, subtree: true });

// Initial hide
hideDurations();
