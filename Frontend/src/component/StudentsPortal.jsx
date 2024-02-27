// StudentsPortal.js
import React from "react";
import Row from "./Row";

const StudentsPortal = () => {
  const students = [
    {
      name: "Kushal Gupta",
      rollNumber: "2101640100151",
      section: "CS-Elite",
      engagementAnalysis: 30, // Change engagementAnalysis to a number (without "%")
    },
    {
      name: "Sahil Panjwani",
      rollNumber: "2101640100230",
      section: "CS-Elite",
      engagementAnalysis: 80, // Change engagementAnalysis to a number (without "%")
    },
    {
      name: "Sameer Saxena",
      rollNumber: "2101640100227",
      section: "CS-Elite",
      engagementAnalysis: 30, // Change engagementAnalysis to a number (without "%")
    },
    {
      name: "Shubham Shukla",
      rollNumber: "2101640100260",
      section: "CS-Elite",
      engagementAnalysis: 80, // Change engagementAnalysis to a number (without "%")
    },
    {
      name: "Satyam Trivedi",
      rollNumber: "2101640100138",
      section: "CS-Elite",
      engagementAnalysis: 30, // Change engagementAnalysis to a number (without "%")
    }

  ];
  return (
    <div>
      <div className="relative overflow-x-auto my-8 ml-52">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Student name
              </th>
              <th scope="col" className="px-6 py-3">
                Roll Number
              </th>
              <th scope="col" className="px-6 py-3">
                Section
              </th>
              <th scope="col" className="px-6 py-3">
                Engagement Analysis
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <Row key={index} student={student} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsPortal;
