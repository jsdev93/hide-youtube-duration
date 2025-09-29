// popup.js
const toggle = document.getElementById("toggleHide");

chrome.storage.sync.get(["hideEnabled"], function (result) {
  toggle.checked = result.hideEnabled !== false;
});

toggle.addEventListener("change", function () {
  chrome.storage.sync.set({ hideEnabled: toggle.checked });
});
