from app.database import Base, engine

# Import models so SQLAlchemy registers them
from app.models.user import User
from app.models.document import Document
from app.models.activity_log import ActivityLog

Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")