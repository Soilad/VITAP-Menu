async function loadJSON(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error('Network response was not ok');
		const data = await response.json();
		return data;  // Your parsed JSON object
		// Do something with the data...
	} catch (error) {
		console.error('Error loading JSON:', error);
	}
}

function getMenu() {
	var date = new Date()
	const indexToName = [
		"Breakfast",
		"Lunch",
		"Snacks",
		"Dinner",
	]

	const typeToEmoji = [
		"🥦",
		"🍗",
		"✨🥦",
		"✨🍗"
	]
	console.log(date.getDate())
	loadJSON("./menu.json").then(
		(menuJSON) => {
			console.log(menuJSON)
			const currentMenu = menuJSON[(date.getDate() - 1) % 14]
			console.log(currentMenu)

			for (let index = 0; index < 4; index++) {
				const timeEntry = document.createElement("div")
				const timeEntryHeading = document.createElement("h3")
				timeEntryHeading.innerText = indexToName[index]
				timeEntry.appendChild(timeEntryHeading)
				timeEntry.setAttribute("id", indexToName[index])
				timeEntry.setAttribute("class", "TimeEntry")
				currentMenu[index].forEach(
					foodItem => {
						const foodEntry = document.createElement("span");
						foodEntry.setAttribute("class", foodItem.type)
						foodEntry.setAttribute("class", "FoodEntry")
						foodEntry.innerText = typeToEmoji[foodItem.type] + foodItem.name;
						timeEntry.appendChild(foodEntry);
					}
				);
				document.getElementById("entries").appendChild(timeEntry)
			}
		}
	)
}
