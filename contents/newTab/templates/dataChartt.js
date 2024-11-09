/*var rawdata = getData();
if(rawdata[0].timestamp.length < 0){
  //no data
}else{structGraph(rawdata)}*/

/*  let data = rawdata[0];
let settings = rawdata[1];*/
let data = {grades:[[101,89,94],[97,93,89],[93,91,96]],subjects:["English","Math","AP CS"],timestamp:['ts1','ts2','ts3']};
let settings = {type:'line',color:['#ff6485', '#34a0eb', '#ffcc57', '#4cc0c1', '#9a67fe', '#c9cbce', '#ff9f3f'],theme:'#191819',graphColor:'#1f1f1f'};
let setGradesRaw = data.grades;
let setTimestamp = data.timestamp;
let subjects = data.subjects;

let setGrades = [];
for (let i=0;i<subjects.length;i++){ //for loop for setGrades to make it suitable for datasets
  let grade = {};
  grade.label = subjects[i];
  grade.data = setGradesRaw[i];
  grade.borderColor = settings.color[i];
  grade.backgroundColor = settings.graphColor;
  setGrades.push(grade);
}
const ctx = document.getElementById('gradeChart');
new Chart(ctx, {
  type: settings.type,
  data: {
    labels: setTimestamp,
    datasets: setGrades
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
});


function getData(){ //note: show "timestamp" on hover of a data point
  let data = [];
    chrome.storage.local.get().then(function(result){
      data.push(result.data);
      data.push(result.settings);
    })
  return data;
}

