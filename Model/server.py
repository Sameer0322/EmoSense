from flask import Flask, request, jsonify
from flask_cors import CORS 
import subprocess
import psutil
import time
import pymongo
import os
from colorama import Fore
from signal import signal, SIGTERM


app = Flask(__name__)
CORS(app)  # Enable CORS Policy for all routes
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173/dashboard"}})    . If you want to enable CORS for specific routes

is_running = False
curr_process = None

# def is_test_py_running():
#     for process in psutil.process_iter(['pid', 'name']):
#         # print(process.info['name'])
#         if process.info['name'] == 'python' and 'Emotion_Analyzer.py' in process.info['cmdline']:
#             return True
#     return False

@app.route('/main', methods = ['POST'])

def main():

    global curr_process, is_running
    
    data = request.get_json()
    print(data)
    with open('username.txt', 'w') as file:
        file.write(data['username'] + data['date'] + data['subject'])

    if not is_running:
        print('Starting the session')
        is_running = True
        curr_process = subprocess.Popen(['python', 'Emotion_Analyzer.py'])
    else:
        print('Session is already started.')
    return jsonify({'message': 'Request processed successfully'})

@app.route('/stop', methods = ['POST'])
def stop():

    global curr_process, is_running
    print('process running: ', is_running)

    if is_running:
        print('Process Name: ', curr_process)
        print('Stopping the session')
        curr_process.terminate()

        # Send a SIGTERM signal to the subprocess
        os.kill(curr_process.pid, SIGTERM)
        curr_process.wait()  # Wait for the process to finish
        is_running = False

    return jsonify({'message': 'Request processed successfully'})
    


@app.route('/end', methods = ['POST'])
def end():
    data = request.get_json()

    # Connect to MongoDB database and get data
    mongodb_uri = os.getenv("MONGODB_URI")
    client = pymongo.MongoClient(mongodb_uri)

    #use a database
    db = client["EA"]
    session_id = data['username'] + data['date'] + data['subject']
    studentCollection = db[session_id]
    students = list(studentCollection.find({}))
    ci = {}

    for student in students:
        ci_val = student['weight']/(student['count']*4.5)
        ci[student['s_rollNo']] = ci_val

    print('\033[033m'+"----------------------------------------\033[0m")
    print('\033[033m'+"|   Roll No      | Engagement Analysis |\033[0m")
    print('\033[033m'+"----------------------------------------\033[0m")
    
    for rollNo, ci_val in ci.items():
        if(ci_val<0.25):
            print( "\033[31m" + "| " + rollNo + " | Dis-Engaged |\033[0m" )
        elif(ci_val<=0.65):
            print( "\033[34m" + rollNo + " | Engaged |\033[0m" )
        else:
            print( "\033[32m" + rollNo + " | Highly-Engaged |\033[0m" )
        print('\x1b[033m'+"----------------------------------------\033[0m")
    return jsonify({'message': 'Request processed successfully'})


if __name__ == '__main__':
    app.run(port = 4000)