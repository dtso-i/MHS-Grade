chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
  if(request.action == "dataStored"){
    console.log('data stored');
  }
})

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('openBtn').addEventListener('click', function(){
    chrome.runtime.openOptionsPage();
  });
  console.log('popup.js loaded');
});

