
from app import app, db
from models import User
from werkzeug.security import generate_password_hash

def recreate_database():
    with app.app_context():
        # Drop all tables and recreate them
        db.drop_all()
        db.create_all()
        
        # Create an admin user if needed
        admin = User(username='admin')
        admin.set_password('admin')
        db.session.add(admin)
        db.session.commit()
        
        print("Database recreated successfully!")

if __name__ == "__main__":
    recreate_database()
