import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import styles from "./Section4.module.css";

const Section4 = ({ content, setContent }) => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "PM10",
        data: [],
      },
      {
        name: "PM25",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "line",
        height: "100%",
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        type: "datetime",
        title: {
          text: "Time",
        },
        labels: {
          formatter: function (value) {
            const date = new Date(value);
            return date.toLocaleTimeString(); // 시:분:초 형식으로 표시
          },
        },
      },
      yaxis: {
        title: {
          text: "Value",
        },
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      markers: {
        size: 5,
      },
      tooltip: {
        x: {
          formatter: function (value) {
            const date = new Date(value);
            return date.toLocaleTimeString(); // 시:분:초 형식으로 툴팁 표시
          },
        },
      },
      colors: ["#FF6384", "#36A2EB"],
      legend: {
        position: "top",
        horizontalAlign: "center",
      },
      grid: {
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        },
      },
    },
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.93:8000/accountapp/sensor/"
      );
      const data = response.data;

      console.log("Received data: ", data);

      const seriesPM10 = data.map((entry) => {
        return { x: new Date(entry.date), y: parseFloat(entry.pm10) };
      });
      const seriesPM25 = data.map((entry) => {
        return { x: new Date(entry.date), y: parseFloat(entry.pm25) };
      });

      setChartData((prev) => ({
        ...prev,
        series: [
          {
            name: "PM10",
            data: seriesPM10,
          },
          {
            name: "PM25",
            data: seriesPM25,
          },
        ],
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.section}>
      <div className={styles.content}>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={350}
          width={700}
        />
      </div>
    </div>
  );
};

export default Section4;
