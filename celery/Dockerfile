FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install -r ./backend/requirements.txt
CMD ["celery", "-A", "BudgetMate", "beat", "--loglevel=info"]
