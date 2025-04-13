from weasyprint import HTML
from jinja2 import Environment, PackageLoader
import pdfkit  # This is missing from the original code and needed for the provided changes.  Must be installed: pip install pdfkit wkhtmltopdf


def get_image_base64(image_data):
    import base64
    return base64.b64encode(image_data).decode('utf-8')


def generate_pdf(header,
                 part_a_questions,
                 part_b_questions,
                 department,
                 subject,
                 selected_departments=None,
                 original_template=None):
    env = Environment(loader=PackageLoader('app', 'templates'))
    template = env.get_template('pdf_template.html')
    template_data = {
        'header': header,
        'partB': original_template.partB if original_template else None,
    }

    # Add image data to questions if available
    for question in part_a_questions + part_b_questions:
        # Check if image attribute exists and has a value
        if getattr(question, 'image', None):
            question.image_data = f"data:image/png;base64,{get_image_base64(question.image.data)}"
    
    # Count part B main questions (excluding sub-questions) for the template calculation
    question_count = 0
    for question in part_b_questions:
        if not hasattr(question, 'sub_label') or question.sub_label != 'b)':
            question_count += 1
    

    # Get marks per question from actual questions
    if part_b_questions:
        marks_per_question = part_b_questions[0].display_marks if hasattr(part_b_questions[0], 'display_marks') else part_b_questions[0].marks
    else:
        marks_per_question = 10  # Default to 10 if no questions
        
    html = template.render(template=template_data,
                           part_a_questions=part_a_questions,
                           part_b_questions=part_b_questions,
                           department=department,
                           subject=subject,
                           selected_departments=selected_departments,
                           part_b_question_count=question_count,
                           marks_per_question=marks_per_question)

    return HTML(string=html).write_pdf()
