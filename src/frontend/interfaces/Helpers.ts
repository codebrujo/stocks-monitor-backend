import {amber, blue, blueGrey, brown, cyan, deepOrange, deepPurple, green, grey, indigo, red} from '@material-ui/core/colors';


export interface IHeaders {
  'Content-Type': string;
  Authorization?: string;
}

export interface IColors {
  amber: typeof amber;
  blue: typeof blue;
  blueGrey: typeof blueGrey;
  brown: typeof brown;
  cyan: typeof cyan;
  deepOrange: typeof deepOrange;
  deepPurple: typeof deepPurple;
  green: typeof green;
  grey: typeof grey;
  indigo: typeof indigo;
  red: typeof red;
}

interface IResponse {
  status: number,
  data: any,
}

export interface IResponseError {
  response: IResponse,
  request: any,
  message: string,
}

type datasetObj = {
  data: number[],
  label: string
}

export interface IChartDataset {
  data: datasetObj[];
  labels: string[];
}
