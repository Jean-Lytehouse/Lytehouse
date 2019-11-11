from app import db, bcrypt
import app

class Site(db.Model):
    __tablename__ = 'Site'

    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=False)
    contact_number = db.Column(db.String(15), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    email_address = db.Column(db.String(50), nullable=True)

    user = db.relationship('User', foreign_keys=[user_id])

    def __init__(self, user_id, contact_number, address, email_address = None):
        self.user_id = user_id
        self.contact_number = contact_number
        self.address = address
        self.email_address = email_address


class Camera(db.Model):
    __tablename__ = 'Camera'

    id = db.Column(db.Integer(), primary_key=True)
    site_id = db.Column(db.Integer(), db.ForeignKey('site.id'), nullable=False)
    ip_address = db.Column(db.String(255), nullable=False)

    def __init__(self, ip_address, site_id):
        self.ip_address = ip_address
        self.site_id = site_id

class User(db.Model):
    __tablename__ = 'User'

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=False)
    contact_number = db.Column(db.String(15), db.ForeignKey('section.id'), nullable=False)
    email_address = db.Column(db.String(50), nullable=False)

    def __init__(self, name, contact_number, email_address):
        self.name = name
        self.contact_number = contact_number
        self.email_address = email_address
  
