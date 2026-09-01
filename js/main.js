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

function lockByMonth(date, offset = 0) {
	date.setDate(date.getDate() + offset);
	console.log(new Date());
	console.log(date);
	if (!(new Date().getMonth() === date.getMonth())) {
		date.setDate(date.getDate() - offset);
		return false;
	}
	return true;
}

async function init(a_currentDate = new Date(), a_timeEntries, menuJSON) {
	const inputMonth = document.getElementById("monthDay");
	inputMonth.addEventListener(
		"change",
		// "input",
		async (event) => {
			monthDay = inputMonth.value
			if (!isNaN(parseInt(monthDay))) {
				if (lockByMonth(a_currentDate)) {
					a_currentDate.setDate(parseInt(monthDay));
					if (a_currentDate.getMonth() !== new Date().getMonth()) {
						a_currentDate = new Date();
					}
				}
				inputMonth.value = a_currentDate.getDate();
			}
			console.log(parseInt(monthDay));
			console.log(a_currentDate);
			console.log(
				await update(a_currentDate, a_timeEntries, menuJSON)
			);
			console.log(event);
		}
	);
	inputMonth.value = a_currentDate.getDate();

	const timeEntries = document.getElementById("timeEntries");

	a_timeEntries.forEach(entry => {
			const timeEntry = document.createElement("div");
			timeEntry.id = entry.name;
			timeEntry.classList.add("TimeEntry");

			const timeEntryHeading = document.createElement("h2");
			timeEntryHeading.innerText = getHeading(entry);
			timeEntry.appendChild(timeEntryHeading);

			const foodEntries = document.createElement("div");
			foodEntries.classList.add("FoodEntries");
			timeEntry.appendChild(foodEntries);

			timeEntries.appendChild(timeEntry);
	});
	timeEntries.firstElementChild.classList.add("Active");
}

function getHeading(a_timeEntry) {
	const format = {
		hour: "2-digit",
		minute: "2-digit",
	}
	return a_timeEntry.name 
	+ " ("
	+ a_timeEntry.start.toLocaleTimeString('en', format)
	+ " - "
	+ a_timeEntry.end.toLocaleTimeString('en', format)
	+ ")";
}

async function update(a_date, a_timeEntries, a_menuJSON, isButton = false) {
	const TYPES = [
		{
			emoji: "🥦",
			class: "Veg",
		}, {
			emoji: "🍗",
			class: "NonVeg",
		}, {
			emoji: "✨🥦",
			class: "SpecialVeg",
		}, {
			emoji: "✨🍗",
			class: "SpecialNonVeg",
		}
	];
	const inputMonth = document.getElementById("monthDay");
	inputMonth.value = a_date.getDate();

	menuJSON = await a_menuJSON;
	const currentMenu = menuJSON[(a_date.getDate() - 1) % 14];
	// console.log(menuJSON.length);
	// console.log((a_date.getDate() - 1) % 14);
	
	a_timeEntries.forEach(
		(timeEntry) => {
			const entry = document.getElementById(timeEntry.name);
			// console.log(entry);

			const foodEntries = entry.lastElementChild;
			foodEntries.innerHTML = "";
			// console.log(foodEntries);

			currentMenu[timeEntry.id].forEach(
				foodObject => {
					const foodEntry = document.createElement("p");
					foodEntry.classList.add("FoodEntry");
					foodEntry.classList.add(TYPES[foodObject.type].class);
					foodEntry.innerText = TYPES[foodObject.type].emoji + foodObject.name;
					foodEntries.appendChild(foodEntry);
				}
			);
		}
	);
}
