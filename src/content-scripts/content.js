/**
 * @fileoverview This file is responsible for getting the html of the page and sending it to the background script.
 */

// eslint-disable-next-line prefer-const
let WAIT_TIME = 2000; // Time to wait before checking if the page is ready

/**
 * @function waitReady
 * @description Gets the html of the page and sends it to the background script.
 */
function waitReady() {
  if (document.readyState === 'complete') {
    const grades = document.querySelectorAll('h3.showGrade');
    const subjects = document.querySelectorAll('.row .row .col-md-3 a');
    const filteredGrades = [];
    const filteredSubjects = [];
    Object.values(grades).forEach((element) => {
      filteredGrades.push(element.innerHTML);
    });
    Object.values(subjects).forEach((element) => {
      filteredSubjects.push(element.innerHTML);
    });
    chrome.runtime.sendMessage({
      action: 'htmlResponse',
      grades: filteredGrades,
      subjects: filteredSubjects,
    });
  } else {
    window.setTimeout(waitReady, WAIT_TIME);
  }
}

console.log('* content.js running');

waitReady();
