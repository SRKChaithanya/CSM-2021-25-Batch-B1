from app import app, db
from models import SelectedQuestion

print("Creating SelectedQuestion table...")
with app.app_context():
    # Drop the table if it exists
    if 'selected_question' in db.metadata.tables:
        SelectedQuestion.__table__.drop(db.engine)
    
    # Create the SelectedQuestion table
    SelectedQuestion.__table__.create(db.engine)
    print("SelectedQuestion table created successfully!")