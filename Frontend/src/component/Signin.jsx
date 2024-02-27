import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useState } from "react";
import "./Signin.css";


export default function Signin(props) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const handleLogIn = async (event) => {
    
    event.preventDefault();
    let response

    try {
      response = await axios.post('http://localhost:3000/login', {
        username,
        password
      })

      if(response.data.ok) {
        props.showalert("Sign-In successfully.", "success");
        props.setUsername(username)
        localStorage.setItem('username', username)
        navigate('/TeacherDashboard')
      } else {
        props.showalert("Invalid Credentials.", "danger");

        console.log(response.data.message)
      }
    } catch (error) {
      console.log(error.message, response.data.message)
    }
  } 

    return (
        <div className="flex min-h-full flex-1  justify-center  py-12 lg: ml-43">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img src="src/component/img/ILl1.png" className="h-80 image-to-slide-and-bounce mt-10 " alt="Logo" />
            {/* <img
              className="mx-auto h-24 w-auto"
              src="/src/assets/logo3.png"
              alt="Your Company"
            /> */}
          </div>
  
          <div className="sm:mx-auto sm:w-full sm:max-w-sm borderr">
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Login in to your account
            </h2>
            <form className="space-y-6" method="POST" onSubmit={ handleLogIn }>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900  text-left	">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    // autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    // autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
  
              <div className="center">
                <button
                  type="submit"
                  className="flex w-auto justify-center rounded-full bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white
                   shadow-sm hover:bg-indigo-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 " 
                >
                  Log in
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link  to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
    )
  }
  







