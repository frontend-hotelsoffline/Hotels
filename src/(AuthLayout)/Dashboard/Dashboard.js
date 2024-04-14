"use client";
import React from "react";
import { BiCoinStack } from "react-icons/bi";
import { LiaCoinsSolid } from "react-icons/lia";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Table } from "antd";

const Dashboard = () => {
  const dataSource = [
    {
      key: '1',
      id: 'id',
      country: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      status: 'country',
      paid: 42,
      datecreated: '10 Downing Street',
    },
  ];
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'date created',
      dataIndex: 'datecreated',
      key: 'datecreated',
    },
    {
      title: 'total',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'paid',
      dataIndex: 'paid',
      key: 'paid',
    },
    {
      title: 'status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  const data = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Total Revenue",
        data: [65, 59, 80, 81, 56],
        backgroundColor: "blue",
        borderWidth: 0,
        borderRadius: 20,
        barThickness: 10,
        margin: 10,
      },
      {
        label: "Total Earnings",
        data: [65, 59, 80, 81, 56],
        backgroundColor: "#E9E9E9",
        borderColor: "rgba(75, 92, 92, 1)",
        borderWidth: 0.3,
        borderRadius: 20,
        barThickness: 10,
      },
    ],
    
  };

  const Card = ({ bgcolor, title, color, icon, amount, text }) => (
    <div>
      <h1 className="text-md font-semibold">{title}</h1>
      <div className={`border-[#E9E9E9] border flex items-center justify-evenly shadow-xl text-white text-xl rounded-xl h-40 w-[17vw]`}>
        <div className={`p-2 ${bgcolor} flex items-center justify-center rounded-full w-[50px] h-[50px]`}>{icon}</div>
       <div  className={`text-center text-sm ${color}`}><h1>{amount}</h1>
        <p>{text}</p></div>
      </div>
    </div>
  );
  return (
    <section>
      <div className="flex justify-between">
        <Card
          bgcolor="bg-green-500"
          color="text-green-500"
          title="Revenue"
          icon={<LiaCoinsSolid />}
          amount="$ 12,207"
          text="Totoal Revenue"
        />
        <Card
          bgcolor="bg-blue-500"
          color="text-blue-500"
          title="Earnings"
          icon={<BiCoinStack />}
          amount="$ 12,207"
          text="Totoal Earnings"
        />
        <Card
          bgcolor="bg-purple-700"
          color="text-purple-700"
          title="Search"
          icon={<BiCoinStack />}
          amount="$ 12,207"
          text="Totoal Bookings"
        />
        <Card
          bgcolor="bg-yellow-500"
          color="text-yellow-500"
          title="Services"
          icon={<BiCoinStack />}
          amount="$ 12,207"
          text="Totoal Services"
        />
        <Card
          bgcolor="bg-red-500"
          color="text-red-500"
          title="Wallet"
          icon={<BiCoinStack />}
          amount="$ 12,207"
          text="Totoal Balance"
        />
      </div>
      <div className="w-full h-80 my-5">
        <Bar data={data}/>
      </div>
      <h1 className="my-5 text-xl">Recent Bookings</h1>
      <Table dataSource={dataSource} columns={columns} />
    </section>
  );
};

export default Dashboard;
