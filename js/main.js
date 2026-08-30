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

function update(date, offset) {
	date.setDate(date.getDate() + offset);
	if (new Date().getMonth() === date.getMonth()) {
		init(date)
	} else {
		date.setDate(date.getDate() - offset);
	}
}

function init(date = new Date()) {
	document.getElementById("monthDay").value = date.getDate();
	getMenu(date.getDate());
}

function getMenu(monthDay) {
	document.getElementById("entries").innerHTML = '';
	const INDEX_TO_NAME = [
		"Breakfast (7:15 AM - 9:00 AM)",
		"Lunch (12:15 AM - 2:00 PM)",
		"Snacks (4:15 PM - 6:15 PM)",
		"Dinner (7:15 PM - 9:00 PM)",
	];

	const TYPE_TO_EMOJI = [
		"🥦",
		"🍗",
		"✨🥦",
		"✨🍗"
	];
	const TYPE_TO_CLASS = [
		"Veg",
		"NonVeg",
		"SpecialVeg",
		"SpecialNonVeg"
	]
	loadJSON("./menu.json").then(
		(menuJSON) => {
			console.log(menuJSON)
			const currentMenu = menuJSON[(monthDay - 1) % 14]
			console.log(currentMenu)

			for (let index = 0; index < 4; index++) {
				const timeEntry = document.createElement("div")
				const timeEntryHeading = document.createElement("h2")
				timeEntryHeading.innerText = INDEX_TO_NAME[index]
				timeEntry.appendChild(timeEntryHeading)
				timeEntry.setAttribute("id", INDEX_TO_NAME[index])
				timeEntry.setAttribute("class", "TimeEntry")

				const foodEntries = document.createElement("div")
				foodEntries.setAttribute("class", "FoodEntries")
				timeEntry.appendChild(foodEntries)
				currentMenu[index].forEach(
					foodItem => {
						const foodEntry = document.createElement("p");
						foodEntry.setAttribute("class", "FoodEntry " + TYPE_TO_CLASS[foodItem.type])
						foodEntry.innerText = TYPE_TO_EMOJI[foodItem.type] + foodItem.name;
						foodEntries.appendChild(foodEntry);
					}
				);
				document.getElementById("entries").appendChild(timeEntry)
			}
		}
	)
}
