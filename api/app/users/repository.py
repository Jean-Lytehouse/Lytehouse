from app import db
from app.users.models import AppUser

class UserRepository():

    @staticmethod
    def get_by_id(user_id):
        return db.session.query(AppUser).get(user_id)

    @staticmethod
    def get_by_email(email):
        return db.session.query(AppUser).filter_by(email=email).first()