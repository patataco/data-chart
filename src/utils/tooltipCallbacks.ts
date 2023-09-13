import { ChartTypeRegistry, TooltipItem } from 'chart.js';

import { DistrictData } from '@/service/useChartData';

export const beforeBody = (
  context: TooltipItem<keyof ChartTypeRegistry>[],
  data: DistrictData[]
) => {
  const item = context[0];

  const districtId = data ? data[item.dataIndex].id : 'N/A';

  return [`ID: ${districtId}`];
};

export const getLabels = (context: TooltipItem<keyof ChartTypeRegistry>) => {
  let label = context.dataset.label || '';

  if (label === 'value_area') {
    label = 'value_Area';
  } else if (label === 'value_bar') {
    label = 'value_Bar';
  }

  if (label) {
    label += ': ';
  }

  return [label + context.parsed.y];
};
