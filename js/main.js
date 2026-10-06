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

// the menu repeats every 14 days, so a day entry covers e.g. the 1st, 15th and 29th
const CYCLE_LENGTH = 14;

// matches a trailing "(15, 29)" that limits an item to specific dates
const DATE_SUFFIX = /\s*\(\s*(\d+(?:\s*,\s*\d+)*)\s*\)\s*$/;

async function loadJSON(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error('Network response was not ok');
		return await response.json();
	} catch (error) {
		console.error('Error loading JSON:', error);
	}
}

// moves date by offset days, unless that would leave the current month
function lockByMonth(date, offset = 0) {
	const target = new Date(date);
	target.setDate(target.getDate() + offset);
	if (target.getMonth() !== new Date().getMonth()) {
		return false;
	}
	date.setTime(target.getTime());
	return true;
}

async function init(a_currentDate = new Date(), a_timeEntries, a_menuJSON) {
	const inputMonth = document.getElementById("monthDay");
	inputMonth.value = a_currentDate.getDate();
	inputMonth.addEventListener(
		"change",
		async () => {
			const monthDay = parseInt(inputMonth.value);
			if (!isNaN(monthDay)) {
				lockByMonth(a_currentDate, monthDay - a_currentDate.getDate());
			}
			await update(a_currentDate, a_timeEntries, a_menuJSON);
		}
	);

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

// returns the display name of a food entry, or null if it isn't served on monthDay
function getFoodName(a_name, monthDay) {
	const match = a_name.match(DATE_SUFFIX);
	if (!match) return a_name;
	const days = match[1].split(",").map(day => parseInt(day));
	if (!days.includes(monthDay)) return null;
	return a_name.slice(0, match.index);
}

async function update(a_date, a_timeEntries, a_menuJSON, isButton = false) {
	const inputMonth = document.getElementById("monthDay");
	inputMonth.value = a_date.getDate();

	const menuJSON = await a_menuJSON;
	if (!menuJSON) return;
	const currentMenu = menuJSON[(a_date.getDate() - 1) % CYCLE_LENGTH];

	a_timeEntries.forEach(
		(timeEntry) => {
			const foodEntries = document.getElementById(timeEntry.name).lastElementChild;
			foodEntries.innerHTML = "";

			const meal = currentMenu.find(meal => meal.title === timeEntry.name)
				?? currentMenu[timeEntry.id];
			if (!meal) return;

			meal.foodEntries.forEach(
				foodObject => {
					const name = getFoodName(foodObject.name, a_date.getDate());
					if (name === null) return;

					const foodEntry = document.createElement("p");
					foodEntry.classList.add("FoodEntry");
					foodEntry.classList.add(TYPES[foodObject.type].class);
					foodEntry.innerText = TYPES[foodObject.type].emoji + name;
					foodEntries.appendChild(foodEntry);
				}
			);
		}
	);
}
