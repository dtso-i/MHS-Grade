//send message to open localhost:8000 on click
document.addEventListener("DOMContentLoaded", function () {
  const openNewTabButton = document.getElementById("popoutButton");
  openNewTabButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTabId = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId: currentTabId},
        function: openNewTab
      });
    });
  });
});
function openNewTab() {
  chrome.runtime.sendMessage({ action: "openNewTab" });
}

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
  if(request.action == "dataStored"){
    console.log('data stored');
  }
})