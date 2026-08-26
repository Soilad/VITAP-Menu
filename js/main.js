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
		"Breakfast (7:15 AM - 9:00 AM)",
		"Lunch (12:15 AM - 2:00 PM)",
		"Snacks (4:15 PM - 6:15 PM)",
		"Dinner (7:15 PM - 9:00 PM)",
	]

	const typeToEmoji = [
		"🥦",
		"🍗",
		"✨🥦",
		"✨🍗"
	]
	const typeToClass = [
		"Veg",
		"NonVeg",
		"SpecialVeg",
		"SpecialNonVeg"
	]
	console.log(date.getDate())
	loadJSON("./menu.json").then(
		(menuJSON) => {
			console.log(menuJSON)
			const currentMenu = menuJSON[(date.getDate() - 1) % 14]
			console.log(currentMenu)

			for (let index = 0; index < 4; index++) {
				const timeEntry = document.createElement("div")
				const timeEntryHeading = document.createElement("h2")
				timeEntryHeading.innerText = indexToName[index]
				timeEntry.appendChild(timeEntryHeading)
				timeEntry.setAttribute("id", indexToName[index])
				timeEntry.setAttribute("class", "TimeEntry")

				const foodEntries = document.createElement("div")
				foodEntries.setAttribute("class", "FoodEntries")
				timeEntry.appendChild(foodEntries)
				currentMenu[index].forEach(
					foodItem => {
						const foodEntry = document.createElement("p");
						foodEntry.setAttribute("class", "FoodEntry " + typeToClass[foodItem.type])
						foodEntry.innerText = typeToEmoji[foodItem.type] + foodItem.name;
						foodEntries.appendChild(foodEntry);
					}
				);
				document.getElementById("entries").appendChild(timeEntry)
			}
		}
	)
}
