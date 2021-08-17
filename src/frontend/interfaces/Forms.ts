import * as React from 'react';
import { IUser } from 'interfaces/User';
import { IMenuItem } from 'interfaces/Menu';
import { PortfolioRow, IPortfolioSummary } from 'interfaces/Portfolio';
import { StockRow } from 'interfaces/Stock';
import { notificationRow } from 'interfaces/Notification';
import { ChartOptions, ChartData } from "chart.js";
import { Path } from 'history';

export interface ErrorBlockProps {
  message: string;
  fieldsChanged: boolean;
}

export interface ModalFormPayload {
  modalFormTitle: string;
  modalFormDescription: string;
  ticker?: string;
  price?: number;
  quantity?: number;
  multiplier?: number;
  inputForm: string;
  mainButtonCaption?: string;
  precision?: number;
  highPrice?: number;
  lowPrice?: number;
  deletionAvailable?: boolean;
}

export interface ModalFormProps {
  opened: boolean;
  handleAction: (actionData?: any) => void;
  payload: ModalFormPayload;
  children?: React.ReactNode;
}

export interface AppProps {
  user: IUser;
  menuItems: IMenuItem[];
  loadInitialMenu(): IMenuItem[];
}

export interface MoveTickerReturnedPayload {
  ticker: string;
  price?: number;
  quantity?: number;
  source?: string;
  highPrice?: number;
  lowPrice?: number;
  action?: string;
}

export interface TickerProcessingFormProps {
	payload: ModalFormPayload;
  handleSubmit(payload: MoveTickerReturnedPayload): void;
}

type fieldShape = {
  name: string;
}

type propsShape = {
  caption: string;
}

export interface CustomInputProps {
  field: fieldShape;
  form: any;
  props: propsShape;
}

export interface PortfolioTableProps {
  rows: PortfolioRow[];
  getStockInfo(ticker: string): StockRow;
  handleSellTicker(payload: MoveTickerReturnedPayload): void;
}

export interface PortfolioTableRowProps {
	row: PortfolioRow;
  handleSell(e: React.FormEvent<EventTarget>, ticker: string): void;
  classes: any;
}

export interface StockTableProps {
  rows: StockRow[];
  loading: boolean;
  handleAddTicker(payload: MoveTickerReturnedPayload): void;
  handleAddNotice(payload: MoveTickerReturnedPayload): void;
  loadingMessage: boolean,
  notifications: notificationRow[];
}

export interface StockTableRowProps {
	row: StockRow;
  handleAdd(e: React.FormEvent<EventTarget>): void;
  handleNotice(e: React.FormEvent<EventTarget>): void;
  classes:any;
}

export interface TablePaginationActionsProps {
  count: number;
  onChangePage(event: React.FormEvent<EventTarget>, newPage: number): void;
  page: number;
  rowsPerPage: number;
}

export interface PortfolioProps {
  stockRows: StockRow[];
  portfolioRows: PortfolioRow[];
  deleteTicker(payload: MoveTickerReturnedPayload): void;
  loadPortfolio(): void,
}

export interface PortfolioDetailsProps {
  row: PortfolioRow;
}

export interface PriceProps {
  className?: string;
  row: PortfolioRow,
  user: IUser,
}

export interface ShareProps {
  className?: string;
  row: PortfolioRow;
  rows: PortfolioRow[];
}

export interface TotalProfitProps {
    className?: string;
    row: PortfolioRow;
    summary: IPortfolioSummary;
}

export interface BarChartProps {
  data: ChartData,
  options: ChartOptions,
}

export interface PieChartProps {
  rows: PortfolioRow[];
  className?: string;
}

export interface PortfolioSummaryProps {
  rows: PortfolioRow[];
  user: IUser;
}

export interface IDeleteUserPayload {
  password: string;
}

export interface IUpdateUserPayload {
  name: string;
  surname: string;
  email: string;
  phone: string;
  region: string;
  country: string;
}

export interface IFormValidationObj {
  firstName?: string;
  lastName?: string;
  country?: string;
  state?: string;
  email?: string;
  phone?: string;
  password?: string;
  name?: string;
  surname?: string;
  passwordRepeat?: string;
  region?: string;
}

export interface ProfileProps {
  className?: string;
  user: IUser;
  deleteUser(payload: IDeleteUserPayload): void;
  updateUser(payload: IUpdateUserPayload): void;
  clearUserCall(): void;
  message: string;
  lastCall: string;
}

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface SignInProps {
  user: IUser;
  login(payload: ILoginUserPayload): void;
  push(link: Path): void;
}

export interface SignOutProps {
  user: IUser;
  signout(): void;
}

export interface SignUpProps {
  user: IUser;
  signup(payload: IFormValidationObj): void;
  push(link: Path): void;
}

export interface AboutTickerProps {
  className?: string;
  ticker: string;
  user: IUser;
}

export interface GeneralChartProps {
  className?: string;
  ticker: string;
  user: IUser;
  chartOptions: ChartOptions;
}

export interface StockDetailsProps {
  ticker: string;
}

export interface StocksProps {
  stockRows: StockRow[];
  loadNotifications(): void;
  loadStocks(): void;
  addNotification(payload: MoveTickerReturnedPayload): void;
  deleteNotification(payload: MoveTickerReturnedPayload): void;
  addTicker(payload: MoveTickerReturnedPayload): void;
}

export interface SummaryProps {
  user: IUser;
  summary: IPortfolioSummary;
  loadPortfolio(): void;
  loadSummary(): void;
}

export interface SummaryState {
  intervalId: number | null;
}

export interface ContentProps {
  loadStocks(): void;
  loadPortfolio(): void;
}

export interface MenuProps {
  items: IMenuItem[];
  path: string;
}

export interface SidebarProps {
  path: string;
  menuItems: IMenuItem[];
}
