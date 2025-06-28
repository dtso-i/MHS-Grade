/**
 * @fileoverview This file contains the logic for rendering the chart on the popup.
 */

async function loadDefaults(){
  const res = await fetch('./assets/themeTemplates.json');
  const data = await res.json();
  return data;
}

async function getData() {
  try {
    const result = await chrome.storage.local.get();
    return {
      data: result.data,
      settings: result.settings
    };
  } catch (error) {
    console.error('Error retrieving data from storage:', error);
    document.getElementsByTagName('body')[0].innerHTML = '<h1 style="color:white">Error: Data is not fetched</h1>'; //TODO: design this better
    return null;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const themeTemplates = await loadDefaults();
  const result = await getData();
  console.log('Data retrieved:', result);

  let data, settings;

  if (result && result.data && result.settings) {
    data = result.data;
    settings = result.settings;
  } else {
    console.log('No data or settings found');
    document.getElementsByTagName('body')[0].innerHTML = '<h2 style="color:white">Error: No data found</h2>'; //TODO: design this better
    return 0; // Exit if no data is available
  }

  const ctx = document.getElementById('gradeChart');
  console.log('Building chart...');

  const setGradesRaw = data.grades;
  const setTimestamps = data.timestamps;
  const subjects = data.subjects;
  const fontColor = themeTemplates[settings.theme].fontColor;
  const bkgColor = themeTemplates[settings.theme].bkgColor;

  document.getElementsByTagName('body')[0].style = `background-color: ${bkgColor}`;

  const setGrades = subjects.map((subject, i) => ({
    label: subject,
    data: setGradesRaw[i],
    borderColor: settings.colors[i],
    backgroundColor: settings.colors[i]
  }));

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: setTimestamps,
      datasets: setGrades,
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.dataset.label}: ${context.raw}`;
            },
          },
        },
        legend: {
          labels: {
            color: fontColor
          },
        }
      },
      scales: {
        x: {
          grid: {
            color: fontColor
          },
          ticks: {
            color: fontColor,
            maxTicksLimit: 20
          }
        },
        y: {
          grid: {
            color: fontColor
          },
          ticks: {
            color: fontColor
          }
        }
      },
    },
  });
  return 0;
});
