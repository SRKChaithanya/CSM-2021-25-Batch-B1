from app import db
from flask_login import UserMixin 
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Department(db.Model):
    dept_id = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    subjects = db.relationship('Subject', backref='department', lazy=True)

class Regulation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    templates = db.relationship('Template', backref='regulation', lazy=True)
    subjects = db.relationship('Subject', backref='regulation', lazy=True)

class Subject(db.Model):
    # Using composite primary key with course_code and department_id
    course_code = db.Column(db.String(20), primary_key=True)
    department_id = db.Column(db.String(20), db.ForeignKey('department.dept_id'), primary_key=True)
    
    # Other columns
    course_name = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    regulation_id = db.Column(db.Integer, db.ForeignKey('regulation.id'), nullable=False)
    
    # Relationships
    questions = db.relationship('Question', backref='subject', lazy=True, cascade='all, delete-orphan')

class Template(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    exam_type = db.Column(db.String(20), nullable=False)
    header = db.Column(db.JSON, nullable=False)
    partA = db.Column(db.JSON, nullable=False)
    partB = db.Column(db.JSON, nullable=False)
    regulation_id = db.Column(db.Integer, db.ForeignKey('regulation.id'), nullable=False)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    unit = db.Column(db.Integer, nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    marks = db.Column(db.Integer, nullable=False)
    co = db.Column(db.String(10), nullable=False)
    bl = db.Column(db.String(10), nullable=False)
    subject_course_code = db.Column(db.String(20), nullable=False)
    subject_department_id = db.Column(db.String(20), nullable=False)
    __table_args__ = (db.ForeignKeyConstraint(['subject_course_code', 'subject_department_id'],
                                             ['subject.course_code', 'subject.department_id']),)
    # Add relationship to Image
    image = db.relationship('Image', backref='question', uselist=False, lazy=True)

class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.LargeBinary, nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False, unique=True)

class SelectedQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    subject_course_code = db.Column(db.String(20), nullable=False)
    subject_department_id = db.Column(db.String(20), nullable=False)
    exam_type = db.Column(db.String(20), nullable=False)
    selection_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    # Store how many times this question has been used (for fuzzy logic weighting)
    usage_count = db.Column(db.Integer, default=1)

    # Foreign key constraint to the composite key of Subject
    __table_args__ = (db.ForeignKeyConstraint(['subject_course_code', 'subject_department_id'],
                                             ['subject.course_code', 'subject.department_id']),)

    # Relationships
    question = db.relationship('Question', backref='selections')
    subject = db.relationship('Subject', backref='selected_questions',
                             primaryjoin="and_(SelectedQuestion.subject_course_code==Subject.course_code, "
                                        "SelectedQuestion.subject_department_id==Subject.department_id)")