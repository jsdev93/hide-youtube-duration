// popup.js

const toggle = document.getElementById("toggleHide");
const toggleProgress = document.getElementById("toggleProgress");

chrome.storage.sync.get(["hideEnabled", "hideProgressBar"], function (result) {
  toggle.checked = result.hideEnabled !== false;
  toggleProgress.checked = result.hideProgressBar === true;
});

toggle.addEventListener("change", function () {
  chrome.storage.sync.set({ hideEnabled: toggle.checked });
});

toggleProgress.addEventListener("change", function () {
  chrome.storage.sync.set({ hideProgressBar: toggleProgress.checked });
});
