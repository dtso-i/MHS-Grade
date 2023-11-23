//fetch data from data.json



var time = []; //time,date or entry number
var gradeSet =[]; //sets of grades by time separated by subjects [{data:[*grades over time*],borderColor: "*color*",fill: false}]
new Chart("gradeChart", {
  type: "line",
  data: {
    labels: time,
    datasets: gradeSet
  },
  options: {
    legend: {display: false} //create legend separately with a func to option colors for each subjects
  }
})