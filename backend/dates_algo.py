from datetime import datetime, timedelta
from typing import List, Optional

def set_date(iso_date: str) -> datetime:
    return datetime.fromisoformat(iso_date)

def setHoursandMins(duration: str) -> List[int]:
    return [int(input) for input in duration.split(':')]


def set_dates(user_dates: List[List[str]]):
    all_ranges = [
        (set_date(other_user_dates[0]),
            set_date(other_user_dates[0]) + timedelta(hours=setHoursandMins(other_user_dates[1])[0],
                                                        minutes=setHoursandMins(other_user_dates[1])[1]))
        for other_user_dates in user_dates
    ]

    return all_ranges

def common_time(users_dates: List[List[List[str]]]) -> Optional[List[List[datetime]]]:
    """
    The strings are in ['isoformat', 'hh:mm']
    """
    potential_dates = []

    for i, user_dates in enumerate(users_dates):
        for j, date_time in enumerate(user_dates):
            all_ranges = [
                (set_date(other_user_dates[k][0]),
                 set_date(other_user_dates[k][0]) + timedelta(hours=setHoursandMins(other_user_dates[k][1])[0],
                                                              minutes=setHoursandMins(other_user_dates[k][1])[1]))
                for other_user_dates in users_dates
                for k in range(len(other_user_dates))
                if (other_user_dates != user_dates or k == j)
            ]

            if all_ranges:
                latest_start = max(start for start, _ in all_ranges)
                earliest_end = min(end for _, end in all_ranges)

                # Check if there's a valid overlap
                if latest_start < earliest_end:
                    potential_dates.append([latest_start, earliest_end])

    potential_dates_collect = []
    potential_dates_final = []
    for i in potential_dates:
        date_string = i[0].isoformat()+i[1].isoformat()
        if date_string not in potential_dates_collect:
            potential_dates_final.append(i)
            potential_dates_collect.append(date_string)

    return potential_dates_final

