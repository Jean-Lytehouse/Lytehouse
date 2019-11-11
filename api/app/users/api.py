from datetime import datetime

from flask import g, request
import flask_restful as restful
from flask_restful import reqparse, fields, marshal_with
from sqlalchemy.exc import IntegrityError

from app.users.models import AppUser, PasswordReset
from app.users.mixins import SignupMixin, AuthenticateMixin, UserProfileListMixin
from app.users.repository import UserRepository as user_repository

from app.utils.auth import auth_required, admin_required, generate_token
from app.utils.errors import EMAIL_IN_USE, RESET_PASSWORD_CODE_NOT_VALID, BAD_CREDENTIALS, EMAIL_NOT_VERIFIED, EMAIL_VERIFY_CODE_NOT_VALID, USER_NOT_FOUND, RESET_PASSWORD_CODE_EXPIRED, USER_DELETED, FORBIDDEN

from app import db, bcrypt, LOGGER
from app.utils.emailer import send_mail

from config import BOABAB_HOST


VERIFY_EMAIL_BODY = """
Dear {} {} {},

Thank you for creating a new Lytehouse account. Please use the following link to verify your email address:

{}/verifyEmail?token={}

Kind Regards,
The Lytehouse Team
"""

RESET_EMAIL_BODY = """
Dear {} {} {},

You recently requested a password reset on Lytehouse, please use the following link to reset you password:
{}/resetPassword?resetToken={}

If you did not request a password reset, please ignore this email and contact the Lytehouse team.

Kind Regards,
The Lytehouse Team
"""

user_fields = {
    'id': fields.Integer,
    'email': fields.String,
    'firstname': fields.String,
    'lastname': fields.String,
    'camera1Ip': fields.String,
    'camera1Name': fields.String,
    'camera2Ip': fields.String,
    'camera2Name': fields.String,
    'camera3Ip': fields.String,
    'camera3Name': fields.String,
    'password': fields.String
}


def user_info(user):
    return {
        'id': user.id,
        'token': generate_token(user),
        'firstname': user.firstname,
        'lastname': user.lastname,
        'email': user.email,
        'camera1Ip': user.camera1Ip,
        'camera1Name': user.camera1Name,
        'camera2Ip': user.camera2Ip,
        'camera2Name': user.camera2Name,
        'camera3Ip': user.camera3Ip,
        'camera3Name': user.camera3Name
    }


def get_baobab_host():
    return BOABAB_HOST[:-1] if BOABAB_HOST.endswith('/') else BOABAB_HOST


class UserAPI(SignupMixin, restful.Resource):

    @auth_required
    @marshal_with(user_fields)
    def get(self):
        user = db.session.query(AppUser).filter(
            AppUser.id == g.current_user['id']).first()
        return user

    def post(self):
        args = self.req_parser.parse_args()

        email = args['email']
        firstname = args['firstname']
        lastname = args['lastname']
        camera1Ip = args['camera1Ip']
        camera1Name = args['camera1Name']
        camera2Ip = args['camera2Ip']
        camera2Name = args['camera2Name']
        camera3Ip = args['camera3Ip']
        camera3Name = args['camera3Name']
        password = args['password']

        LOGGER.info("Registering email: {} ".format(email))

        user = AppUser(
            email=email,
            firstname=firstname,
            lastname=lastname,
            camera1Ip = camera1Ip,
            camera1Name = camera1Name,
            camera2Ip = camera2Ip,
            camera2Name = camera2Name,
            camera3Ip = camera3Ip,
            camera3Name = camera3Name,
            password = password)

        LOGGER.info("User")
        LOGGER.info(user)

        db.session.add(user)

        try:
            db.session.commit()
        except IntegrityError as e:
            LOGGER.error("email: {} already in use".format(email))
            LOGGER.error(e)
            return EMAIL_IN_USE

        # send_mail(recipient=user.email,
        #           subject='Lytehouse Email Verification',
        #           body_text=VERIFY_EMAIL_BODY.format(firstname, lastname,
        #               get_baobab_host(),
        #               user.verify_token))

        LOGGER.debug("Sent verification email to {}".format(user.email))

        return user_info(user), 201

    @auth_required
    def put(self):
        args = self.req_parser.parse_args()

        email = args['email']
        firstname = args['firstname']
        lastname = args['lastname']
        camera1Ip = args['camera1Ip']
        camera1Name = args['camera1Name']
        camera2Ip = args['camera2Ip']
        camera2Name = args['camera2Name']
        camera3Ip = args['camera3Ip']
        camera3Name = args['camera3Name']
        user = db.session.query(AppUser).filter(
            AppUser.id == g.current_user['id']).first() 
        
        if user.email != email:
            user.update_email(email)            

        user.firstname = firstname
        user.lastname = lastname
        user.camera1Ip = camera1Ip
        user.camera1Name = camera1Name
        user.camera2Ip = camera2Ip
        user.camera2Name = camera2Name
        user.camera3Ip = camera3Ip
        user.camera3Name = camera3Name

        try:
            db.session.commit()
        except IntegrityError:
            LOGGER.error("email {} already in use".format(email))
            return EMAIL_IN_USE

        if not user.verified_email:
            # send_mail(recipient=user.email,
            #         subject='Lytehouse Email Re-Verification',
            #         body_text=VERIFY_EMAIL_BODY.format(firstname, lastname,
            #             get_baobab_host(),
            #             user.verify_token))

            LOGGER.debug("Sent re-verification email to {}".format(user.email))


        return user_info(user), 200

    @auth_required
    def delete(self):
        '''
        The function that lets the user delete the account
        '''

        LOGGER.debug("Deleting user: {}".format(g.current_user['id']))

        user = db.session.query(AppUser).filter(
            AppUser.id == g.current_user['id']).first()
        if user:
            user.is_deleted = True
            db.session.commit()
            LOGGER.debug("Successfully deleted user {}".format(g.current_user['id']))
        else:
            LOGGER.debug("No user for id {}".format(g.current_user['id']))        
        
        return {}, 200

class UserProfileView():
    def __init__(self, user_response):
        self.user_id = user_response.AppUser.id
        self.email = user_response.AppUser.email
        self.firstname = user_response.AppUser.firstname
        self.lastname = user_response.AppUser.lastname
        self.camera1Ip = user_response.AppUser.camera1Ip
        self.camera1Name = user_response.AppUser.camera1Name
        self.camera2Ip = user_response.AppUser.camera2Ip
        self.camera2Name = user_response.AppUser.camera2Name
        self.camera3Ip = user_response.AppUser.camera3Ip
        self.camera3Name = user_response.AppUser.camera3Name

        

class UserProfileList(UserProfileListMixin, restful.Resource):

    user_profile_list_fields = {
        'user_id': fields.Integer,
        'email': fields.String,
        'firstname': fields.String,
        'lastname': fields.String,
        'camera1Ip': fields.String,
        'camera1Name': fields.String,
        'camera2Ip': fields.String,
        'camera2Name': fields.String,
        'camera3Ip': fields.String,
        'camera3Name': fields.String,
    }

    # @marshal_with(user_profile_list_fields)
    # @auth_required
    # def get(self):
    #     args = self.req_parser.parse_args()
    #     event_id = args['event_id']
    #     current_user_id = g.current_user['id']

    #     current_user = user_repository.get_by_id(current_user_id)
    #     if not current_user.is_event_admin(event_id):
    #         return FORBIDDEN

    #     user_responses = user_repository.get_all_with_responses_for(event_id)
    #     views = [UserProfileView(user_response) for user_response in user_responses]
    #     return views


class AuthenticationAPI(AuthenticateMixin, restful.Resource):

    def post(self):
        args = self.req_parser.parse_args()

        user = db.session.query(AppUser).filter(
            AppUser.email == args['email']).first()

        LOGGER.debug("Authenticating user: {}".format(args['email']))

        if user:
            # if user.is_deleted:
            #     LOGGER.debug("Failed to authenticate, user {} deleted".format(args['email'])) 
            #     return USER_DELETED

            # if not user.verified_email:
            #     LOGGER.debug("Failed to authenticate, email {} not verified".format(args['email']))
            #     return EMAIL_NOT_VERIFIED

            if bcrypt.check_password_hash(user.password, args['password']):
                LOGGER.debug("Successful authentication for email: {}".format(args['email']))
                return user_info(user)

        else:
            LOGGER.debug("User not found for {}".format(args['email']))
        
        return BAD_CREDENTIALS


class PasswordResetRequestAPI(restful.Resource):

    def post(self):        

        req_parser = reqparse.RequestParser()
        req_parser.add_argument('email', type=str, required=True)
        args = req_parser.parse_args()

        LOGGER.debug("Requesting password reset for email {}".format(args['email']))

        user = db.session.query(AppUser).filter(
            AppUser.email == args['email']).first()

        if not user:
            LOGGER.debug("No user found for email {}".format(args['email']))
            return USER_NOT_FOUND

        password_reset = PasswordReset(user=user)
        db.session.add(password_reset)
        db.session.commit()

        # send_mail(recipient=args['email'],
        #           subject='Password Reset for Lytehouse portal',
        #           body_text=RESET_EMAIL_BODY.format(user.firstname, user.lastname,
        #     get_baobab_host(), password_reset.code))

        return {}, 201


class PasswordResetConfirmAPI(restful.Resource):

    def post(self):        
        
        req_parser = reqparse.RequestParser()
        req_parser.add_argument('code', type=str, required=True)
        req_parser.add_argument('password', type=str, required=True)
        args = req_parser.parse_args()        

        LOGGER.debug("Confirming password reset for code: {}".format(args['code']))

        password_reset = db.session.query(PasswordReset).filter(
            PasswordReset.code == args['code']).first()

        if not password_reset:
            LOGGER.debug("Reset password code not valid: {}".format(args['code']))
            return RESET_PASSWORD_CODE_NOT_VALID

        if password_reset.date < datetime.now():
            LOGGER.debug("Reset code expired for code: {}".format(args['code']))
            return RESET_PASSWORD_CODE_EXPIRED

        password_reset.user.set_password(args['password'])
        db.session.delete(password_reset)
        db.session.commit()

        LOGGER.debug("Password reset successfully")

        return {}, 201


class VerifyEmailAPI(restful.Resource):

    def get(self):        
        
        token = request.args.get('token')

        LOGGER.debug("Verifying email for token: {}".format(token))

        user = db.session.query(AppUser).filter(
            AppUser.verify_token == token).first()

        if not user:
            LOGGER.debug("No user found for token: {}".format(token))
            return EMAIL_VERIFY_CODE_NOT_VALID

        user.verify()

        db.session.commit()

        LOGGER.debug("Email verified successfully for token: {}".format(token))

        return {}, 201


class ResendVerificationEmailAPI(restful.Resource):
    def get(self):
        email = request.args.get('email')

        LOGGER.debug("Resending verification email to: {}".format(email))

        user = db.session.query(AppUser).filter(
            AppUser.email == email).first()

        if not user:
            LOGGER.debug("User not found for email: {}".format(email))
            return USER_NOT_FOUND

        # send_mail(recipient=user.email,
        #           subject='Lytehouse Email Verification',
        #           body_text=VERIFY_EMAIL_BODY.format(user.firstname, user.lastname,
        #               get_baobab_host(),
        #               user.verify_token))

        LOGGER.debug("Resent email verification to: {}".format(email))

        return {}, 201
