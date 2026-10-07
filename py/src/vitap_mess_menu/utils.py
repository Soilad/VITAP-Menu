import re

from .structs import TIMINGS, FoodType


def splitItems(name) -> list[str]:
    items = []
    # split on + , / but not inside parentheses, e.g. "(Big size 3pcs, if not 4pcs)"
    for group in re.split(r"\s*[+,]\s*(?![^()]*\))", name):
        parts = [part.strip() for part in re.split(r"\s*/\s*(?![^()]*\))", group) if part.strip()]
        # "Chicken/Veg Biriyani" -> "Chicken Biriyani", "Veg Biriyani"
        # only when every part but the last is one word, so "Butter Milk/Lassi/Lemon Water" stays as is
        if len(parts) > 1 and len(parts[-1].split()) > 1 and all(len(part.split()) == 1 for part in parts[:-1]):
            suffix = parts[-1].split()[-1]
            parts = [f"{part} {suffix}" for part in parts[:-1]] + parts[-1:]
        items.extend(parts)
    return items

def addEntry(name) -> list[dict]:
    entries = []
    for item in splitItems(name):
        food_type = FoodType.VEG
        match = re.search("non.veg|fish|egg(?!\\s+less)|chicken|omlet", item, re.IGNORECASE)
        if match is not None: # that is NOT how you spell omelette
            food_type |= FoodType.NONVEG
        entries.append({
            "name" : item,
            "type" : int(food_type),
        })
    return entries

def getTimeEntries(menu, start_row, end_row) -> list[dict]:
    time_entries = []
    for entry in range(4):
        column = chr(ord('B') + entry)
        title  = menu[f"{column}3"].value
        start, end = TIMINGS[title]
        time_entries.append(
            {
                "title"       : title,
                "start"       : start,
                "end"         : end,
                "foodEntries" : [
                    item
                    for food_entry in menu[f"{column}{start_row}":f"{column}{end_row}"]
                    if food_entry[0].value is not None
                    for item in addEntry(str(food_entry[0].value))
                ]
            }
        )
    print(time_entries)
    return time_entries

def menuToJSON(menu):
    dictJSON  = {}
    start_row = 4
    end_row   = start_row + 1
    while len(dictJSON) < 14:
        start_cell = menu[f"A{start_row}"].value
        end_cell   = menu[f"A{end_row}"].value
        if end_row - start_row > 14:
            dictJSON[start_cell] = getTimeEntries(menu, start_row, end_row - 1)
            # __import__('pprint').pprint(dictJSON)
            # print(len(dictJSON))
            # print(f"A{start_row}")
            # print(f"A{end_row}")
            # input()
            break
        if end_cell != None:
            dictJSON[start_cell] = getTimeEntries(menu, start_row, end_row - 1)
            start_row = end_row
            # __import__('pprint').pprint(dictJSON)
            # print(len(dictJSON))
            # input()
            # break
        end_row += 1
    # __import__('pprint').pprint(dictJSON)
    return dictJSON
