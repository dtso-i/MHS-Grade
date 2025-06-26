/**
 * @fileoverview This file contains the logic for rendering the chart on the popup.
 */

const GRADE_VALUES = {
  ENGLISH_Q1: 101,
  ENGLISH_Q2: 89,
  ENGLISH_Q3: 94,
  MATH_Q1: 97,
  MATH_Q2: 93,
  MATH_Q3: 89,
  CS_Q1: 93,
  CS_Q2: 91,
  CS_Q3: 96,
};
const DEFAULT_DATA = {
  grades: [
    [GRADE_VALUES.ENGLISH_Q1, GRADE_VALUES.ENGLISH_Q2, GRADE_VALUES.ENGLISH_Q3],
    [GRADE_VALUES.MATH_Q1, GRADE_VALUES.MATH_Q2, GRADE_VALUES.MATH_Q3],
    [GRADE_VALUES.CS_Q1, GRADE_VALUES.CS_Q2, GRADE_VALUES.CS_Q3],
  ],
  subjects: ['English', 'Math', 'AP CS'],
  timestamp: ['ts1', 'ts2', 'ts3'],
};
const DEFAULT_SETTINGS = {
  type: 'line',
  color: ['#9a67fe', '#34a0eb', '#ffcc57'],
  theme: '#191819',
  graphColor: '#ffffff',
};

async function getData() {
  try {
    const result = await chrome.storage.local.get();
    console.log('Data retrieved from storage:', result);
    return {
      data: result.data || { grades: [], subjects: [], timestamp: [] },
      settings: result.settings || {},
    };
  } catch (error) {
    console.error('Error retrieving data from storage:', error);
    return null;
  }
}

// NOTE: This function is used for testing purposes only and should be removed in production.
getData = async () => {
  console.log('Mocking data retrieval failure...');
  return null;
};

document.addEventListener('DOMContentLoaded', async () => {
  const ctx = document.getElementById('gradeChart');
  console.log('Building chart...');

  const result = await getData();
  let data, settings;

  if (result && result.data && result.settings) {
    data = result.data;
    settings = result.settings;
  } else {
    data = DEFAULT_DATA;
    settings = DEFAULT_SETTINGS;
  }

  const setGradesRaw = data.grades;
  const setTimestamp = data.timestamp;
  const subjects = data.subjects;

  const setGrades = subjects.map((subject, i) => ({
    label: subject,
    data: setGradesRaw[i],
    borderColor: settings.color[i] || '#000000',
    backgroundColor: settings.graphColor || '#FFFFFF',
  }));

  new Chart(ctx, {
    type: settings.type || 'line',
    data: {
      labels: setTimestamp,
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
      },
    },
  });
});
