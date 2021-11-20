// background.js

// default voice option
let voice = "Matthew";
let speed = "medium";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ speed });
  chrome.storage.sync.set({ voice });
  console.log(`Default voice set to ${voice}`);
  console.log(`Default spped set to ${speed}`);
});
