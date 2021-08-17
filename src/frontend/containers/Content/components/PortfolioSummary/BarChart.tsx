/**
* Компонент отображения столбчатой диаграммы библиотеки chartjs
*/
import React from 'react';

import { Bar } from 'react-chartjs-2';
import { BarChartProps } from 'interfaces/Forms';

const BarChart: React.FunctionComponent<BarChartProps> = (props) => {

  const { data, options } = props;

  return (
    <div data-testid="BarChart">
      <Bar
        data={data}
        options={options}
      />
    </div>
  );
};

export default BarChart;
