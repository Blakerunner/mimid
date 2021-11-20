// background.js

// default voice option
let voice = "Matthew";
let speed = "medium";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ data: { speed: speed, voice: voice } });
  console.log(`Default voice set to ${voice}`);
  console.log(`Default spped set to ${speed}`);
});
