import React from "react";
import { Link, NavLink } from "react-router-dom";
export default function Header() {
  return (
    <header className="  m-0 top-0 rounded-full px-14 py-4">
      <nav className=" border border-black-500 px-4 lg:px-6 py-2.5 rounded-full shadow-2xl ">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            <img src="src\assets\logo3.png" className="mr-3 h-14" alt="Logo" />
            <span className="font-medium">Engagement Analyzer</span>
          </Link>

          <div className="flex justify-center items-center lg:justify-start lg:items-center">
            <div className="flex flex-col lg:flex-row lg:space-x-8 font-medium">
              <NavLink
              to="/"
                className={(isActive) =>
                  `block w-28 py-2 pr-4 pl-3 duration-200 ${
                    isActive ? "gray" : "orange"
                  }"text-white  hover:bg-indigo-500 focus:ring-4 focus:ring-orange-300 font-medium 
                  rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/TeacherDashboard"
                className={(isActive) =>
                  `block py-2 pr-4 pl-3 duration-200 ${
                    isActive ? "gray" : "orange"
                  }text-white  hover:bg-indigo-500	 focus:ring-4 focus:ring-orange-300 font-medium 
                  rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none`
                }
              >
                DashBoard
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
