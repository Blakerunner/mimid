// background.js

// default voice and speed options
let voice = "Matthew";
let speed = "medium";
let audioUrl = "";

// when first installing this extension set some varibles in storage to be
// accessable at the user level
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(
    { voice: voice, speed: speed, audioUrl: audioUrl },
    () => {
      console.log(`Default voice set to ${voice}`);
      console.log(`Default speed set to ${speed}`);
    }
  );
});
