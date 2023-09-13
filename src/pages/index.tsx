import { Inter } from 'next/font/google';

import ChartComponent from '@/components/ChartComponent';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <ChartComponent />
    </>
  );
}
