//send message to open localhost:8000 on click
document.addEventListener("DOMContentLoaded", function () {
  const openNewTabButton = document.getElementById("popoutButton");
  openNewTabButton.addEventListener("click", function () {
    chrome.scripting.executeScript({
      target: { tabId: (tabId) => tabId},
      function: openNewTab
    });
  });
});
function openNewTab() {
  chrome.runtime.sendMessage({ action: "openNewTab" });
}

//get html on message_received === getHTML
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'getHTML') {
    const html = document.documentElement.outerHTML;
    chrome.runtime.sendMessage({ action: 'htmlResponse', html: html });
  }
});