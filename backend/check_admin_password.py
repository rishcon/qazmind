"""
Script to check admin user in database
"""
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import User
from app.core.security import verify_password


def check_admin_password():
    """Check admin password in database"""
    db = SessionLocal()
    
    try:
        # Find admin user
        admin_user = db.query(User).filter(User.email == "admin@qazmind.kz").first()
        
        if not admin_user:
            print("✗ Admin user not found in database!")
            return False
        
        print("✓ Admin user found!")
        print(f"  Email: {admin_user.email}")
        print(f"  Password Hash: {admin_user.password_hash[:50]}...")
        
        # Try to verify password
        password_to_test = "606007"
        is_valid = verify_password(password_to_test, admin_user.password_hash)
        
        if is_valid:
            print(f"  ✓ Password '606007' is CORRECT")
        else:
            print(f"  ✗ Password '606007' is INCORRECT")
            print(f"\n  Trying to verify with correct password validation...")
        
        return is_valid
        
    except Exception as e:
        print(f"✗ Error checking password: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()


if __name__ == "__main__":
    check_admin_password()
