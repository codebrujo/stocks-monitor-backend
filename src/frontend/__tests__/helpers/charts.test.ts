/* eslint-disable no-undef */
import {doughnutChartOptions, barChartOptions, linearChartOptions} from '../../helpers/charts';
import { Theme } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';

const theme: Theme = createMuiTheme();

describe("Chart functions", () => {


    test('Test charts: doughnutChartOptions', () => {
        const optionKeys = Object.keys(doughnutChartOptions(theme));
        const expectedKeys = ["animation", "cutoutPercentage", "layout", "legend", "maintainAspectRatio", "responsive", "tooltips"];
        expect(expectedKeys.filter((i) => {return !(optionKeys.indexOf(i) > -1);}).length).toBe(0);
    });


    test('Test charts: barChartOptions', () => {
        const optionKeys = Object.keys(barChartOptions(theme));
        const expectedKeys = ["animation", "cornerRadius", "layout", "legend", "maintainAspectRatio", "responsive", "data", "tooltips"];
        expect(expectedKeys.filter((i) => {return !(optionKeys.indexOf(i) > -1);}).length).toBe(0);
    });


    test('Test charts: linearChartOptions', () => {
        const optionKeys = Object.keys(linearChartOptions(theme));
        const expectedKeys = ["animation", "cornerRadius", "layout", "legend", "maintainAspectRatio", "responsive", "scales", "tooltips"];
        expect(expectedKeys.filter((i) => {return !(optionKeys.indexOf(i) > -1);}).length).toBe(0);
    });
});