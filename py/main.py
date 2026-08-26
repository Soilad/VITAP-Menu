import openpyxl
import json

def addEntry(
    menu_json: dict,
    menu,
    day: str,
    row: int,
):
    entry_type_to_column = {
            ("breakfast", "B"),
            ("lunch", "C"),
            ("snacks", "D"),
            ("dinner", "E"),
            }
    for (entry_type, column) in entry_type_to_column:
        entry = menu["Special"][column+str(row)].value
        if entry is not None:
            menu_json[day][entry_type].append(entry)

def main():
    menu_json = {}
    menu = openpyxl.load_workbook(
        filename = "./VIT-AP_Final Mess Menu_August 2026.xlsx"
    )

    day = -1
    for row in range(4, 188):
        if menu["Special"]["A"+str(row)].value is not None:
            # day = menu["Special"]["A"+str(row)].value
            day += 1 # 0 indexing reasons
            menu_json[day] = {
                "breakfast": [],
                "lunch": [],
                "snacks": [],
                "dinner": [],
            }
        addEntry(
            menu_json,
            menu,
            day,
            row
        )
        # print(f"day: {day}")
        # print(f"json: {menu_json}")
        # input()

    __import__('pprint').pprint(menu_json)


if __name__ == "__main__":
    main()

