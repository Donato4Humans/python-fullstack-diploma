from datetime import timedelta

from django.utils.timezone import now


def update_venue_views(venue):
    today = now()

    if hasattr(venue, 'seller') :
        venue.views += 1

        if venue.last_view_date and venue.last_view_date.date() == today.date():
            venue.daily_views += 1
        else:
            venue.daily_views = 1

        if venue.last_view_date and venue.last_view_date >= today - timedelta(days=7):
            venue.weekly_views += 1
        else:
            venue.weekly_views = 1

        if venue.last_view_date and venue.last_view_date >= today - timedelta(days=30):
            venue.monthly_views += 1
        else:
            venue.monthly_views = 1

        venue.last_view_date = today
        venue.save(update_fields=['views', 'daily_views', 'weekly_views', 'monthly_views', 'last_view_date'])

def measure_venue_proximity(venue):
    pass