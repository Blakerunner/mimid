// background.js

// default voice option
let voice = "Nicole";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ voice });
  console.log(`Default voice set to ${voice}`);
});
