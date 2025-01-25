# Insurance App Backend Setup Guide

## Prerequisites

- Python 3.12 or higher
- PostgreSQL 14 or higher
- pip (Python package manager)

## Step 1: Python Environment Setup

1. Check your Python version:
   ```bash
   python3 --version
   ```

2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   ```

3. Activate the virtual environment:
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     .\venv\Scripts\activate
     ```

4. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

## Step 2: PostgreSQL Setup

1. Install PostgreSQL:
   - On macOS (using Homebrew):
     ```bash
     brew install postgresql@14
     ```
   - On Ubuntu:
     ```bash
     sudo apt-get install postgresql postgresql-contrib
     ```

2. Start PostgreSQL service:
   - On macOS:
     ```bash
     brew services start postgresql
     ```
   - On Ubuntu:
     ```bash
     sudo service postgresql start
     ```

3. Create database and user:
   ```bash
   # Login to PostgreSQL
   psql postgres

   # Create database
   CREATE DATABASE insurance_db;

   # Create user (if not exists)
   CREATE USER postgres WITH PASSWORD '1234';

   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE insurance_db TO postgres;

   # Exit PostgreSQL
   \q
   ```

## Step 3: Django Setup

1. Apply migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

2. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

3. Load initial data (if any):
   ```bash
   python manage.py loaddata accounts/fixtures/initial_users.json
   ```

## Step 4: Running the Server

1. Start the development server:
   ```bash
   python manage.py runserver
   ```

2. Access the application:
   - Admin interface: http://localhost:8000/admin/
   - API endpoints: http://localhost:8000/api/

## Environment Variables (Optional)

Create a `.env` file in the root directory with the following variables if you want to customize the configuration:

```env
DEBUG=True
SECRET_KEY=your_secret_key
DB_NAME=insurance_db
DB_USER=postgres
DB_PASSWORD=1234
DB_HOST=localhost
DB_PORT=5432
```

## Common Issues

1. If you encounter database connection issues:
   - Verify PostgreSQL is running
   - Check database credentials in settings.py
   - Ensure PostgreSQL user has proper permissions

2. If migrations fail:
   - Try resetting migrations:
     ```bash
     python manage.py migrate --fake-initial
     ```

3. Package installation issues:
   - Ensure your virtual environment is activated
   - Update pip: `pip install --upgrade pip` 