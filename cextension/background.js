//sends getHTML on tab update
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('https:\/\/maranathahighschool.myschoolapp.com\/app\/student#studentmyday\/progress')) {
    chrome.tabs.sendMessage(tabId, { action: 'getHTML' });
    console.log('target webite')
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

function processData(rgrades, rsubjects){
  var grades,subjects = [];
  var data = {};
  console.log(typeof rgrades);
  console.log(rgrades)
  rgrades.forEach(function(element) {
    var grade = element.innerHTML;
    grades.push(grade);
    console.log(grade);
  });
  try {
    rsubjects.forEach(function(element) {
      var subject = element.innerHTML;
      subjects.push(subject);
      console.log(subject);
      if (subjects.length == 7) throw breakException;
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }
  for (var i = 0;i < 7;i++) {
    const dgrade = grades[i];
    const dsubject = subjects[i];
    data[dsubject] = dgrade;
  }
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
  //make another html
}