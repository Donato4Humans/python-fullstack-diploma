from uuid import uuid1


def upload_venue_photo(instance, filename:str) -> str:
    ext = filename.split('.')[-1]
    return f'venues/{instance.id or "temp"}/{uuid1()}.{ext}'

def upload_news_photo(instance, filename:str) -> str:
    ext = filename.split('.')[-1]
    return f'news/{instance.id or "temp"}/{uuid1()}.{ext}'