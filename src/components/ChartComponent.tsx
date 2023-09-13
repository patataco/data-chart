import React, { useMemo, useRef, useState } from 'react';
import { Chart, getElementAtEvent } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  registerables,
} from 'chart.js';
import { InteractionItem } from 'chart.js';

import 'chartjs-adapter-date-fns';

import { useChartData } from '@/service/useChartData';
import {
  BAR_COLOR,
  BAR_HIGHLIGHT_COLOR,
  LINE_BACKGROUND,
  LINE_COLOR,
  LINE_HIGHLIGHT_COLOR,
} from '@/utils';
import { getChartOptions } from '@/utils/chartOptions';
import { getChartData } from '@/utils/getChartData';

import FilterButton from './FilterButton';

ChartJS.register(...registerables);

export function ChartComponent() {
  const { labels, dataArr } = useChartData();
  const [filteredId, setFilteredId] = useState<string | null>(null);
  const chartRef = useRef<ChartJS>(null);

  const newChartData: ChartData = useMemo(
    () =>
      getChartData(
        dataArr,
        labels,
        filteredId,
        LINE_COLOR,
        LINE_BACKGROUND,
        LINE_HIGHLIGHT_COLOR,
        BAR_COLOR,
        BAR_HIGHLIGHT_COLOR
      ),
    [labels, dataArr, filteredId]
  );

  const options = getChartOptions(dataArr);

  const uniqueIds = Array.from(new Set(dataArr.map((data) => data.id)));

  const handleElementClick = (element: InteractionItem[]) => {
    if (!element.length) return;

    const { index } = element[0];
    const clickedId = dataArr[index].id;
    setFilteredId(clickedId);
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
