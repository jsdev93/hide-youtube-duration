// background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ hideEnabled: true });
});
