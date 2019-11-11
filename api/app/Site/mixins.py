from flask_restful import reqparse


class SiteMixin(object):

    req_parser = reqparse.RequestParser()
    req_parser.add_argument('site_id', type=int, required=True, help = 'Invalid site_id requested. Site_id\'s should be of type int.')
    