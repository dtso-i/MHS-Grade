//sends getHTML on tab update
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('https:\/\/maranathahighschool.myschoolapp.com\/app\/student#studentmyday\/progress')) {
    executeContentScript(tabId);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "openNewTab") {
    chrome.tabs.create({ url: "http://localhost:8000" });
  }
  else if (request.action === 'htmlResponse') {
    const filteredData = processData(request.grades, request.subjects);
  }
});
function executeContentScript(tabId){
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["content.js"],
  });
  console.log("script executed");
}
function processData(rgrades, rsubjects){
  if (!(rgrades && rsubjects)){
    return
  }
  let data = {};
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
/*
  try {
    chrome.storage.local.get(["counter"]).then((result) => {
      let ecounter = result.key;
      ecounter++;
    });
  } catch (e) {
    console.log(`expected error? \n ${e}`);
    const ecounter = 0;
  }
  chrome.storage.local.set({ecounter: {data: data, time: Date()}});
  chrome.storage.local.set({"counter": ecounter});
  console.log({ecounter: {data: data, time: Date()}});
*/
  //make another html
}