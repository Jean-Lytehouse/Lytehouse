import flask
from flask import request, jsonify, json
import json
from darkflow.net.build import TFNet
import cv2
import numpy as np
import pprint as pp
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import requests
import base64
import os

app = flask.Flask(__name__)
app.config["DEBUG"] = True


def load_model():
    """
    Function to specify details about the model. This function is
    only called once in the beginning to load model into the memory
    
    :param: None
    :return: TFNet Object (the model)
    """
    options = {"model": "cfg/yolo.cfg",
            "load": "bin/yolo.weights",
            "threshold": 0.1}

    tfnet = TFNet(options)
    return tfnet


def boxing(original_img, predictions):
    """
    Function to draw bounding boxes on the images
    to visually display the detected label. The function
    will draw a bounding box with the label and the confidence
    score.

    :param: original_img : image object
    :param: predictions : List with semantic information about the labels
    :return: newImage : image object with bounding boxes
    """
    newImage = np.copy(original_img)

    for result in predictions:
        top_x = result['topleft']['x']
        top_y = result['topleft']['y']

        btm_x = result['bottomright']['x']
        btm_y = result['bottomright']['y']

        confidence = result['confidence']
        label = result['label'] + " " + str(round(confidence, 3))

        if confidence > 0.3:
            newImage = cv2.rectangle(newImage, (top_x, top_y), (btm_x, btm_y), (255, 0, 0), 3)
            newImage = cv2.putText(newImage, label, (top_x, top_y - 5), cv2.FONT_HERSHEY_COMPLEX_SMALL, 0.8,
                                   (0, 230, 0), 1, cv2.LINE_AA)

    return newImage


def return_predictions_recur(filepath, destination, tfnet):
    """
    This function recursively loads images from the specified
    filepath (input folder) and passes it to a function for further
    processing which is the prediction of various labels

    :param: filepath : String containing the input path 
    :param: destination : String containing the destination path
    :param: tfnet : TFNet Object
    :return: output_jsons : JSON containing all the detected images
    """
    path = filepath
    files = []
    for r, d, f in os.walk(path):
        for file in f:
            if '.jpg' in file:
                files.append(os.path.join(r, file))
    
    output_jsons = {}
    for f in files:
        output_jsons[f.split('/')[-1]] = return_predictions(f,destination,tfnet)

    return jsonify(output_jsons)


def return_predictions(image_path, destination_path, tfnet):
    """
    This function does the main processing and detects labels within 
    the image. It also generates an image with bounding box and base64
    encodes it to be sent as the POST data upon request.

    :param: image_path : String containing single image path
    :param: destination : String containing the destination path
    :param: tfnet : TFNet Object
    :return: output_json : JSON object containing image semantics (labels, confidence, base64)
    """
    print(image_path)
    print(destination_path)
    original_img = cv2.imread(image_path)
    original_img = cv2.cvtColor(original_img, cv2.COLOR_BGR2RGB)
    results = tfnet.return_predict(original_img)

    final_list = []
    labels = ['cell phone', 'stop sign', 'traffic light']
    for i in range(len(results)):
        if results[i]['label'] in labels:
            final_list.append(results[i])

    plt.axis('off')
    plt.imshow(boxing(original_img, final_list))
    plt.savefig(destination_path + "/" + str(image_path.split('/')[-1]), bbox_inches='tight', transparent=True)

    ret_list = final_list
    labels_recognised = []
    confidence_scores = []

    for i in range(len(ret_list)):
        labels_recognised.append(final_list[i]['label'])
        confidence_scores.append(final_list[i]['confidence'])

    with open(destination_path + "/" + str(image_path.split('/')[-1]), 'rb') as image_file:
        encoded_string = base64.b64encode(image_file.read())

    output_json = { "labels":str(labels_recognised),
                    "image":encoded_string,
                    "confidence":str(confidence_scores)}

    return output_json

@app.route('/predict_image', methods=['POST'])
def get_image_prediction():
    """
    Function to get the request header and pass it into the
    recursive function to process the images
    """
    if request.headers['Content-Type'] == 'application/json':
        response = request.get_json()
        filepath = response["filepath"]
        destination = response["destination"]
        return return_predictions_recur(str(filepath), str(destination), tfnet)


@app.route('/', methods=['GET'])
def home():
    return "<h1>Insert some awesome text<h1>"

if __name__ == "__main__":
    tfnet = load_model() # loads model into memory
    app.run(host='0.0.0.0', port=8090)