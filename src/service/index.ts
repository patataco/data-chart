import { DistrictDataSet } from '@/service/useChartData';

export type Data = {
  [time: string]: {
    id: string;
    value_area: number;
    value_bar: number;
  };
};

export const fetchData = async (): Promise<DistrictDataSet> => {
  const response = await fetch('/data.json');
  const data = await response.json();
  return data.response;
};
