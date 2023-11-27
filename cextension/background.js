//sends getHTML on tab update
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('https:\/\/maranathahighschool.myschoolapp.com\/app\/student#studentmyday\/progress')) {
    executeContentScript(tabId);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "openNewTab") {
    chrome.tabs.create(".\\newTab\\popup.html"); //opens new tab to the link
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
  if (rgrades.length < 6){
    return
  } else {
    try { // non first time
      let json = fetch('data.json') //object
      .then(response => response.json())
      .catch(error => {return error});
      var color = Object.values(Object.keys(Object.keys(json)[Object.keys(json).length-1].data))
    } catch { // first time
      var color = ['#ff6485','#34a0eb','#ffcc57','#4cc0c1','#9a67fe','#c9cbce','#ff9f3f'];
    }
  }
  var data = {};
  for(let i=0; i<rgrades.length;i++){
    rgrades[i] = rgrades[i].replace('%','');
    rgrades[i] = rgrades[i].replace(' ','');
    rgrades[i] = rgrades[i].replace(' ','');
    rsubjects[i] = rsubjects[i].replace('<h3>','');
    rsubjects[i] = rsubjects[i].replace('</h3>','');
  }
  rsubjects.splice(rgrades.length+1,rsubjects.length-rgrades.length)
  let subject = {};
  for(let i=0; i<rgrades.length; i++){
    subject[rsubjects[i]] = color[i];
    data[subject] = rgrades[i];
    subject = {};
  }
  //object data = {{{subject:color}:grade},{{subject:color}:grade},{{subject:color}:grade}}
  console.log(data);

//untested below --------
/*
  window.webkitRequestFileSystem(window.PERSISTENT, 1024**2, function(fs) {
    fs.root.getFile('data.json',function(fileEntry){
      fileEntry.file(function(file) {
        let reader = new FileReader();
        reader.onloadend = function() {
          var jsonData = JSON.parse(this.result);
        };
      })
      fileEntry.createWriter(function(fileWriter) {
        let count = Object.keys(jsonData).length;
        let writeData = {};
        let date = Date().split(' ');
        writeData[count] = {"data": data, "timestamp": `${date[2]} ${date[1]} ${date[3]}, ${date[4]}(${date[5]})`};
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