from flask_restful import reqparse


class SignupMixin(object):

    req_parser = reqparse.RequestParser()
    req_parser.add_argument('email', type=str, required=True)
    req_parser.add_argument('firstname', type=str, required=True)
    req_parser.add_argument('lastname', type=str, required=True)
    req_parser.add_argument('camera1Ip', type=str, required=True)
    req_parser.add_argument('camera1Name', type=str, required=True)
    req_parser.add_argument('camera2Ip', type=str, required=True)
    req_parser.add_argument('camera2Name', type=str, required=True)
    req_parser.add_argument('camera3Ip', type=str, required=True)
    req_parser.add_argument('camera3Name', type=str, required=True)
    req_parser.add_argument('password', type=str, required=True)


class AuthenticateMixin(object):

    req_parser = reqparse.RequestParser()
    req_parser.add_argument('email', type=str, required=True)
    req_parser.add_argument('password', type=str, required=True)


class UserProfileListMixin(object):

    req_parser = reqparse.RequestParser()
    req_parser.add_argument('event_id', type=int, required=True)