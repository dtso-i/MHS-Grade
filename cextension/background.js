//sends getHTML on tab update
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('https://maranathahighschool.myschoolapp.com/app/student#studentmyday/progress')) {
    chrome.tabs.sendMessage(tabId, { action: 'getHTML' });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "openNewTab") {
    chrome.tabs.create({ url: "http://localhost:8000" });
  }
  if (message.action === 'htmlResponse') {
    const filteredHTML = processHTML(message.html);
  }
});

function processHTML(html){
  window.alert(html)
  //filter the html
  //store data
  //make another html
}