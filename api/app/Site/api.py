from datetime import datetime
import traceback

import flask_restful as restful
from flask_restful import reqparse, fields, marshal_with
from sqlalchemy.exc import SQLAlchemyError
import cv2

from app.Site.mixins import SiteMixin
from app.Site.models import Site, Camera, User

from app.utils.errors import SECTION_NOT_FOUND, DB_NOT_AVAILABLE, SITE_NOT_FOUND

from app import db, bcrypt
from app import LOGGER


class SiteAPI(SiteMixin, restful.Resource):

    camera_fields = {
        'id': fields.Integer,
        'site_id': fields.Integer,
        'ip_address': fields.String
    }

    site_fields = {
        'id': fields.Integer,
        'owner_id': fields.Integer,
        'address': fields.String,
        'email_address': fields.String,
        'contact_number': fields.String
    } 

    user_fields = {
        'id': fields.Integer,
        'name': fields.String,
        'email_address': fields.String,
        'contact_number': fields.String
    }

    @marshal_with(camera_fields)
    def get(self):
        LOGGER.debug('Received get request for camera')
        args = self.req_parser.parse_args()
        LOGGER.debug('Parsed Args for site_id: {}'.format(args))

        try:
            site = db.session.query(Site).filter(Site.id == args['site_id']).first()     
            if(not site):
                LOGGER.warn('Site not found for site_id: {}'.format(args['site_id']))
                return SITE_NOT_FOUND

            cameras = db.session.query(Camera).filter(Camera.site_id == site.id).all()   #All cameras at our site
            if(not cameras):
                LOGGER.warn('No cameras found for site with site_id: {}'.format(args['site_id']))
                return CAMERA_NOT_FOUND

            for camera in cameras:
                cv2.VideoCapture(camera.ip_address).read()       

        except SQLAlchemyError as e:
            LOGGER.error("Database error encountered: {}".format(e))
            return DB_NOT_AVAILABLE
        except: 
            LOGGER.error("Encountered unknown error: {}".format(traceback.format_exc()))
            return DB_NOT_AVAILABLE
