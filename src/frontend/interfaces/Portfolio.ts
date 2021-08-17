export interface PortfolioRow {
    ticker: string,
    purchaseDate: string,
    currentPrice: number,
    link: string,
    price: number,
    quantity: number,
    multiplier: number,
    notification: boolean,
}

export interface PortfolioShare {
    data: string[],
    backgroundColor: string[],
    labels: string[],
}

export interface IPortfolioSummary {
    value: number,
    gains: number,
    dayChange: number,
    rate: number,
}

export interface IPortfolio {
    loading: boolean,
    message: string,
    entities: PortfolioRow[],
    summary: IPortfolioSummary
}