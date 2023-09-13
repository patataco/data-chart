import { ChartData } from 'chart.js';

export const getChartData = (
  dataArr: any[],
  labels: Date[],
  filteredId: string | null,
  LINE_COLOR: string,
  LINE_BACKGROUND: string,
  LINE_HIGHLIGHT_COLOR: string,
  BAR_COLOR: string,
  BAR_HIGHLIGHT_COLOR: string
): ChartData => {
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
};
