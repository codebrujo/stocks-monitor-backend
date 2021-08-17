export interface notificationRow {
    ticker: string,
    highPrice: number,
    lowPrice: number
}

export interface notificationState {
    loading: boolean,
    entities: notificationRow[],
}