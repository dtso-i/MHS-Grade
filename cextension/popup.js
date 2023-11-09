//open localhost:8000 on click
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

