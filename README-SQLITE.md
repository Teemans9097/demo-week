# P.C SDG 4 Platform with SQLite Backend

This version uses Flask + SQLite.

## How to run

1. Install Python.
2. Open this folder in VS Code.
3. Open Terminal and run:

```bash
pip install -r requirements.txt
python app.py
```

4. Open:

```text
http://127.0.0.1:5000
```

## Demo accounts

Student:
- email: student@pcsdg4.sl
- password: student123

Teacher:
- email: teacher@pcsdg4.sl
- password: teacher123
- two-step code: 246810

Parent:
- email: parent@pcsdg4.sl
- password: parent123

Admin:
- email: admin@pcsdg4.sl
- password: admin123
- two-step code: 246810

## SQLite database location

```text
database/pc_sdg4.db
```

The database is created automatically when you run `python app.py`.
