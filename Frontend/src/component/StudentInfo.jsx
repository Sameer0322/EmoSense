// import React from 'react'
import { Chart } from "react-google-charts";

export const data = [
    ["Task", "Hours per Day"],
    ["Dis-Engaged", 7],
    ["Engaged", 12],
    ["Highly-Engaged", 5]
  ];
  
  export const options = {
    title: "Student's Engagement Analysis",
  };

const StudentInfo = () => {
  return (
    <div>
<div className="bg-gray-700 font-sans h-screen w-full flex flex-row justify-center items-center ml-20">
  <div className="card w-96 mx-auto bg-white  shadow-xl hover:shadow">
     <img className="w-32 mx-auto rounded-full -mt-20 border-8 border-white" src="https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg" alt=""/>
     <div className="text-center mt-2 text-3xl font-medium">Student Name</div>
     <div className="text-center mt-2 font-light text-sm">Roll Number:989089380"</div>
     <div className="text-center font-normal text-lg">Branch</div>
     <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
    />
  </div>
</div>
    </div>
  )
}

export default StudentInfo