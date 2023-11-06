document.getElementById("changeColorButton").addEventListener("click", () => {
  chrome.scripting.executeScript({
    target: { tabId: 0 },
    function: (color) => {
      document.body.style.backgroundColor = color;
    },
    args: ["blue"], // Change the color to your preference
  });
});
