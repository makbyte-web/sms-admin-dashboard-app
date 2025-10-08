"use client";

import React from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Mon", Present: 30 },
  { name: "Tue", Present: 20 },
  { name: "Wed", Present: 20 },
  { name: "Thu", Present: 18 },
  { name: "Fri", Present: 20 },
  { name: "Sat", Present: 30 },
];

const Chart = () => {
  return (
    <div className="container mt-4 h-[450px] shadow rounded-2xl p-5 max-w-full bg-gradient-to-r from-indigo-400 to-indigo-600 dark:from-gray-900 dark:to-gray-700">
      <h2 className="mb-5 text-white text-2xl dark:text-white">
        All Over Attendance
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 40,
          }}
        >
          <XAxis
            dataKey="name"
            stroke="currentColor"
            tick={{ fill: "white" }}
          />
          <YAxis stroke="currentColor" tick={{ fill: "white" }} />
          <Tooltip
            contentStyle={{
              background: "#222",
              border: "none",
            }}
            labelStyle={{ color: "#666" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="Present"
            stroke="white"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
