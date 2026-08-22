from sqlalchemy import text
from app.database import engine


try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT VERSION()"))
        print("MySQL connection successful!")
        print("MySQL version:", result.scalar())

except Exception as e:
    print("MySQL connection failed!")
    print(e)