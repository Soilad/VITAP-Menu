import json
import openpyxl
import re

class FoodType:
    VEG     = 0
    NONVEG  = 1
    SPECIAL = 2

def addEntry(name, food_type) -> dict:
    _food_type = food_type
    match = re.search("non.veg|egg(?!\\s+less)|chicken|omlet", name, re.IGNORECASE)
    if match is not None: # that is NOT how you spell omelette
        _food_type |= FoodType.NONVEG
    food_entry = {
            "name": name,
            "type": _food_type,
        }

    # input()
    return food_entry

def getTimeEntries(menu, start_row, end_row, food_type) -> list[list[dict]]:
    time_entry = []
    for entry in range(4):
        column = chr(ord('B') + entry)
        time_entry.append(
            [
                addEntry(
                    food_entry[0].value,
                    food_type
                )
                for food_entry in menu[f"{column}{start_row}":f"{column}{end_row}"]
                if food_entry[0].value is not None
            ]
        )
    print(time_entry)
    return time_entry

def menuToJSON(menu, food_type):
    dictJSON  = {}
    start_row = 4
    end_row   = start_row + 1
    while len(dictJSON) < 13:
        # if end_row - start_row > 20:
        #     print(len(dictJSON))
        #     break
        start_cell = menu[f"A{start_row}"].value
        end_cell   = menu[f"A{end_row}"].value
        if end_cell != None:
            dictJSON[start_cell] = getTimeEntries(menu, start_row, end_row, food_type)
            start_row = end_row
            # break
        end_row += 1
    # __import__('pprint').pprint(dictJSON)
    return dictJSON


def main():
    menu = openpyxl.load_workbook(
        filename = "./VIT-AP_Final Mess Menu_August 2026.xlsx"
    )
    special_menu = menu["Special"]
    normal_menu  = menu["Veg & Non-Veg"]

    special_dict = menuToJSON(special_menu, FoodType.VEG)
    normal_dict  = menuToJSON(normal_menu,  FoodType.VEG)

    __import__('pprint').pprint(special_dict)
    __import__('pprint').pprint(normal_dict)
    print(len(special_dict))
    print(len(normal_dict))
    for day in special_dict:
        for special_food_entries, normal_food_entries in zip(special_dict[day], normal_dict[day]):
            for special_food_entry, normal_food_entry in zip(special_food_entries, normal_food_entries):
                if special_food_entry not in normal_food_entries:
                    special_food_entry["type"] |= FoodType.SPECIAL
    __import__('pprint').pprint(special_dict)

    menu_json = list(special_dict.values())
    with open("../menu.json", "w") as f:
        json.dump(menu_json, f, indent=4)


if __name__ == "__main__":
    main()

