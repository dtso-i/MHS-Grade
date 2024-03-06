var rawdata = getData();
if(typeof rawdata === "undefined"){
  //no data
}

let data = rawdata[0];
let settings = rawdata[1];


var setGrades = filteredData[0];
var setTimestamp = filteredData[1];
var subjectColors = filteredData[2];
var gradeSets = [];
for (let i=0;i<Object.keys(setGrades).length;i++){ //for loop for setGrades to make it suitable for datasets
  let gradeSet = {};
  gradeSet[label] = Object.keys(setGrades[i])[0]; //subject
  gradeSet[data] = (typeof Object.values(setGrades[i])[0] === "object") ? Object.values(Object.values(setGrades[i])[0]) : Object.values(setGrades[i])[0]; //grades
  gradeSet[borderColor] = subjectColors[i];
  gradeSets.push(gradeSet);
}
const ctx = document.getElementById('gradeChart');
new Chart(ctx, {
  type: settings,//-------------------------
  data: {
    labels: function (){
      let setCount = [];
      for (let i=1;i<setTimestamp.length++;i++){
        setCount.push(i);
      }
      return setCount;
    },
    datasets: gradeSets
  },
  options: {
    legend: {display: false}, //create legend separately with a func to option colors for each subjects
    plugins: {
      tooltip: {
        enabled: true,
        callback: {
           label: function (context){
            let index = context.dataset.dataIndex;
            return setTimestamp[index];
          }
        }
      }
    }
  }
})


function getData(){ //note: show "timestamp" on hover of a data point
  let data = [];
    chrome.storage.local.get().then(function(result){
      data.push(result.data);
      data.push(result.settings);
    })
  return data;
}

