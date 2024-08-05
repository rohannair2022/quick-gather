from datetime import datetime, timedelta
from typing import List, Optional

def set_date(iso_date: str) -> datetime:
    return datetime.fromisoformat(iso_date)

def setHoursandMins(duration: str) -> List[int]:
    return [int(input) for input in duration.split(':')]

def common_time(users_dates: List[List[List[str]]]) -> Optional[List[datetime]]:
    """
    The strings are in ['isoformat', 'hh:mm']
    """
    # Flatten the list of date ranges
    all_ranges = [(set_date(date[0]), set_date(date[0]) + timedelta(hours=setHoursandMins(date[1])[0], minutes=setHoursandMins(date[1])[1])) 
                  for user_dates in users_dates for date in user_dates]
    
    latest_start = max(start for start, _ in all_ranges)
    earliest_end = min(end for _, end in all_ranges)
    
    # Check if there's a valid overlap
    if latest_start < earliest_end:
        return [latest_start, earliest_end]
    else:
        return None


# Test the function
result = common_time([[['2024-08-11T14:30:34-04:00', '05:00'],['2024-08-11T18:36:34-04:00', '01:00']],[['2024-08-11T18:36:34-04:00', '01:00']]])
print(result[0].isoformat(), result[1].isoformat())