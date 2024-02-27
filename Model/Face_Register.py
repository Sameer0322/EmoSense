import cv2
import dlib
import tkinter as tk
from PIL import Image, ImageTk
import pymongo
from bson.binary import Binary
import io
import os
from tkinter import messagebox
import pygame
from dotenv import load_dotenv

load_dotenv()
detector = dlib.get_frontal_face_detector()
mongodb_uri = os.getenv("MONGODB_URI")
client = pymongo.MongoClient(mongodb_uri)
db = client["EA"]
collection = db["student"]

class FaceRegister:
    def __init__(self):
        self.input_name = ""

        self.win = tk.Tk()
        self.win.title("Face Register")
        self.win.geometry("800x700")

        self.label = tk.Label(self.win)
        self.label.pack()

        self.frame_right_info = tk.Frame(self.win)
        
        # Headings for input fields
        tk.Label(self.frame_right_info, text="NAME").grid(row=0, column=0, sticky=tk.W, padx=5, pady=5)
        tk.Label(self.frame_right_info, text="ROLL NO.").grid(row=1, column=0, sticky=tk.W, padx=5, pady=5)
        tk.Label(self.frame_right_info, text="SECTION").grid(row=2, column=0, sticky=tk.W, padx=5, pady=5)
        
        # Separate entry fields for name, roll number, and section
        self.name_entry = tk.Entry(self.frame_right_info)
        self.name_entry.grid(row=0, column=1, sticky=tk.W, padx=5, pady=5)
        
        self.roll_entry = tk.Entry(self.frame_right_info)
        self.roll_entry.grid(row=1, column=1, sticky=tk.W, padx=5, pady=5)
        
        self.section_entry = tk.Entry(self.frame_right_info)
        self.section_entry.grid(row=2, column=1, sticky=tk.W, padx=5, pady=5)
        
        self.input_name_button = tk.Button(self.frame_right_info, text="Capture", command=self.capture)
        self.input_name_button.grid(row=3, columnspan=2, padx=5, pady=5)
        self.frame_right_info.pack()

        self.cap = cv2.VideoCapture(0)
        self.process()
        self.win.mainloop()

    def process(self):
        ret, frame = self.cap.read()

        if ret:
            frame = cv2.flip(frame, 1)
            faces = detector(frame, 0)
            for face in faces:
                x, y, w, h = face.left(), face.top(), face.width(), face.height()
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(frame)
            imgtk = ImageTk.PhotoImage(image=img)
            self.label.imgtk = imgtk
            self.label.configure(image=imgtk)
            self.label.after(10, self.process)

    def capture(self):
        name = self.name_entry.get().replace(" ", "")  # Remove spaces from name
        name  =  self.name_entry.get().replace("_","")
        roll_no = self.roll_entry.get().replace(" ", "")  # Remove spaces from roll number
        section = self.section_entry.get().replace(" ", "")  # Remove spaces from section
        
        self.input_name = f"{ name }_{ roll_no }_{ section }"
        
        if self.input_name:
            ret, frame = self.cap.read()
            if ret:
                existing_doc = collection.find_one({ 's_rollNo': roll_no })

                if existing_doc:
                    print(existing_doc)
                    print("Document with the same name already exists in MongoDB.")
                    self.data_already_present()
                    messagebox.showinfo("Capture Error", "Document with the same name already exists.")
                else:
                    image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
                    byte_io = io.BytesIO()
                    image.save(byte_io, format='PNG')
                    image_data = byte_io.getvalue()
                    image_binary = Binary(image_data)

                    data = {
                        's_name': name,
                        's_rollNo': roll_no,
                        's_section': section,
                        'image': image_binary
                    }
                    collection.insert_one(data)
                    print(f"Image saved to MongoDB for {name}")
                    self.play_confirmation_sound()
                    messagebox.showinfo("Capture Confirmation", f"Photo saved for {self.input_name}")
                    
                    self.name_entry.delete(0, tk.END)
                    self.roll_entry.delete(0, tk.END)
                    self.section_entry.delete(0, tk.END)

                    img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    img = Image.fromarray(img)
                    imgtk = ImageTk.PhotoImage(image=img)
                    self.label.imgtk = imgtk
                    self.label.configure(image=imgtk)

    def play_confirmation_sound(self):
        pygame.mixer.init()
        pygame.mixer.music.load("./assets/1702316998070c2xrobf-voicemaker.in-speech.mp3")
        pygame.mixer.music.play()

    def data_already_present(self):
        pygame.mixer.init()
        pygame.mixer.music.load("./assets/1702317567475uw0wjnz-voicemaker.in-speech.mp3")
        pygame.mixer.music.play()

def main():
    FaceRegister()

if __name__ == '__main__':
    main()