import React, { useMemo, useRef, useState } from 'react';
import { Chart, getElementAtEvent } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  ChartTypeRegistry,
  registerables,
  TooltipItem,
} from 'chart.js';
import { InteractionItem } from 'chart.js';
import moment from 'moment';

import 'chartjs-adapter-date-fns';

import { useChartData } from '@/service/useChartData';
import {
  BAR_COLOR,
  BAR_HIGHLIGHT_COLOR,
  LINE_BACKGROUND,
  LINE_COLOR,
  LINE_HIGHLIGHT_COLOR,
} from '@/utils';
import { beforeBody, getLabels } from '@/utils/tooltipCallbacks';

import FilterButton from './FilterButton';

ChartJS.register(...registerables);

export function ChartComponent() {
  const { labels, dataArr } = useChartData();
  const [filteredId, setFilteredId] = useState<string | null>(null);
  const chartRef = useRef<ChartJS>(null);

  const newChartData: ChartData = useMemo(() => {
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
      data: number[],
      ids: string[],
      targetId: string,
      highlightColor: string,
      defaultColor: string
    ) => {
      return data.map((_, index) => {
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
            : Array(areaData.length).fill(LINE_BACKGROUND),
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
            : Array(barData.length).fill(BAR_COLOR),
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
        text: 'Data Chart',
      },
      tooltip: {
        mode: 'index',
        callbacks: {
          beforeBody: (items: TooltipItem<keyof ChartTypeRegistry>[]) =>
            beforeBody(items, dataArr),
          label: (context: TooltipItem<keyof ChartTypeRegistry>) =>
            getLabels(context),
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
        },
        ticks: {
          callback: function (value: string | number, index: number) {
            if (index === 0) {
              return moment(value).format('YYYY년 MM월 DD일 HH:mm');
            }
            return moment(value).format('HH:mm');
          },
        },
      },
      y: {
        type: 'linear' as const,
        position: 'left' as const,
        min: 0,
        max: 200,
        stepSize: 20,
        ticks: {
          callback: function (tickValue: number | string) {
            if (typeof tickValue === 'number' && tickValue < 101) {
              return tickValue;
            }
            return '';
          },
        },
      },
      y1: {
        type: 'linear' as const,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        min: 1000,
        max: 20000,
        stepSize: 2000,
        ticks: {
          callback: function (tickValue: number | string) {
            if (typeof tickValue === 'number' && tickValue > 9999) {
              return tickValue;
            }
            return '';
          },
        },
      },
    },
  };

  const uniqueIds = Array.from(new Set(dataArr.map((data) => data.id)));

  const handleElementClick = (element: InteractionItem[]) => {
    if (!element.length) return;

    const { index } = element[0];
    const clickedId = dataArr[index].id;
    setFilteredId(clickedId); // 클릭한 지역구 ID를 상태에 저장
  };

  const onClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const chart = chartRef.current;
    if (!chart) return;

    const clickedElement = getElementAtEvent(chart, event);
    handleElementClick(clickedElement);
  };

  return (
    <div className="mx-auto flex h-auto max-h-[1000px] w-full max-w-[1600px] flex-col gap-10 px-8">
      <Chart
        type="bar"
        ref={chartRef}
        data={newChartData}
        options={options as ChartOptions}
        onClick={onClick}
      />
      <FilterButton
        ids={uniqueIds}
        setFilteredId={setFilteredId}
        filteredId={filteredId}
      />
    </div>
  );
}

export default ChartComponent;
