import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import "./End.css"
import axios from 'axios'
import Header from './Header';

function End() {
  const [sessionEnded, setSessionEnded] = useState(false);
  const navigate = useNavigate()

  const endSession = async (event) => {
    event.preventDefault();
    
    try {
      navigate('/TeacherSession')
      await axios.post('http://127.0.0.1:4000/stop')
    } catch (Err) {
      console.log({ 'error' : Err, 'message': Err.message });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="animate-fadeIn"></div>
      <img src="src/component/img/G.gif" className="h-80 image-to-slide-and-bounce mr-40   " alt="Logo" />
      <form method='POST' onSubmit={ endSession }>
      {/* <NavLink */}
        {/* to="/TeacherSession"> */}
        <button className='flex w-auto justify-center rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white
                   shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
        
          End Session
        </button>
        {/* </NavLink> */}
      </form>
    </div>
  );
}

export default End;