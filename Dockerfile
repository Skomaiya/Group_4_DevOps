# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Security & reliability
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# System deps kept slim; psycopg2-binary avoids compiler toolchain
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Create app user/group (non-root)
RUN addgroup --system app && adduser --system --ingroup app app

# Set workdir
WORKDIR /app

# Install Python deps first (cache layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Entrypoint (runs migrations & waits for DB if needed)
COPY backend/entrypoint.sh /app/backend/entrypoint.sh
RUN chmod +x /app/backend/entrypoint.sh && chown -R app:app /app

# Switch to non-root
USER app

# Move to Django project dir
WORKDIR /app/backend

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
