import { DistrictDataSet } from '@/service/useChartData';

export const fetchData = async (): Promise<DistrictDataSet> => {
  const response = await fetch('/data.json');
  const data = await response.json();
  return data.response;
};
