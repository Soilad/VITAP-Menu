import json
import openpyxl
from enum import Flag
import re

class FoodType():
    VEG     = 0
    NONVEG  = 1
    SPECIAL = 2

def addEntry(period, name, food_type):
    _food_type = food_type
    match = re.search("non.veg|egg|chicken|omlet", name, re.IGNORECASE)
    if match is not None: # that is NOT how you spell omelette
        _food_type |= FoodType.NONVEG
    food_entry = {
            "name": name,
            "type": _food_type,
        }
    print(food_entry)
    # input()
    period.append(food_entry)


def main():
    menu_json = []
    menu = openpyxl.load_workbook(
        filename = "./VIT-AP_Final Mess Menu_August 2026.xlsx"
    )

    menu_json = []
    special_menu = menu["Special"]
    normal_menu  = menu["Veg & Non-Veg"]
    for day_index in range(14):
        # going through all the days vertically
        start_row = day_index * 14 + 4
        periods = []
        for period_index in range(4):
            # going through all the eating periods horizontally
            period_col = chr(ord("B") + period_index)
            print(day_index)
            start  = period_col + str(start_row)
            end    = period_col + str(start_row + 13)
            period = []
            for normal_entry, special_entry in zip(normal_menu[start:end], special_menu[start:end]):
                print(special_entry[0].value)
                special_entry = special_entry[0].value
                normal_entry  = normal_entry[0].value
                if (special_entry is not None) and (normal_entry is None):
                    addEntry(period, special_entry, FoodType.SPECIAL)
                elif (special_entry is not None):
                    addEntry(period, normal_entry, FoodType.VEG)
            # input()
            periods.append(period)
        menu_json.append(periods)

    __import__('pprint').pprint(menu_json)
    with open("../menu.json", "w") as f:
        json.dump(menu_json, f, indent=4)


if __name__ == "__main__":
    main()

