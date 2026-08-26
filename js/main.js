async function loadJSON(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error('Network response was not ok');
		const data = await response.json();
		console.log(data);  // Your parsed JSON object
		// Do something with the data...
	} catch (error) {
		console.error('Error loading JSON:', error);
	}
}

function getMenu(weekDay) {
	var date = new Date();
	console.log(date.getDate());
	loadJSON("menu.json");
}
