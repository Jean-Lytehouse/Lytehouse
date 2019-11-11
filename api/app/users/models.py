from datetime import datetime, timedelta

from app import db, bcrypt, LOGGER
from app.utils.misc import make_code
from flask_login import UserMixin

def expiration_date():
    return datetime.now() + timedelta(days=1)


class AppUser(db.Model, UserMixin):

    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    firstname = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    camera1Ip = db.Column(db.String(100), nullable=False)
    camera1Name = db.Column(db.String(100), nullable=False)
    camera2Ip = db.Column(db.String(100), nullable=False)
    camera2Name = db.Column(db.String(100), nullable=False)
    camera3Ip = db.Column(db.String(100), nullable=False)
    camera3Name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    verified_email = db.Column(db.Boolean(), nullable=True)
    verify_token = db.Column(db.String(255), nullable=True, unique=True, default=make_code)

    def __init__(self,
                 email,
                 firstname,
                 lastname,
                 camera1Ip,
                 camera1Name,
                 camera2Ip,
                 camera2Name,
                 camera3Ip,
                 camera3Name,   
                 password):
        self.email = email
        self.firstname = firstname
        self.lastname = lastname
        self.camera1Ip = camera1Ip
        self.camera1Name = camera1Name
        self.camera2Ip = camera2Ip
        self.camera2Name = camera2Name
        self.camera3Ip = camera3Ip
        self.camera3Name = camera3Name
        self.set_password(password)
        self.verified_email = True

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password)

    def deactivate(self):
        self.active = False
    
    def verify(self):
        self.verified_email = True

    def update_email(self, new_email):
        self.verified_email = False
        self.verify_token = make_code()
        self.email = new_email
    
    def delete(self):
        self.is_deleted = True
        self.deleted_datetime_utc = datetime.now()

    

class PasswordReset(db.Model):

    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('app_user.id'))
    code = db.Column(db.String(255), unique=True, default=make_code)
    date = db.Column(db.DateTime(), default=expiration_date)

    user = db.relationship(AppUser)

    db.UniqueConstraint('user_id', 'code', name='uni_user_code')

    def __init__(self, user):
        self.user = user
