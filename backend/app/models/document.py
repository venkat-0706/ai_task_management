from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func

from app.database import Base


class Document(Base):

    __tablename__ = "documents"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    filename = Column(
        String(255),
        nullable=False,
        unique=True
    )


    original_filename = Column(
        String(255),
        nullable=False
    )


    file_path = Column(
        String(500),
        nullable=False
    )


    file_size = Column(
        Integer,
        nullable=False
    )


    uploaded_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )


    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )