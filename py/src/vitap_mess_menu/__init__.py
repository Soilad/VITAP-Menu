import json
import sys
from datetime import datetime
from pathlib import Path

import openpyxl

from .structs import FoodType
from .utils import menuToJSON


def main() -> None:
    menu = openpyxl.load_workbook(
        filename = sys.argv[1],
    )
    special_menu = menu["Special"]
    normal_menu  = menu["Veg & Non-Veg"]

    special_dict = menuToJSON(special_menu)
    normal_dict  = menuToJSON(normal_menu)

    # __import__('pprint').pprint(special_dict)
    # __import__('pprint').pprint(normal_dict)
    print(len(special_dict))
    print(len(normal_dict))
    for day in special_dict:
        for special_time_entries, normal_time_entries in zip(special_dict[day], normal_dict[day]):
            for special_food_entry in special_time_entries["foodEntries"]:
                if special_food_entry not in normal_time_entries["foodEntries"]:
                    special_food_entry["type"] |= FoodType.SPECIAL
    # __import__('pprint').pprint(special_dict)

    menu_json = list(special_dict.values())

    now = datetime.now()  # noqa: DTZ005
    menu_dir = Path(f"../menu/{now.year}/{now.month:02}")
    menu_dir.mkdir(parents=True, exist_ok=True)
    with open(menu_dir / "menu.json", "w") as f:
        json.dump(menu_json, f, indent=4)
