//sends getHTML on tab update
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('https:\/\/maranathahighschool.myschoolapp.com\/app\/student#studentmyday\/progress')) {
    executeContentScript(tabId);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "openNewTab") {
    chrome.tabs.create({ url: "http://localhost:8000" }); //opens new tab to the link
  }
  else if (request.action === 'htmlResponse') {
    const filteredData = processData(request.grades, request.subjects); //sends semi-filtered data to processData
  }
});

function executeContentScript(tabId){ //executes content.js on the current tab
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["content.js"],
  });
  console.log("script executed");
}
function processData(rgrades, rsubjects){ //fully filters and stores data
  if (!(rgrades && rsubjects)){
    return
  }
  var data = {};
  let readyData = {};
  for(let i=0; i<rgrades.length;i++){
    rgrades[i] = rgrades[i].replace('%','');
    rgrades[i] = rgrades[i].replace(' ','');
    rgrades[i] = rgrades[i].replace(' ','');
    rsubjects[i] = rsubjects[i].replace('<h3>','');
    rsubjects[i] = rsubjects[i].replace('</h3>','');
  }
  rsubjects.splice(rgrades.length+1,rsubjects.length-rgrades.length)
  for(let i=0; i<rgrades.length; i++){
    data[rsubjects[i]] = rgrades[i];
  }
  console.log(data);

//untested below --------
  window.webkitRequestFileSystem(window.PERSISTENT, 1024**2, function(fs) {
    fs.root.getFile('data.json',function(fileEntry){
      fileEntry.file(function(file) {
        let reader = new FileReader();
        reader.onloadend = function() {
          var jsonData = JSON.parse(this.result);
        };
      })
      fileEntry.createWriter(function(fileWriter) {
        let count = Object.keys(jsonData).length++;
        let writeData = {};
        writeData[count] = {"data": data, "timestamp": Date()};
        let data = new Blob([JSON.stringify(writeData)],{type: 'application/json'});
        fileWriter.write(data);
      })
    })
  })


/*
  try {
    chrome.storage.local.get(["counter"]).then((result) => {
      var ecounter = result.key++;
    });
  } catch (e) {
    console.log(`expected error? \n ${e}`);
    var ecounter = 0;
  }
  readyData[ecounter] = {data: data, time: Date()};
  chrome.storage.local.set(readyData);
  chrome.storage.local.set({"counter": ecounter});
  console.log(readyData);
  chrome.storage.local.get(["counter"]).then((result) => {
    console.log(result.key);
  });
  console.log(chrome.storage.local.get([chrome.storage.local.get(["counter"])]))
*/
}