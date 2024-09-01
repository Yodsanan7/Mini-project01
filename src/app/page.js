"use client";

import React, { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import styles from './Dashboard.module.css';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [lastData, setLastData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [selectedChart, setSelectedChart] = useState('doughnut');
  const [color1, setColor1] = useState('rgba(255, 159, 64, 0.6)');
  const [color2, setColor2] = useState('rgba(255, 99, 132, 0.6)');

  // State สำหรับควบคุมสีไฟ LED
  const [ledColor, setLedColor] = useState({ r: 255, g: 0, b: 0 });

  // ฟังก์ชันสำหรับเปลี่ยนสีไฟ LED
  function handleColorChange(event) {
    const { name, value } = event.target;
    setLedColor((prevColor) => ({ ...prevColor, [name]: value }));

    // ส่งคำสั่งไปยัง API เพื่อเปลี่ยนสีไฟ LED
    fetch("/api/rgb", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        r: ledColor.r,
        g: ledColor.g,
        b: ledColor.b,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Color change response:", data);
      })
      .catch((error) => {
        console.error("Error changing LED color:", error);
      });
  }

  async function fetchLastData() {
    try {
      const res = await fetch("/api/lastestData");
      const data = await res.json();
      setLastData(data);
    } catch (error) {
      console.error("Error fetching latest data:", error);
    }
  }

  async function fetchAllData() {
    try {
      const res = await fetch("/api/alldata");
      const data = await res.json();
      setAllData(data);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  }

  const doughnutChartData = lastData.length > 0 ? {
    labels: ['Temperature', 'Distance'],
    datasets: [{
      label: 'Sensor Data',
      data: [
        lastData.reduce((sum, dataPoint) => sum + dataPoint.temp, 0),
        lastData.reduce((sum, dataPoint) => sum + dataPoint.distance, 0)
      ],
      backgroundColor: [
        color1,
        color2,
      ],
    }],
  } : null;

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: function (tooltipItem) {
            return tooltipItem[0].label;
          },
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
      cutout: '70%',
    },
  };

  const lineChartData1 = allData.length > 0 ? {
    labels: allData.map((dataPoint) =>
      new Date(dataPoint.date).toLocaleString('th-TH', {
        timeZone: 'Asia/Bangkok',
        dateStyle: 'short',
        timeStyle: 'short',
      })
    ),
    datasets: [
      {
        label: 'LDR',
        data: allData.map((dataPoint) => dataPoint.ldr),
        fill: false,
        borderColor: color1,
        tension: 0.1,
      },
      {
        label: 'VR',
        data: allData.map((dataPoint) => dataPoint.vr),
        fill: false,
        borderColor: color2,
        tension: 0.1,
      },
    ],
  } : null;

  const lineChartData2 = allData.length > 0 ? {
    labels: allData.map((dataPoint) =>
      new Date(dataPoint.date).toLocaleString('th-TH', {
        timeZone: 'Asia/Bangkok',
        dateStyle: 'short',
        timeStyle: 'short',
      })
    ),
    datasets: [
      {
        label: 'Temperature',
        data: allData.map((dataPoint) => dataPoint.temp),
        fill: false,
        borderColor: color1,
        tension: 0.1,
      },
      {
        label: 'Distance',
        data: allData.map((dataPoint) => dataPoint.distance),
        fill: false,
        borderColor: color2,
        tension: 0.1,
      },
    ],
  } : null;

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: function (tooltipItem) {
            return tooltipItem[0].label;
          },
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
      title: {
        display: true,
        text: 'Sensor Data Trends Over Time',
      },
    },
  };

  useEffect(() => {
    fetchLastData();
    fetchAllData();

    const intervalId = setInterval(() => {
      fetchLastData();
      fetchAllData();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.heading}>Dashboard</h1>

      {/* ควบคุมการเปลี่ยนสีของกราฟ */}
      <div className={styles.colorControls}>
        <div>
          <label>Chart Color 1: </label>
          <input
            type="color"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
          />
        </div>
        <div>
          <label>Chart Color 2: </label>
          <input
            type="color"
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
          />
        </div>
      </div>

      {/* ควบคุมการเปลี่ยนสีของไฟ LED */}
      <div className={styles.ledColorControls}>
        <h2>Control LED Color</h2>
        <div>
          <label>LED Color Red (R): </label>
          <input
            type="number"
            name="r"
            value={ledColor.r}
            onChange={handleColorChange}
            max={255}
            min={0}
          />
        </div>
        <div>
          <label>LED Color Green (G): </label>
          <input
            type="number"
            name="g"
            value={ledColor.g}
            onChange={handleColorChange}
            max={255}
            min={0}
          />
        </div>
        <div>
          <label>LED Color Blue (B): </label>
          <input
            type="number"
            name="b"
            value={ledColor.b}
            onChange={handleColorChange}
            max={255}
            min={0}
          />
        </div>
      </div>

      {/* แสดงกราฟ */}
      <div className={styles.chartRow}>
        {selectedChart === 'doughnut' && lastData.length > 0 && doughnutChartData ? (
          <div className={styles.chartContainer}>
            <h2>Doughnut Chart: Temperature and Distance</h2>
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        ) : selectedChart === 'line1' && allData.length > 0 && lineChartData1 ? (
          <div className={styles.chartContainer}>
            <h2>Line Chart: LDR & VR Trends</h2>
            <Line data={lineChartData1} options={lineChartOptions} />
          </div>
        ) : selectedChart === 'line2' && allData.length > 0 && lineChartData2 ? (
          <div className={styles.chartContainer}>
            <h2>Line Chart: Temperature & Distance Trends</h2>
            <Line data={lineChartData2} options={lineChartOptions} />
          </div>
        ) : (
          <p>No data available for the selected chart</p>
        )}
      </div>
    </div>
  );
}
