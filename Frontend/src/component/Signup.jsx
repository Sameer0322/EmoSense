import { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import "./Signup.css";



export default function Signup(props) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const handleSignUp = async (event) => {

    event.preventDefault();
    let response

    try {
      response = await axios.post('http://localhost:3000/register', {
      username,
      password,
      name,
      });
      
      if(response.data.ok) {
        props.showalert("Account created successfully.", "success");
        props.setUsername(username)
        navigate('/TeacherDashboard')
      } else {
        props.showalert("Invalid Credentials.", "danger");

        console.log(response.data.message)
      }
    } catch (err) {
      console.log(err.message, response.data.message)
    }
  };
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
    <div className="flex min-h-full flex-1  justify-center  mt-8 ">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
  <img src="src\component\img\gi3.gif" className=" img ml-20" alt="Logo" />
    {/* <img src="src\component\img\ILl1.png" className="h-60  image-to-slide-and-bounce " alt="Logo" /> */}
      {/* Your Company Logo */}
    </div>
    <div className=" sm:mx-auto w-full sm:w-full  sm:max-w-sm borderr ml-14">
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 ">
        Sign Up for an Account
      </h2>
  <br /><br />
      <form className="space-y-6" onSubmit={handleSignUp}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 text-left">
            Name
          </label>
          <div className="mt-2">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 text-left">
            Username
          </label>
          <div className="mt-2">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 text-left ">
            Password
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className='center'>
          <button
            type="submit"
            className="flex w-auto justify-center rounded-full bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white
            shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign Up
          </button>
        </div>
        <p className="mt-10 text-center text-sm text-gray-500">
             Have an account?{' '}
            <Link  to="/signin" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ">
              Sign In
            </Link>
          </p>
      </form>
    </div>
  </div>
  );
}
