/**
* Компонент отображения круговой диаграммы библиотеки chartjs
*/
import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  colors,
  useTheme
} from '@material-ui/core';

import { fetchPortfolioSharesData } from 'frontendRoot/API';
import { doughnutChartOptions } from 'helpers/charts';
import { PieChartProps } from 'interfaces/Forms';

const PieChart: React.FunctionComponent<PieChartProps> = (props) => {
  const [data, setData] = useState({});
  const [options, setOptions] = useState({});
  const [legend, setLegend] = useState([]);

  const { rows } = props;

  const theme = useTheme();

  useEffect(() => {
    fetchData();
  }, [rows]);

  const fetchData = (): void => {
    const dataset = fetchPortfolioSharesData(rows);
    setOptions(
      doughnutChartOptions(theme)
    );
    setData({
      datasets: [
        {
          data: dataset.data,
          backgroundColor: dataset.backgroundColor,
          borderWidth: 8,
          borderColor: colors.common.white,
          hoverBorderColor: colors.common.white
        }
      ],
      labels: dataset.labels
    });

    const legendArray = dataset.labels.map((title, idx) => {
      return {title, value: dataset.data[idx], color: dataset.backgroundColor[idx]};
    });

    setLegend(legendArray);
  };

  return (
    <Card
      {...props}
      data-testid="PieChartCard"
    >
      <CardHeader title="Состав портфеля" />
      <Divider />
      <CardContent>
        <Box
          height={300}
          position="relative"
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          mt={2}
        >
          {legend.map(({
            color,
            title,
            value
          }) => (
            <Box
              key={title}
              p={1}
              textAlign="center"
            >
              <Typography
                style={{ color }}
                variant="body1"
              >
                {title} {value}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PieChart;