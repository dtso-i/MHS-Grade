/**
 * @fileoverview Background script for the extension.
 */

const MY_MHS_URL =
  'https:\/\/maranathahighschool.myschoolapp.com\/app\/student#studentmyday\/progress';
const DEFAULT_COLORS = [
  '#ff6485',
  '#34a0eb',
  '#ffcc57',
  '#4cc0c1',
  '#9a67fe',
  '#c9cbce',
  '#ff9f3f',
];
const DEFAULT_THEME = '#1f1e1e';

// Listen for tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.query(
    {
      status: 'complete',
      url: MY_MHS_URL,
    },
    () => {
      executeContentScript(activeInfo.tabId);
    },
  );
});

// Listen for link changes in the current tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url &&
    tab.url.startsWith(MY_MHS_URL)
  ) {
    executeContentScript(tabId);
  }
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'htmlResponse') {
    processData(request.grades, request.subjects); // Send semi-processed data to be fully processed
  }
});

/**
 * @function executeContentScript
 * @description Executes the content script on the current tab.
 * @param {number} tabId - The ID of the current tab.
 * @returns {void}
 */
function executeContentScript(tabId) {
  try {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content-scripts/content.js'],
    });
  } catch (error) {
    console.error('Error executing content script:', error);
  }
  console.log(`* content.js executed on ${tabId}`);
}

/**
 * @function processData
 * @description Processes the raw data received from the content script and sends it to be stored.
 * @param {Array<string>} rgrades - The raw grades data.
 * @param {Array<string>} rsubjects - The raw subjects data.
 * @returns {void}
 */
function processData(rgrades, rsubjects) {
  if (
    !rgrades ||
    typeof rgrades === 'undefined'
  ) {
    return;
  } else {
    for (let i = 0; i < rgrades.length; i++) {
      rgrades[i] = rgrades[i].replace('%', '');
      rgrades[i] = rgrades[i].replace(' ', '');
      rgrades[i] = rgrades[i].replace(' ', '');
      rsubjects[i] = rsubjects[i].replace('<h3>', '');
      rsubjects[i] = rsubjects[i].replace('</h3>', '');
    }
    rsubjects.splice(rgrades.length, rsubjects.length - rgrades.length);
    const data = { subjects: rsubjects, grades: rgrades };
    storeData(data);
  }
}

/**
 * @function storeData
 * @description Stores the processed data in local storage.
 * @param {Object} newData - The processed data to be stored.
 * @returns {Promise<string>} - A promise that resolves to a string indicating the status of the operation.
 */
async function storeData(newData) {
  const finalData = {};

  // Fetch existing data from local storage
  const result = await chrome.storage.local.get(['data']);
  const grade = Array.from({ length: newData.subjects.length }, () => []); // Initialize grade array

  const currentTime = new Date();
  const formattedTimestamp = `${currentTime.getFullYear()} ${currentTime.toLocaleString(
    'default',
    { month: 'short' }
  // eslint-disable-next-line no-magic-numbers
  )} ${currentTime.getDate()} ${currentTime.toTimeString().split(' ')[0].slice(0,-3)}`;

  try {
    const existingData = result.data;

    if (!existingData) {
      throw new Error('No existing data found'); // Trigger fallback logic for first-time use
    }

    const {
      grades: existingGrades,
      subjects: existingSubjects,
      timestamps,
    } = existingData;

    // Check for subject changes
    if (JSON.stringify(existingSubjects) !== JSON.stringify(newData.subjects)) {
      // Subjects changed midway, prompt user for confirmation to reset subjects
      // (Insert confirmation logic here)
    }

    // Compare new grades with existing grades
    let changed = false;
    for (let i = 0; i < existingGrades.length; i++) {
      grade[i] = existingGrades[i];
      if (
        existingGrades[i][existingGrades[i].length - 1] !== newData.grades[i]
      ) {
        changed = true; // Reset repeated flag if any grade has changed
      }
    }
    if (changed) {
      // Append new grades
      for (let i = 0; i < existingGrades.length; i++) {
        grade[i].push(newData.grades[i]);
      }
      // Update timestamps
      timestamps.push(formattedTimestamp);
    } else {
      timestamps[timestamps.length - 1] = formattedTimestamp; // Update last timestamp
      console.warn('* Grades have not changed, no new data to store.');
    }

    finalData.grades = grade;
    finalData.subjects = existingSubjects;
    finalData.timestamps = timestamps;
  } catch (error) {
    console.warn('Error: ', error);
    for (let i = 0; i < newData.grades.length; i++) {
      grade[i].push(newData.grades[i]);
    }

    finalData.grades = grade;
    finalData.subjects = newData.subjects;
    finalData.timestamps = [formattedTimestamp];

    const defaultSettings = {
      colors: DEFAULT_COLORS,
      theme: DEFAULT_THEME,
    };

    // Save default settings to local storage
    await chrome.storage.local.set({ settings: defaultSettings });
  }

  // Save updated data to local storage
  await chrome.storage.local.set({ data: finalData });

  return 'success';
}