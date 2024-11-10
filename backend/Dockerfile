FROM python:3.9-slim
ENV PYTHONUNBUFFERED 1
RUN apt-get update && apt-get install -y \
    pkg-config \
    default-libmysqlclient-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*
    
RUN mkdir /app
WORKDIR /app
ADD . /app/
RUN pip install --upgrade pip
RUN pip install mysqlclient
RUN pip install -r requirements.txt
COPY . /app/
COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]