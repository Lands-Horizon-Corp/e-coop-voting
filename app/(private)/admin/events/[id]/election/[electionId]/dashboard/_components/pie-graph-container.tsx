import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Header from "../../_components/header";
import { useTheme } from "next-themes";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
   positionName: string;
   labels: string[];
   dataSet: number[];
};

export function PieGraphContainer({ positionName, labels, dataSet }: Props) {
   
   const { theme } = useTheme()
   
   ChartJS.defaults.color= theme === "dark" ? "#fff" :"#000"
   
   const options = {
      plugins: {
         legend: {
            position: "right" as const,
            labels: {
               font: {
                  size:17
               },
            },
         },
         responsive: true,
         
      },
   };
   const data = {
      labels,
      datasets: [
         {
            label: "Total Votes",
            data: dataSet,
            backgroundColor: [
               "#BDE2B9", // --pf-v5-chart-color-green-100
               "#7CC674", // --pf-v5-chart-color-green-200
               "#4CB140", // --pf-v5-chart-color-green-300
               "#38812F", // --pf-v5-chart-color-green-400
               "#23511E"  // --pf-v5-chart-color-green-500
           ],
           borderColor: [
               "#BDE2B9",
               "#7CC674",
               "#4CB140",
               "#38812F",
               "#23511E"
           ]
         },
      ],
   };

   return (
      <div className="w-1/2 flex justify-center flex-col">
         <div className="text-center">
            <Header text={positionName}></Header>
         </div>
         <div className="flex justify-center h-full">
            <Pie options={options} data={data} />
         </div>
      </div>
   );
}
