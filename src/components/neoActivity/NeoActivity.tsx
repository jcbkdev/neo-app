import { useMemo } from "react";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import type { Neo } from "../../hooks/useNeo";
import { formatDate } from "../../utils/formatDate";
import type { ChartOptions } from "chart.js/auto";

const options: ChartOptions<"bar"> = {
  responsive: true,
};

type Props = {
  asteroids: {
    asteroid: Neo;
    date: Date;
  }[];
};

export default function NeoActivity({ asteroids }: Props) {
  const chartData = useMemo(() => {
    const neoDataArray = asteroids.reduce<{ date: string; count: number }[]>(
      (acc, item) => {
        const dateStr = formatDate(item.date);
        const existingDay = acc.find((entry) => entry.date === dateStr);

        if (existingDay) {
          existingDay.count += 1;
        } else {
          acc.push({ date: dateStr, count: 1 });
        }

        return acc;
      },
      [],
    );

    neoDataArray.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const labels = neoDataArray.map((entry) => entry.date);
    const dataValues = neoDataArray.map((entry) => entry.count);

    const maxValue = Math.max(...dataValues);
    const dynamicColors = dataValues.map((val) => {
      const percentage = maxValue === 0 ? 0 : val / maxValue;

      if (percentage < 0.33) {
        return "rgba(75, 192, 192, 0.6)";
      } else if (percentage < 0.66) {
        return "rgba(255, 206, 86, 0.6)";
      } else {
        return "rgba(255, 99, 132, 0.6)";
      }
    });

    return {
      labels: labels,
      datasets: [
        {
          label: "Asteroids",
          data: dataValues,
          backgroundColor: dynamicColors,
          borderRadius: 2,
        },
      ],
    };
  }, [asteroids]);

  return (
    <div className="analytics-box">
      <Bar options={options} data={chartData} />
    </div>
  );
}
