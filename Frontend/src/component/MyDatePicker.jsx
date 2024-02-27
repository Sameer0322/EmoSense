import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {Link} from 'react-router-dom'
import axios from "axios"
// import Signin from "./component/Signin.jsx";

import "./Mydatepicker.css";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MyDatePicker = (props) => {
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate()

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const startSession = async (event) => {
    event.preventDefault();
    try {
      navigate('/end')
      const result = await axios.post('http://127.0.0.1:4000/main', {
        username: props.username,
        date: selectedDate,
        subject: inputValue
      })

      console.log(result, 'result')
    } catch (err) {
      console.log({ 'error': err, 'message': err.message, })
    }

  }
  

  return (
    <div className="flex items-center shadow-xl">
      <div className="flex items-center justify-center w-1/3 ml-40">
        <img src="src/component/img/p1.png" className="h-100 home-animation" alt="Logo" />
      </div>

      <div className="flex flex-col items-center justify-start w-1/2">
        <span className="font-medium text-2xl">Dashboard </span>

        <div className="border-2 border-orange-900 my-5 p-20 rounded-md flex flex-col items-center justify-center shadow">
          <h1 className="text-xl font-medium">Choose the date and lecture.</h1>
          <div className="relative max-w-md mt-8 w-52">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select a date"
              className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring focus:border-blue-300 bg-white text-black hover:bg-gray-700 w-54 font-medium text-lg"
              style={{ backgroundColor: "white" }}
            />
          </div>
          <form  onSubmit={ startSession }>
            <div className="m-6 flex flex-col items-center justify-center">
              <div className="relative inline-block text-left">
                
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  placeholder="Enter Subject here"
                  className="border border-black bg-white text-black rounded-xl"
                  style={{ backgroundColor: "white" }}
                />
              </div>
            </div>
            {/* <Link to='/end'> */}
              <button
                type="submit"
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-white focus:outline-none bg-indigo-600 rounded-lg border border-black hover:bg-indigo-900 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-black dark:hover:bg-gray-700 flex flex-col items-center justify-start m-24 "
              >
                Submit
              </button>
            {/* </Link> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyDatePicker;