from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from alembic import context

from app.database import Base, DATABASE_URL

# Import all models here so Alembic can detect them
from app.models.user import User
from app.models.task import Task
from app.models.activity_log import ActivityLog
from app.models.document import Document


config = context.config


if config.config_file_name is not None:
    fileConfig(config.config_file_name)


# SQLAlchemy models metadata
target_metadata = Base.metadata


# Set database URL dynamically
config.set_main_option(
    "sqlalchemy.url",
    DATABASE_URL
)


def run_migrations_offline():
    """Run migrations without connecting to the database."""

    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={
            "paramstyle": "named"
        }
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations with database connection."""

    connectable = engine_from_config(
        config.get_section(
            config.config_ini_section
        ),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:

        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()