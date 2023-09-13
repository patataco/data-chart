import { useEffect, useMemo, useState } from 'react';

import { fetchData } from '@/service/index';

export interface DistrictData {
  id: string;
  value_area: number;
  value_bar: number;
}
export type DistrictDataSet = Record<string, DistrictData>;

export const useChartData = () => {
  const [data, setData] = useState<DistrictDataSet>();
  const parseData = (data: DistrictDataSet) => {
    const entries = Object.entries(data).sort(([a], [z]) => {
      return new Date(a).getTime() - new Date(z).getTime();
    });
    return {
      labels: entries.map(([key]) => key),
      dataArr: entries.map(([, value]) => value),
    };
  };
  const fetchChartData = async () => {
    const rawData = await fetchData();
    setData(rawData);
  };

  const { labels, dataArr } = useMemo(() => {
    if (!data) {
      return {
        dataArr: [],
        labels: [],
      };
    }
    return parseData(data);
  }, [data]);

  useEffect(() => {
    fetchChartData();
  }, []);

  return { labels, dataArr };
};
