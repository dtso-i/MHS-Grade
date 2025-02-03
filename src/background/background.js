/**
 * @fileoverview Background script for the extension.
 */

const MIN_GRADES_REQUIRED = 6; // Minimum number of grades required to process data
const MY_MHS_URL =
  'https:\/\/maranathahighschool.myschoolapp.com\/app\/student#studentmyday\/progress';
const WEEK_DAYS = 7; // Assuming the `grade` array's length represents days of the week
const DEFAULT_COLORS = [
  '#ff6485',
  '#34a0eb',
  '#ffcc57',
  '#4cc0c1',
  '#9a67fe',
  '#c9cbce',
  '#ff9f3f',
];
const DEFAULT_THEME = '#';

// Listen for tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.query(
    {
      status: 'complete',
      url: MY_MHS_URL,
    },
    (tabs) => {
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
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
    rgrades.length < MIN_GRADES_REQUIRED ||
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
    console.log(data);
    // storeData(data);
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
  const grade = Array.from({ length: WEEK_DAYS }, () => []); // Initialize grade array

  const currentTime = new Date();
  const formattedTimestamp = `${currentTime.getFullYear()} ${currentTime.toLocaleString(
    'default',
    { month: 'short' },
  )} ${currentTime.getDate()} ${currentTime.toTimeString().split(' ')[0]}`;

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

    let dataChanged = false;

    // Compare new grades with existing grades
    for (let i = 0; i < existingGrades.length; i++) {
      grade[i] = existingGrades[i];
      if (
        existingGrades[i][existingGrades[i].length - 1] !== newData.grades[i]
      ) {
        dataChanged = true;
      }
    }

    if (!dataChanged) {
      return 'repeated'; // No changes detected, return early
    }

    // Append new grades
    for (let i = 0; i < existingGrades.length; i++) {
      grade[i].push(newData.grades[i]);
    }

    // Update timestamps
    timestamps.push(formattedTimestamp);

    finalData.grades = grade;
    finalData.subjects = existingSubjects;
    finalData.timestamps = timestamps;
  } catch (error) {
    // First-time setup or missing data
    for (let i = 0; i < newData.grades.length; i++) {
      grade[i].push(newData.grades[i]);
    }

    finalData.grades = grade;
    finalData.subjects = newData.subjects;
    finalData.timestamps = [formattedTimestamp];

    const defaultSettings = {
      color: DEFAULT_COLORS,
      theme: DEFAULT_THEME,
    };

    // Save default settings to local storage
    await chrome.storage.local.set({ settings: defaultSettings });
  }

  // Save updated data to local storage
  await chrome.storage.local.set({ data: finalData });

  return 'success';
}
