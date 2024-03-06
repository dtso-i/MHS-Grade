chrome.tabs.onActivated.addListener(function (activeInfo) { //on tab change
  chrome.tabs.query({status: 'complete',url:'https:\/\/maranathahighschool.myschoolapp.com\/app\/student#studentmyday\/progress'}, ([tab]) => {
    executeContentScript(activeInfo.tabId);
  })
});

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){ //on link change in the tab
  if(changeInfo.status === 'complete' && tab.url && tab.url.startsWith('https:\/\/maranathahighschool.myschoolapp.com\/app\/student#studentmyday\/progress')){
    executeContentScript(tabId);
  }
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "openNewTab") {
    chrome.tabs.create(".\\newTab\\popup.html"); //opens new tab to the link
  }
  else if (request.action === 'htmlResponse') {
    processData(request.grades, request.subjects); //sends semi-filtered data to processData
  }
});

function executeContentScript(tabId){ //executes content.js on the current tab
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["content.js"],
  });
  console.log("* script executed");
}

function processData(rgrades, rsubjects){ //fully filters data
  if (rgrades.length < 6 || !(rgrades) || typeof rgrades === "undefined"){
    return;
  } else {
    for(let i=0; i<rgrades.length;i++){
      rgrades[i] = rgrades[i].replace('%','');
      rgrades[i] = rgrades[i].replace(' ','');
      rgrades[i] = rgrades[i].replace(' ','');
      rsubjects[i] = rsubjects[i].replace('<h3>','');
      rsubjects[i] = rsubjects[i].replace('</h3>','');
    }
    rsubjects.splice(rgrades.length,rsubjects.length-rgrades.length)
    var data = {subjects:rsubjects,grades:rgrades};
    console.log(data);
    //storeData(data);
  }
}

async function storeData(newData){ //stores data
  let finalData = {};
  await chrome.storage.local.get(["data"]).then((result) => {
    let grade = [[],[],[],[],[],[],[]];
    let time = Date().split(' ');
    try{
      let glength = result.data.grades.length;
      if(JSON.stringify(result.data.subject)!==JSON.stringify(newData.subjects)){
        //changed subjects midway
      }
      let notRepeated = false;
      for(let i=0;i<glength;i++){ //compare data
        let sub = result.data.grades[i];
        grade[i] = sub;
        if(sub[sub.length-1] != newData.grades[i]){
          notRepeated = true;
        }
      }
      if(notRepeated){ //append data
        for(let i=0;i<glength;i++){
          grade[i].push(newData.grades[i]);
        }
      }else{
        return 'repeated';
      }
      let ntimestamps = result.data.timestamps;
      ntimestamps.push(`${time[2]} ${time[1]} ${time[3]} ${time[0]}`)

      finalData.grades = grade;
      finalData.subjects = result.data.subjects;
      finalData.timestamps = ntimestamps;
    }catch(e){ //first time (no previous entries)
      for(let i=0;i<newData.grades.length;i++){
        grade[i].push([newData.grades[i]]);
      }
      let ntimestamps = [`${time[2]} ${time[1]} ${time[3]} ${time[0]}`];
      
      finalData.grades = grade;
      finalData.subjects = newData.subjects;
      finalData.timestamps = ntimestamps;

      settings = { //first time (default)
        color:['#ff6485','#34a0eb','#ffcc57','#4cc0c1','#9a67fe','#c9cbce','#ff9f3f'],
        theme:'#'
      };
      chrome.storage.local.set({settings:nsettings});
    }
  });
  chrome.storage.local.set({data:finalData});
}