FROM python:3.6-alpine
ENV PYTHONUNBUFFERED 1

RUN apk update && apk add git gcc musl-dev

ENV FLASK_APP=main.py
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
RUN cp /app/solc /usr/bin/