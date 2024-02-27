import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Alert from "./component/Alert.jsx";
import Home from "./component/Home.jsx";
import About from "./component/About.jsx";
import Signin from "./component/Signin.jsx";
import Signup from "./component/Signup.jsx";
// import Footer from "./component/Footer.jsx";
import MyDatePicker from "./component/MyDatePicker.jsx";
import Mydatepickersecond from "./component/Mydatepickersecond.jsx";
import TeacherDashboard from "./component/TeacherDashboard.jsx";
import StudentsPortal from "./component/StudentsPortal.jsx";
import StudentInfo from "./component/StudentInfo.jsx";
import End from "./component/End.jsx";
import "./App.css";
import Header from "./component/Header.jsx";
import  Footer  from "./component/Footer.jsx";
import Gap from "./component/Gap.jsx";


function App() {
  const [alert, setAlert] = useState(null);
  const [username, setUsername] = useState('');


  const showalert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });

    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  return (
    <BrowserRouter>
      <Header />
      <Alert alert={alert}></Alert>
      <div className="container ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="signin" element={<Signin showalert={showalert}  setUsername={setUsername} />} />
          <Route path="signup" element={<Signup showalert={showalert} />} />
          <Route path="session" element={<MyDatePicker showalert={showalert}  setUsername={setUsername} username={username} />} />
          <Route path="TeacherSession" element={<Mydatepickersecond showalert={showalert} />} />
          <Route path="TeacherDashboard" element={<TeacherDashboard />} />
          <Route path="end" element={<End />} />
          <Route path="sportal" element={<StudentsPortal />} />
          <Route path="data" element={<StudentInfo />} />
        </Routes>
      </div>
      <Gap x={14}/>
      {/* <Footer/>     */}
    </BrowserRouter>
  );
}

export default App;
