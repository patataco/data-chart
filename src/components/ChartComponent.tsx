import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bar, getElementAtEvent } from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

import { useChartData } from '@/service/useChartData';
import {
  BAR_COLOR,
  BAR_HIGHLIGHT_COLOR,
  LINE_BACKGROUND,
  LINE_COLOR,
  LINE_HIGHLIGHT_COLOR,
} from '@/utils';

import FilterButton from './FilterButton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export function ChartComponent() {
  const { labels, dataArr } = useChartData();
  const [filteredId, setFilteredId] = useState<string | null>(null);
  const chartRef = useRef<ChartJS>(null);

  const newChartData = useMemo(() => {
    const { areaData, barData } = dataArr.reduce<{
      areaData: number[];
      barData: number[];
    }>(
      (acc, cur) => {
        acc.areaData.push(cur.value_area);
        acc.barData.push(cur.value_bar);
        return acc;
      },
      { areaData: [], barData: [] }
    );
    const getHighlightColors = (
      data,
      ids,
      targetId,
      highlightColor,
      defaultColor
    ) => {
      return data.map((value, index) => {
        return ids[index] === targetId ? highlightColor : defaultColor;
      });
    };
    const districtIdArray = dataArr.map((item) => item.id);
    return {
      labels,
      datasets: [
        {
          label: 'value_area',
          data: areaData,
          type: 'line',
          fill: true,
          yAxisID: 'y',
          borderColor: LINE_COLOR,
          backgroundColor: LINE_BACKGROUND,
          pointRadius: 4,
          pointBackgroundColor: filteredId
            ? getHighlightColors(
                areaData,
                districtIdArray,
                filteredId,
                LINE_HIGHLIGHT_COLOR,
                LINE_BACKGROUND
              )
            : LINE_BACKGROUND,
        },
        {
          label: 'value_bar',
          data: barData,
          type: 'bar',
          yAxisID: 'y1',
          backgroundColor: filteredId
            ? getHighlightColors(
                barData,
                districtIdArray,
                filteredId,
                BAR_HIGHLIGHT_COLOR,
                BAR_COLOR
              )
            : BAR_COLOR,
        },
      ],
    };
  }, [labels, dataArr, filteredId]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const districtId = dataArr ? dataArr[context.dataIndex].id : 'N/A';

            return `${label}: ${value} (ID: ${districtId})`;
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        position: 'left' as const,
        ticks: {
          min: 0,
          max: 100,
          stepSize: 20,
          callback: function (value, index, values) {
            return Number(value) <= 100 ? value : null;
          },
        },
      },
      y1: {
        type: 'linear' as const,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          min: 1000,
          max: 20000,
          stepSize: 2000,
          callback: function (value, index, values) {
            return Number(value) >= 1000 ? value : null;
          },
        },
      },
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.update();
    chart.render();
    console.log(newChartData);
  }, [newChartData, filteredId]);
  const uniqueIds = Array.from(new Set(dataArr.map((data) => data.id)));

  const handleElementClick = (element) => {
    if (!element.length) return;
    console.log(element);
    const { datasetIndex, index } = element[0];
    const clickedId = dataArr[index].id;
    setFilteredId(clickedId); // 클릭한 지역구 ID를 상태에 저장
  };

  const onClick = (event) => {
    const chart = chartRef.current;
    if (!chart) return;

    const clickedElement = getElementAtEvent(chart, event);
    handleElementClick(clickedElement);
  };

  return (
    <div>
      <FilterButton ids={uniqueIds} setFilteredId={setFilteredId} />
      <button
        onClick={() => {
          chartRef.current?.update();
        }}
      >
        button
      </button>
      <Bar
        ref={chartRef}
        data={newChartData}
        options={options}
        onClick={onClick}
      />
    </div>
  );
}

export default ChartComponent;
