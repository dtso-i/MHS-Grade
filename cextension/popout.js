//send message to open localhost:8000 on click
function pbtn(){
  document.getElementById('pr').innerHTML = "bbbbbbbbbb";
  window.open('http://localhost:8000');
}

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
  if(request.action == "dataStored"){
    console.log('data stored');
  }
})