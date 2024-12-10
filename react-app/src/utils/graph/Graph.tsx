
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const labels = ["手と顔の距離", "患者との肩距離", "患者との腰距離", "肘角度", "腰角度", "特徴量6", "特徴量7"];
const data1 = [12, 11, 14, 52, 14, 32, 36];
const data2 = [22, 31, 17, 32, 24, 62, 66];

let data = {
  labels, // x軸のラベルの配列
  datasets: [
    {
      label: " ", // 凡例
      data: data1,        // データの配列(labelsと要素数同じ)
      backgroundColor: "rgba(255, 99, 132, 0.5)" // グラフの棒の色
    },
    {
      label: "指導医",
      data: data2,
      backgroundColor: "rgba(53, 162, 235, 0.5)"
    }
  ]
};

interface DrawGraphProps {
  graphData: number[],
  selectedUser: string | undefined,
}

export const Graph = ({ graphData, selectedUser }: DrawGraphProps) => {
  const barRef = useRef<any>(null);
  console.log("debug render component DrawGraph");
  useEffect(() => {
    if (barRef.current) {
      barRef.current.data.datasets[0].label = selectedUser;
      barRef.current.data.datasets[0].data = graphData;
      barRef.current.update();
    }
  }, [graphData, selectedUser]);
  return <Bar ref={barRef} data={data} />;
};