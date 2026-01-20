// 설치 명령: npm install react-apexcharts apexcharts
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import styles from "./Section3.module.css";

const Section3 = ({ content, setContent }) => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Temperature",
        data: [],
      },
      {
        name: "Humidity",
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
      colors: ["#4bc0c0", "#9966ff"],
      legend: {
        position: "top",
        horizontalAlign: "center",
      },
      grid: {
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10, // 내부 여백 최소화
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

      const seriesTemperature = data.map((entry) => {
        return { x: new Date(entry.date), y: parseFloat(entry.temperature) };
      });
      const seriesHumidity = data.map((entry) => {
        return { x: new Date(entry.date), y: parseFloat(entry.humidity) };
      });

      setChartData((prev) => ({
        ...prev,
        series: [
          {
            name: "Temperature",
            data: seriesTemperature,
          },
          {
            name: "Humidity",
            data: seriesHumidity,
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
          height="350px" // 차트 높이 증가
          width="700px" // 차트 너비 증가
        />
      </div>
    </div>
  );
};

export default Section3;
