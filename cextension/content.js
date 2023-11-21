//get html on message_received === getHTML
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getHTML") {
    window.alert("getHTML received")
    const grades = document.querySelectorAll("h3.showGrade");
    const subjects = document.querySelectorAll(".row .row .col-md-3 a");
    sendResponse({ content: [grades,subjects] });
  }
});