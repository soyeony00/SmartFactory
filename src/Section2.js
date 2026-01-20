import React, { useState } from "react";
import Chart from "react-apexcharts";
import styles from "./Section2.module.css";

const Section2 = () => {
  const [dailyProduction, setDailyProduction] = useState({
    percentage: 64,
    count: 64,
    showCount: false,
  });

  const [monthlyGoal, setMonthlyGoal] = useState({
    percentage: 7,
    count: 7,
    showCount: false,
  });

  const [defectRate, setDefectRate] = useState({
    percentage: 2,
    count: 2,
    showCount: false,
  });

  const toggleShowCount = (stateSetter) => {
    stateSetter((prev) => ({
      ...prev,
      showCount: !prev.showCount,
    }));
  };

  const generateChartOptions = (data, title, colors) => {
    return {
      series: [data.percentage, 100 - data.percentage],
      options: {
        chart: {
          type: "donut",
          events: {
            dataPointSelection: () => toggleShowCount((state) => state),
          },
        },
        labels: [title, ""], // 연한 부분 라벨 제거
        colors: colors,
        dataLabels: {
          enabled: true,
          formatter: (val, opts) => {
            if (opts.seriesIndex === 0) {
              return data.showCount ? `${data.count}개` : `${data.percentage}%`;
            }
            return ""; // 연한 부분 값 제거
          },
          style: {
            fontSize: "18px",
            colors: ["#333"],
          },
        },
        legend: {
          show: false,
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: title,
                  formatter: () => {
                    return data.showCount
                      ? `${data.count}개`
                      : `${data.percentage}%`;
                  },
                },
              },
            },
          },
        },
      },
    };
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>생산 현황</h2>
      <div className={styles.content}>
        <div className={styles.chartContainer}>
          <Chart
            options={
              generateChartOptions(dailyProduction, "일 생산율", [
                "#672E90",
                "#F5C8E7",
              ]).options
            }
            series={
              generateChartOptions(dailyProduction, "일 생산율", [
                "#672E90",
                "#F5C8E7",
              ]).series
            }
            type="donut"
            height={250}
            width={250}
          />
        </div>
        <div className={styles.chartContainer}>
          <Chart
            options={
              generateChartOptions(monthlyGoal, "일 목표량", [
                "#6083D1",
                "#C7D8FF",
              ]).options
            }
            series={
              generateChartOptions(monthlyGoal, "일 목표량", [
                "#6083D1",
                "#C7D8FF",
              ]).series
            }
            type="donut"
            height={250}
            width={250}
          />
        </div>
        <div className={styles.chartContainer}>
          <Chart
            options={
              generateChartOptions(defectRate, "일 가품율", [
                "#FF2020",
                "#F5C8C8",
              ]).options
            }
            series={
              generateChartOptions(defectRate, "일 가품율", [
                "#FF2020",
                "#F5C8C8",
              ]).series
            }
            type="donut"
            height={250}
            width={250}
          />
        </div>
      </div>
    </div>
  );
};

export default Section2;
