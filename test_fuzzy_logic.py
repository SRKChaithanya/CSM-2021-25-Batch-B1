from app import app, db
from models import SelectedQuestion, Question, Subject
import random
import datetime
import math

def calculate_fuzzy_score(usage_count):
    """
    Calculate the fuzzy score using the formula:
    fuzzy_score = 1.0 / sqrt(1.0 + log10(usage_count))
    """
    if usage_count <= 0:
        return 1.0
    return 1.0 / math.sqrt(1.0 + math.log10(usage_count))

with app.app_context():
    try:
        # First check if SelectedQuestion table exists
        all_tables = db.metadata.tables.keys()
        print(f"Tables in database: {', '.join(all_tables)}")

        if 'selected_question' in all_tables:
            print("SelectedQuestion table exists!")

            # Get a random question to test
            question = Question.query.first()
            subject = Subject.query.first()

            if question and subject:
                # Create a test record in SelectedQuestion
                selected = SelectedQuestion(
                    question_id=question.id,
                    subject_course_code=subject.course_code,
                    subject_department_id=subject.department_id,
                    exam_type='TEST',
                    selection_date=datetime.datetime.utcnow(),
                    usage_count=random.randint(1, 5))

                db.session.add(selected)
                db.session.commit()

                print(
                    f"Created test selected question with usage count: {selected.usage_count}"
                )

                # Verify it was created
                test_record = SelectedQuestion.query.filter_by(
                    question_id=question.id,
                    subject_course_code=subject.course_code,
                    subject_department_id=subject.department_id).first()

                if test_record:
                    print("Test record created and retrieved successfully!")
                    print(
                        f"Question ID: {test_record.question_id}, Usage Count: {test_record.usage_count}"
                    )
                    print(
                        f"Subject Course Code: {test_record.subject_course_code}"
                    )
                    print(test_record.question)
                    
                    # Test the fuzzy score calculation with various usage counts
                    print("\nFuzzy Score Test Results:")
                    test_counts = [0, 1, 2, 5, 10, 20, 50, 100]
                    print("Usage Count | Fuzzy Score")
                    print("------------------------")
                    for count in test_counts:
                        score = calculate_fuzzy_score(count)
                        print(f"{count:11d} | {score:.6f}")
                    
                    print("\nCurrent Question Fuzzy Score:")
                    current_score = calculate_fuzzy_score(test_record.usage_count)
                    print(f"Usage Count: {test_record.usage_count}, Fuzzy Score: {current_score:.6f}")
                else:
                    print("Error: Could not retrieve the test record")
            else:
                print(
                    "No questions or subjects found in the database for testing"
                )
        else:
            print(
                "SelectedQuestion table does not exist. Database migration needed."
            )
    except Exception as e:
        print(f"Error during testing: {str(e)}")
