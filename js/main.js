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

function init(currentDate = new Date()) {
	document.getElementById("monthDay").value = date.getDate();
	getMenu(date.getDate(), currentDate);
}

function getMenu(monthDay, currentDate) {
	document.getElementById("entries").innerHTML = '';
	const INDEX_TO_NAME = [
		"Breakfast (7:15 AM - 9:00 AM)",
		"Lunch (12:15 AM - 2:00 PM)",
		"Snacks (4:15 PM - 6:15 PM)",
		"Dinner (7:15 PM - 9:00 PM)",
	];
	const INDEX_TO_DATE = [
		{
			start: new Date(new Date(currentDate).setHours(7, 15, 0, 0)),
			end: new Date(new Date(currentDate).setHours(9, 0, 0, 0)),
		}, {
			start: new Date(new Date(currentDate).setHours(12, 15, 0, 0)),
			end: new Date(new Date(currentDate).setHours(14, 0, 0, 0)),
		}, {
			start: new Date(new Date(currentDate).setHours(16, 15, 0, 0)),
			end: new Date(new Date(currentDate).setHours(18, 15, 0, 0)),
		}, {
			start: new Date(new Date(currentDate).setHours(19, 15, 0, 0)),
			end: new Date(new Date(currentDate).setHours(21, 0, 0, 0)),
		}
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
	];
	loadJSON("./menu.json").then(
		(menuJSON) => {
			const currentMenu = menuJSON[(monthDay - 1) % 14];
			const mealIndices = [0, 1, 2, 3];
			mealIndices.sort(
				(index1, index2) => {
					const time1 = INDEX_TO_DATE[index1].start;
					const time2 = INDEX_TO_DATE[index2].start;
					return Math.abs(time1.getTime() - currentDate.getTime()) - Math.abs(time2.getTime() - currentDate.getTime());
				}
			);

			mealIndices.forEach(
				(index) => {
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
			);
		}
	)
}
