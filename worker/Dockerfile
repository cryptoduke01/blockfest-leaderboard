FROM python:3.10-slim

WORKDIR /app

# Install system deps for psycopg2 and lxml (snscrape deps)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    libxml2 \
    libxslt1.1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt snscrape

COPY . .

CMD ["python", "snscrape_scraper.py"]


