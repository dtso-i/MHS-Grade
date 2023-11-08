//host web server on port 8000
const http = require("http");
const host = "localhost";
const port = 8000;
const requestListener = function (req, res) { 
  res.writeHead(200);
  res.end("My first server!"); 
};
const server = http.createServer(requestListener);
server.listen(port, host, ()=> {
  console.log(`Server is running`); 
});

//open localhost:8000 on click
document.addEventListener("DOMContentLoaded", function () {
  const openNewTabButton = document.getElementById("openNewTabButton");

  openNewTabButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "openNewTab" });
  });
});
