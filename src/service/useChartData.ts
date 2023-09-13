import { useEffect, useMemo, useState } from 'react';

import { fetchData } from '@/service/index';
import { formatDateForXAxis } from '@/utils/dateFormat';

export interface DistrictData {
  id: string;
  value_area: number;
  value_bar: number;
}
export type DistrictDataSet = Record<string, DistrictData>;

export const useChartData = () => {
  const [data, setData] = useState<DistrictDataSet>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const parseData = (data: DistrictDataSet) => {
    const entries = Object.entries(data).sort(([a], [z]) => {
      return new Date(a).getTime() - new Date(z).getTime();
    });
    const convertedTime = entries
      .map(([key]) => key)
      .map((time) => {
        return formatDateForXAxis(time);
      });

    return {
      labels: convertedTime,
      dataArr: entries.map(([, value]) => value),
    };
  };
  const fetchChartData = async () => {
    try {
      const rawData = await fetchData();
      setData(rawData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
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

  return { labels, dataArr, isLoading };
};
