/**
 * @fileoverview This file is the popup script for the extension.
 */

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'dataStored') {
    console.log('data stored');
  }
});

// Open the options page when the button is clicked
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('openBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  console.log('popup.js loaded');
});
