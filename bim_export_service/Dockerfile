FROM python:3.6

RUN mkdir /code
WORKDIR /code
ADD . .
RUN pip install -r requirements.txt

#EXPOSE 5000  -- not required since mentioned inside dockercompose
