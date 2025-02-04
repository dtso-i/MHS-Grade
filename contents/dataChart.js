function getData(){ //note: show "timestamp" on hover of a data point
  let data = [];
  chrome.storage.local.get().then(function(result){
    console.log("Data retrieved from storage:", result);
    data.push(result.data);
    data.push(result.settings);
    // Initialize the chart here if needed
  }).catch(function(error) {
    console.error("Error retrieving data from storage:", error);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const ctx = document.getElementById('gradeChart');

  /*var rawdata = getData();
  if(rawdata[0].timestamp.length < 0){
    //no data
  }else{structGraph(rawdata)}*/

  /*  let data = rawdata[0];
  let settings = rawdata[1];*/
  console.log("buiulding chart");

  let data = {grades:[[101,89,94],[97,93,89],[93,91,96]],subjects:["English","Math","AP CS"],timestamp:['ts1','ts2','ts3']};
  let settings = {type:'line',color:['#9a67fe', '#34a0eb', '#ffcc57', '#4cc0c1', '#c9cbce','#ff6485', '#ff9f3f'],theme:'#191819',graphColor:'#ffffff'};
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
});