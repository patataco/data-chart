import { ChartTypeRegistry, TooltipItem } from 'chart.js';
import moment from 'moment';

import { DistrictData } from '@/service/useChartData';

import { beforeBody, getLabels } from './tooltipCallbacks';

export const getChartOptions = (dataArr: DistrictData[]) => ({
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
      offset: false,
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
});
