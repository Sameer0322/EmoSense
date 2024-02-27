import React from "react";
import Row from "./Row";

const Table = ({ students }) => {
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
                Progress
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

export default Table;