FROM python:3.6-alpine
ENV PYTHONUNBUFFERED 1

RUN apk update && apk add git gcc musl-dev

ENV FLASK_APP=main.py
RUN mkdir /app
WORKDIR /app

ADD ./requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt
ADD ./solc /usr/bin

ADD . /app