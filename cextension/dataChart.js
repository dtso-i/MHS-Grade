//fetch data from data.json
function fetchJSON(){
  return fetch('data.json') // object
  .then(response => response.json())
  .catch(error => {return error});
}

function filterData(rawData){ //note: show "timestamp" on hover of a data point
  let setSubjects = Object.keys(Object.values(rawData)[0].data); //list subjects
  let setGrades = [];
  let setTimestamp = [];
  for (let i=0;i<setSubjects.length;i++) {
    setGrades[setSubjects[i]] = [];
  }
  for (let i=0;i<Object.keys(rawData).length;i++) { //loops through entries (each timecount)
    var timecount = Object.keys(rawData)[i]; //int entry number(count)
    var timestamp = Object.values(rawData)[i].timestamp; //string timestamp
    var subjects = Object.keys(Object.keys(Object.values(rawData)[i].data)); //list subjects
    var subjectColors = Object.values(Object.keys(Object.values(rawData)[i].data)); //list color of subjects
    var grades = Object.values(Object.values(rawData)[i].data); //list grades
    setTimestamp.push(timestamp);
    for (let j=0;j<subjects.length;j++) {
      if (subjects[j] in Object.keys(setGrades)) {
        setGrades[subjects[j]].push(grades[j]);
      } else {
        setGrades[subjects[j]] = {};
        setGrades[subjects[j]][timecount] = grades[j];
      }
    }
  }
  return [setGrades,setTimestamp,subjectColors];
  //setGrades = [{subject:[grades over time]},{subject:[grades over time]}, {elsesubject: {timecount: [grades over time]}}]
  //setTimestamp = [timestamp,timestamp,timestamp] | timecount = index of timestamp
  //subjectColors = ['#ff6485','#34a0eb','#ffcc57','#4cc0c1','#9a67fe','#c9cbce','#ff9f3f'];
}

function a(){
  fetchJSON().then(jsonData => {
    return filterData(jsonData);
  })
}

function constChart(type="line"){
  try{
    let filteredData = a(); //////////////
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

    new Chart("gradeChart", {
      type: type,
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
  }catch(error){
    return error
  }
}