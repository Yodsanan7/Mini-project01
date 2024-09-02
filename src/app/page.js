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
  const [loadingBuzzer, setLoadingBuzzer] = useState(false);
  const [buzzerError, setBuzzerError] = useState(null);

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

  async function sendNoteToBuzzer(note) {
    setLoadingBuzzer(true);
    setBuzzerError(null);

    try {
      const response = await fetch('/api/buzzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An error occurred');
      }

      alert(`Note ${note} sent successfully`);
    } catch (error) {
      setBuzzerError(error.message);
    } finally {
      setLoadingBuzzer(false);
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
        'rgba(255, 159, 64, 0.6)',
        'rgba(255, 99, 132, 0.6)',
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
          title: function(tooltipItem) {
            return tooltipItem[0].label;
          },
          label: function(tooltipItem) {
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
        borderColor: 'rgba(75, 192, 192, 0.6)',
        tension: 0.1,
      },
      {
        label: 'VR',
        data: allData.map((dataPoint) => dataPoint.vr),
        fill: false,
        borderColor: 'rgba(153, 102, 255, 0.6)',
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
        borderColor: 'rgba(255, 159, 64, 0.6)',
        tension: 0.1,
      },
      {
        label: 'Distance',
        data: allData.map((dataPoint) => dataPoint.distance),
        fill: false,
        borderColor: 'rgba(255, 99, 132, 0.6)',
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
          title: function(tooltipItem) {
            return tooltipItem[0].label;
          },
          label: function(tooltipItem) {
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

      <div className={styles.chartControls}>
        <button
          className={`btn btn-primary ${selectedChart === 'doughnut' ? 'active' : ''}`}
          onClick={() => setSelectedChart('doughnut')}
        >
          Doughnut Chart
        </button>
        <button
          className={`btn btn-secondary ${selectedChart === 'line1' ? 'active' : ''}`}
          onClick={() => setSelectedChart('line1')}
        >
          Line Chart LDR & VR
        </button>
        <button
          className={`btn btn-success ${selectedChart === 'line2' ? 'active' : ''}`}
          onClick={() => setSelectedChart('line2')}
        >
          Line Chart Temperature & Distance
        </button>
      </div>

      <div className={styles.chartRow}>
        <div className={styles.latestDataContainer}>
          <h2>Latest Data</h2>
          <table className={`table table-striped table-bordered ${styles.table}`}>
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>LDR</th>
                <th>VR</th>
                <th>Temperature</th>
                <th>Distance</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {lastData.map((ldata) => (
                <tr key={ldata.id}>
                  <td>{ldata.id}</td>
                  <td>{ldata.ldr}</td>
                  <td>{ldata.vr}</td>
                  <td>{ldata.temp}</td>
                  <td>{ldata.distance}</td>
                  <td>
                    {new Date(ldata.date).toLocaleString('th-TH', {
                      timeZone: 'Asia/Bangkok',
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

      <div className={styles.buzzerControls}>
        <h2>Control Buzzer</h2>
        <div>
          {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(note => (
            <button
              key={note}
              onClick={() => sendNoteToBuzzer(note)}
              disabled={loadingBuzzer}
            >
              {loadingBuzzer ? 'Sending...' : `Play Note ${note}`}
            </button>
          ))}
        </div>
        {buzzerError && <p>{buzzerError}</p>}
      </div>
    </div>
  );
}
