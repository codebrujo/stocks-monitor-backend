import { Theme } from '@material-ui/core';
import { ChartOptions } from "chart.js";

/**
 * Возвращает параметры круговой диаграммы
 *
 * @param {object} theme Тема компонента Material UI.
 * @return {object} параметры.
 */
export const doughnutChartOptions = (theme: Theme): ChartOptions => {
    return ({
        animation: false,
        cutoutPercentage: 80,
        layout: { padding: 0 },
        legend: {
            display: false
        },
        maintainAspectRatio: false,
        responsive: true,
        tooltips: {
            backgroundColor: theme.palette.background.default,
            bodyFontColor: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            borderWidth: 1,
            enabled: true,
            footerFontColor: theme.palette.text.secondary,
            intersect: false,
            mode: 'index',
            titleFontColor: theme.palette.text.primary
        }
    });
};

/**
 * Возвращает параметры столбчатой диаграммы
 *
 * @param {object} theme Тема компонента Material UI.
 * @return {object} параметры.
 */
export const barChartOptions = (theme: Theme): ChartOptions => {
    return {
        animation: false,
        cornerRadius: 20,
        layout: { padding: 0 },
        legend: { display: false },
        maintainAspectRatio: false,
        responsive: true,
        data: {
            datasets: [{
                barPercentage: 0.5,
                barThickness: 12,
                maxBarThickness: 10,
                minBarLength: 2
            }]
        },
        tooltips: {
            backgroundColor: theme.palette.background.default,
            bodyFontColor: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            borderWidth: 1,
            enabled: true,
            footerFontColor: theme.palette.text.secondary,
            intersect: false,
            mode: 'index',
            titleFontColor: theme.palette.text.primary
        }
    };
};

/**
 * Возвращает параметры линейной диаграммы
 *
 * @param {object} theme        Тема компонента Material UI.
 * @param {object} dataset      Объект: data - массив данных по Y
 * @return {object}             Параметры
 */
export const linearChartOptions = (theme: Theme): ChartOptions => {
    return {
        animation: false,
        cornerRadius: 20,
        layout: { padding: 0 },
        legend: { display: false },
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            xAxes: [{
                barThickness: 12,
                maxBarThickness: 10,
                barPercentage: 0.5,
                categoryPercentage: 0.5,
                ticks: {
                    fontColor: theme.palette.text.secondary
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                }
            }],
            yAxes: [{
                ticks: {
                    fontColor: theme.palette.text.secondary,
                    beginAtZero: false,
                },
                gridLines: {
                    borderDash: [2],
                    borderDashOffset: [2],
                    color: theme.palette.divider,
                    drawBorder: false,
                    zeroLineBorderDash: [2],
                    zeroLineBorderDashOffset: [2],
                    zeroLineColor: theme.palette.divider
                }
            }]
        },
        tooltips: {
            backgroundColor: theme.palette.background.default,
            bodyFontColor: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            borderWidth: 1,
            enabled: true,
            footerFontColor: theme.palette.text.secondary,
            intersect: false,
            mode: 'index',
            titleFontColor: theme.palette.text.primary
        }
    };
};