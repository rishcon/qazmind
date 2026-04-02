"""
Migration script to add options_mapping column to test_attempts table
Run this script to update the database schema
"""

from sqlalchemy import create_engine, text
import os

# Get database URL from environment or use default
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost/qazmind")

def migrate():
    try:
        engine = create_engine(DATABASE_URL)
        
        with engine.connect() as conn:
            # Check if column exists (PostgreSQL)
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='test_attempts' AND column_name='options_mapping'
            """))
            
            if result.fetchone() is None:
                # Add the column for PostgreSQL
                print("Adding options_mapping column to test_attempts table...")
                conn.execute(text("""
                    ALTER TABLE test_attempts 
                    ADD COLUMN options_mapping JSONB
                """))
                conn.commit()
                print("✅ Migration completed successfully!")
            else:
                print("ℹ️  Column options_mapping already exists. Skipping migration.")
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        print("\nIf using PostgreSQL, make sure DATABASE_URL is set correctly.")
        print("Example: DATABASE_URL=postgresql://user:password@localhost/dbname")

if __name__ == "__main__":
    migrate()
