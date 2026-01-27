"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Header from "../../_components/header";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  positionName: string;
  labels: string[];
  dataSet: number[];
};

const BarGraphContainer = ({ positionName, labels, dataSet }: Props) => {
  const { theme } = useTheme();
  const [resolvedColor, setResolvedColor] = useState("#000");

  useEffect(() => {
    const isDarkMode =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setResolvedColor(isDarkMode ? "#fff" : "#000");
    ChartJS.defaults.color = isDarkMode ? "#fff" : "#000";
  }, [theme]);

  const options = {
    indexAxis: "y" as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: resolvedColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: resolvedColor,
          font: (context: any) => ({
            size: (context.chart.width || 0) < 600 ? 12 : 17,
          }),
        },
      },
      y: {
        ticks: {
          color: resolvedColor,
          font: (context: any) => ({
            size: (context.chart.width || 0) < 600 ? 12 : 17,
          }),
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Total Votes",
        data: dataSet,
        borderColor: "rgb(21, 128, 61)",
        backgroundColor: "rgb(34, 197, 94)",
      },
    ],
  };

  return (
    <div className="w-full">
      <div className="text-center">
        <Header text={positionName} />
      </div>
      <Bar key={theme} options={options} data={data} />
    </div>
  );
};

export default BarGraphContainer;
