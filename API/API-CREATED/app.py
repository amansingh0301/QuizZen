import numpy as np
import flask
from flask import Flask, request
import pickle
from model import *


app = flask.Flask(__name__)
# model = pickle.load(open('nb-predictor.pkl', 'rb'))

# @app.route('/',methods=['GET'])
# def home():
#     return str("DEEPANSHU AND AYSUH")

@app.route('/',methods=['GET'])
def home():
    topic = str(request.args['topic'])
    QUESTIONS = final(topic)
    return str(QUESTIONS)


# @app.route('/dhek_lo',methods=['GET'])
# def predict():
#     topic = str(request.args['topic'])
#     questions = final(topic)
#     return 'OK'


   
# print(str(final('apple')))