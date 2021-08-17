export interface StockRow {
    company: string,
    ticker: string,
    cap: number,
    currency: string,
    ratio: number,
    price: number,
    multiplier: number,
    notification: boolean,
}

export interface IStock {
    loading: boolean,
    entities: StockRow[],
    message: string,
}