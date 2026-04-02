"""
Script to update admin password
"""
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import User
from app.core.security import get_password_hash


def update_admin_password(new_password: str):
    """Update admin password"""
    db = SessionLocal()
    
    try:
        # Find admin user
        admin_user = db.query(User).filter(User.email == "admin@qazmind.kz").first()
        
        if not admin_user:
            print("✗ Admin user not found!")
            return False
        
        # Update password
        admin_user.password_hash = get_password_hash(new_password)
        db.commit()
        
        print("✓ Admin password updated successfully!")
        print(f"  Email: admin@qazmind.kz")
        print(f"  New Password: {new_password}")
        return True
        
    except Exception as e:
        print(f"✗ Error updating password: {str(e)}")
        db.rollback()
        return False
    finally:
        db.close()


if __name__ == "__main__":
    update_admin_password("606007!")
