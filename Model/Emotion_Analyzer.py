import face_recognition
import os
import sys
import cv2
import numpy as np
import math
import dlib
from keras.models import model_from_json
from imutils import face_utils
import pymongo
import time
from dotenv import load_dotenv
import io
from PIL import Image
import matplotlib.pyplot as plt
import signal

# Load environment variables from the .env file
load_dotenv()

def handle_sigterm(signum, frame):

    print('Received SIGTERM. Closing camera and stopping the model...')
    # Add code here to close the camera and stop the model gracefully
    cv2.destroyAllWindows()  # Close the camera window
    # ml_model.stop()  # Stop your ML model (replace with the actual function to stop your model)
    exit(0)

def face_confidence(face_distance, face_match_threshold=0.6):
    # Function for face recognition confidence calculation
    range_val = (1.0 - face_match_threshold)
    linear_val = (1.0 - face_distance) / (range_val * 2.0)

    if face_distance > face_match_threshold:
        return str(round(linear_val * 100, 2)) + '%'
    else:
        value = (linear_val + ((1.0 - linear_val) * math.pow((linear_val - 0.5) * 2, 0.2))) * 100
        return str(round(value, 2)) + '%'


# Function to compute distance between two points
def compute(ptA, ptB):
    # Function to compute distance between two points
    dist = np.linalg.norm(ptA - ptB)
    return dist

# Function to determine eye state (sleepy, drowsy, active)
def blinked(a, b, c, d, e, f):
    # Function to determine eye state 
    up = compute(b, d) + compute(c, e)
    down = compute(a, f)
    ratio = up / (2.0 * down)

    if ratio > 0.25:
        return 2
    elif 0.21 < ratio <= 0.25:
        return 1
    else:
        return 0

# Load emotion recognition model
def load_emotion_model():
    # Function to load the emotion recognition model 
    f_json = open("./emotiondetector.json", "r")
    m_json = f_json.read()
    f_json.close()
    model = model_from_json(m_json)
    model.load_weights("./emotiondetector.h5")
    return model

# Connect to MongoDB database and get data

mongodb_uri = os.getenv("MONGODB_URI")
client = pymongo.MongoClient(mongodb_uri)
#Create or use a database
db = client["EA"]
#Create or use a collection within the database
collection = db["student_data"]
studentCollection = db["student"]

class FaceRecognition:
    
    def __init__(self):
        # Initialize face recognition variables 
        self.face_locations = []
        self.face_encodings = []
        self.face_names = []
        self.process_current_frame = True
        # Load known faces and their encodings for recognition
        self.known_face_names = []
        self.known_face_encodings = []

        # Retrieve data of registered students
        self.data = studentCollection.find({})

        #map emotions to values
        self.emotion_values = {
            'neutral': 0.9,
            'sad': 0.3,
            'happy': 0.6,
            'surprise': 0.6,
            'fear': 0.3,
            'angry': 0.25,
            'disgust': 0.2,
        }

        #map eye_state to values
        self.eye_state_values = {
            'Active': 5,
            'Drowsy': 1.5,
            'Sleepy': 0
        }

        # Retrive username of teacher
        file = open('username.txt', 'r')
        self.session_id = file.read()


        self.encode_faces()
        self.start_time = time.time()

        # Load emotion detection model
        self.emotion_model = load_emotion_model()

    def encode_faces(self):
        # Encoding known faces for recognition 
        for student in self.data:
            img = (Image.open(io.BytesIO(student['image'])))
            face_image = np.array(img)
            face_encodings = face_recognition.face_encodings(face_image)
            if face_encodings:
                self.known_face_encodings.append(face_encodings[0])
                self.known_face_names.append(student['s_name'] + "_" + student['s_rollNo'] + "_" + student['s_section'])   


    def feature_extraction(self, image):
        feature = np.array(image)
        feature = feature.reshape(1, 48, 48, 1)
        return feature / 255.0


    def run_recognition(self):
        # Initialize video capture
        video_capture = cv2.VideoCapture(0)  #to Use Mobile Camera cv2.VideoCapture(1)

        # Check if video source is available
        if not video_capture.isOpened():
            print('Video source not found...')
            return

        while True:
            # Read frames from the video capture
            ret, frame = video_capture.read()

            # Resize frame for processing
            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            rgb_small_frame = small_frame[:, :, ::-1]
            rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

            # Face recognition logic
            self.face_locations = face_recognition.face_locations(rgb_small_frame)
            self.face_encodings = face_recognition.face_encodings(rgb_small_frame, self.face_locations)
            self.face_names = []

            for face_encoding in self.face_encodings:
                # Compare faces for recognition
                if self.known_face_encodings:
                    matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding)
                    name = "Unknown"
                    confidence = "0"
                    face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)

                    if matches and len(face_distances) > 0:
                        best_match_index = np.argmin(face_distances)

                        if matches[best_match_index]:
                            name = self.known_face_names[best_match_index]
                            confidence = face_confidence(face_distances[best_match_index])
                    self.face_names.append((name, confidence))

            # Emotion and eye state detection for each detected face
            for (top, right, bottom, left), (name, confidence) in zip(self.face_locations, self.face_names):
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4

                # Extract face region for emotion and eye state detection
                face_region = frame[top:bottom, left:right]

                if not face_region.size == 0:
                    image = cv2.cvtColor(face_region, cv2.COLOR_BGR2GRAY)
                    image = cv2.resize(image, (48, 48))
                    img = self.feature_extraction(image)
                    pred = self.emotion_model.predict(img)
                    emotion_label = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise'][pred.argmax()]

                    # Determine eye state using landmarks
                    detector = dlib.get_frontal_face_detector()
                    predictor = dlib.shape_predictor("./shape_predictor_68_face_landmarks.dat")
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    rects = detector(gray, 0)

                    if len(rects) > 0:
                        landmarks = predictor(gray, rects[0])
                        landmarks = face_utils.shape_to_np(landmarks)
                        left_eye_state = blinked(landmarks[36], landmarks[37], landmarks[38], landmarks[41], landmarks[40], landmarks[39])
                        right_eye_state = blinked(landmarks[42], landmarks[43], landmarks[44], landmarks[47], landmarks[46], landmarks[45])

                        status = 'Inactive'
                        if left_eye_state == 2 and right_eye_state == 2:
                            status = 'Active'
                        elif left_eye_state == 1 and right_eye_state == 1:
                            status = 'Drowsy'
                        elif left_eye_state == 0 or right_eye_state == 0:
                            status = 'Sleepy'
                    else:
                        status = 'No Face Detected'
                        
                    # Display recognition, emotion, and eye state info on the frame
                    cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
                    cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), -1)
                    cv2.putText(frame, f"{name.split('_')[0]} {confidence}", (left + 6, bottom - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 1)
                    cv2.putText(frame, f"Emotion: {emotion_label}", (left, bottom + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
                    cv2.putText(frame, f"Eye State: {status}", (left, bottom + 40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)


                    current_time = time.time()

                    if current_time - self.start_time >= 1 and name[0 : 7] != 'Unknown' and status != 'No Face Detected' and status != 'Inactive':

                        session_collection = db[self.session_id]

                        s_rollNo = name.split('_')[1]
                        existing_doc = session_collection.find_one({'s_rollNo': s_rollNo})

                        if existing_doc:
                            # Update the existing document
                            existing_doc['weight'] += self.emotion_values[emotion_label] * self.eye_state_values[status]
                            existing_doc['count'] += 1
                            session_collection.update_one({'s_rollNo': s_rollNo}, {'$set': existing_doc})
                            print(f"Updated document with s_rollNo: {s_rollNo}")
                        else:
                            # Insert a new document
                            combined_info = {
                                's_rollNo': s_rollNo,
                                'weight': self.emotion_values[emotion_label] * self.eye_state_values[status],
                                'count': 1
                            }

                            session_collection.insert_one(combined_info)
                            print(combined_info)  # Placeholder for your action with the combined information
                            
                        start_time = time.time()  # Reset the timer

            
            # Display the processed frame
            cv2.imshow("Face Recognition", frame)

            # Break the loop on 'q' key press
            if cv2.waitKey(1) == ord('q'):
                break

        # Release video capture and destroy windows
        video_capture.release()
        cv2.destroyAllWindows()

# Entry point
if __name__ == '__main__':

    # Capture the signal to terminate the process
    signal.signal(signal.SIGTERM, handle_sigterm)

    fr = FaceRecognition()
    fr.run_recognition()


