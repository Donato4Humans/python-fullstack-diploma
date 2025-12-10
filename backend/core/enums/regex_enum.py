from enum import Enum


class RegexEnum(Enum):
    NAME = (
        r'^[A-z][a-z]{,14}$',
        'Only alpha characters are allowed! Less than 15 characters are allowed.',
    )
    SURNAME = (
        r'^[A-z][a-z]{,19}$',
        'Only alpha characters are allowed! Less than 20 characters are allowed.',
    )
    GENDER = (
        r'^[A-z][a-z]{,7}$',
        'Only alpha characters are allowed! Less than 8 characters are allowed.',
    )
    STREET = (
        r'^[A-z][a-z]{,34}$',
        'Only alpha characters are allowed! Less than 35 characters are allowed.',
    )
    CITY = (
        r'^[A-z][a-z]{,34}$',
        'Only alpha characters are allowed! Less than 35 characters are allowed.',
    )
    REGION = (
        r'^[A-z][a-z]{,34}$',
        'Only alpha characters are allowed! Less than 35 characters are allowed.',
    )
    COUNTRY = (
        r'^[A-z][a-z]{,34}$',
        'Only alpha characters are allowed! Less than 35 characters are allowed.',
    )
    STREET_VENUE = (
        r'^[A-z][a-z]{,34}$',
        'Only alpha characters are allowed! Less than 35 characters are allowed.',
    )
    CITY_VENUE = (
        r'^[A-z][a-z]{,34}$',
        'Only alpha characters are allowed! Less than 35 characters are allowed.',
    )
    REGION_VENUE = (
        r'^[A-z][a-z]{,34}$',
        'Only alpha characters are allowed! Less than 35 characters are allowed.',
    )
    COUNTRY_VENUE = (
        r'^[A-z][a-z]{,34}$',
        'Only alpha characters are allowed! Less than 35 characters are allowed.',
    )

    def __init__(self, pattern:str, msg:str):
        self.pattern = pattern
        self.msg = msg