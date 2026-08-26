import json
import openpyxl
from enum import Flag
import re

class FoodType():
    VEG     = 0
    NONVEG  = 1
    SPECIAL = 2

def addEntry(menu_json, entry_type, name, food_type):
    _food_type = food_type
    match = re.search("non.veg|egg|chicken|omlet", name, re.IGNORECASE)
    if match is not None: # that is NOT how you spell omelette
        _food_type |= FoodType.NONVEG
        
    for existing in menu_json[-1][entry_type]:
        if name.startswith(existing["name"]) or existing["name"].startswith(name):
            return
            
    food_entry = {
            "name": name,
            "type": _food_type,
        }
    print(food_entry)
    # input()
    menu_json[-1][entry_type].append(food_entry)

def addEntries(
    menu_json: dict,
    menu,
    day: str,
    row: int,
):
    for entry_type in range(4):
        column = chr(ord("B") + entry_type) # jst write c atr man :wilted_flower:
        spreadsheet_index = column + str(row)
        special_entry = menu["Special"][spreadsheet_index].value
        normal_entry = menu["Veg & Non-Veg"][spreadsheet_index].value

        special_food_type = FoodType.SPECIAL
        normal_food_type  = FoodType.VEG

        if normal_entry is not None:
            addEntry(menu_json, entry_type, normal_entry, normal_food_type)
        if special_entry is not None:
            addEntry(menu_json, entry_type, special_entry, special_food_type)

def main():
    menu_json = []
    menu = openpyxl.load_workbook(
        filename = "./VIT-AP_Final Mess Menu_August 2026.xlsx"
    )

    day = -1
    for row in range(4, 188):
        if menu["Special"]["A"+str(row)].value is not None:
            # day = menu["Special"]["A"+str(row)].value
            day += 1 # 0 indexing reasons
            # menu_json[day] = {
            #     "breakfast": [],
            #     "lunch": [],
            #     "snacks": [],
            #     "dinner": [],
            # }
            menu_json.append(
                [
                    [],
                    [],
                    [],
                    [],
                ]
            )
        addEntries(
            menu_json,
            menu,
            day,
            row
        )
        # print(f"day: {day}")
        # print(f"json: {menu_json}")
        # input()
    __import__('pprint').pprint(menu_json)
    with open("../menu.json", "w") as f:
        json.dump(menu_json, f, indent=4)


if __name__ == "__main__":
    main()

