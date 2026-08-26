// https://www.xjavascript.com/blog/how-to-get-json-from-url-in-javascript/
function fetchJsonWithXhr(url) {
  // Step 1: Create XHR object
  const xhr = new XMLHttpRequest();
 
  // Step 2: Configure request (GET, URL, async)
  xhr.open("GET", url, true);
 
  // Step 3: Handle response
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      // Success: Parse JSON into an object
      const jsonData = JSON.parse(xhr.responseText);
      console.log("XHR fetched data:", jsonData);
    } else {
      // HTTP error
      console.error("XHR Error:", xhr.statusText);
    }
  };
 
  // Handle network errors
  xhr.onerror = function () {
    console.error("Network error occurred");
  };
}

function getMenu(weekDay) {
	var date = new Date()
	console.log(date.getDate())
	fetchJsonWithXhr("file:///home/soilad/Projects/VITAP-Menu/menu.json")
}
