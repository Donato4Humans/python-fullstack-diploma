FROM python:3.13-alpine

MAINTAINER Python Backend Venue Share Platform

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_NO_INTERACTION=1 \
    DEBIAN_FRONTEND=noninteractive \
    COLUMNS=80 \
    POETRY_HOME=/usr/local/poetry

ENV PATH="$POETRY_HOME/bin:$PATH"

RUN apk update && apk add --no-cache --virtual .build-deps gcc musl-dev mariadb-dev curl \
    && apk add --no-cache postgresql-client \
    && curl -sSL https://install.python-poetry.org | python3 - \
    && apk del curl

WORKDIR /app

COPY pyproject.toml poetry.lock /app/

RUN poetry config virtualenvs.create false \
    && poetry install --no-root

COPY ./backend/ /app/
COPY ./backend/storage/ /storage/