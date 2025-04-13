from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class DepartmentForm(FlaskForm):
    name = StringField('Department Name', validators=[DataRequired()])
    dept_id = StringField('Department ID', validators=[DataRequired()])
    submit = SubmitField('Save')
