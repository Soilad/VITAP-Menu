# from dataclasses import dataclass
# from enum import Flag, auto


class FoodType:
    VEG     = 0
    NONVEG  = 1
    SPECIAL = 2

# the spreadsheet doesn't list timings, so they live here ("HH:MM", 24 hour)
TIMINGS = {
    "Breakfast" : ("07:15", "09:00"),
    "Lunch"     : ("12:15", "14:00"),
    "Snacks"    : ("16:15", "18:15"),
    "Dinner"    : ("19:15", "21:00"),
}

# @dataclass
# class FoodEntry:
#     name: str
#     type: FoodType
#
# @dataclass
# class TimeEntry:
#     title:       str
#     foodEntries: list[FoodEntry]
