FROM python:3.9-slim
WORKDIR /app
RUN apt-get update && \
    apt-get install -y default-libmysqlclient-dev build-essential pkg-config && \
    rm -rf /var/lib/apt/lists/*
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app/
COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]