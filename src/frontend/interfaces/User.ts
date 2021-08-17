export interface Tokens {
    accessToken: null|string,
    refreshToken: null|string,
    expiresIn: null|string
}

export interface IUser {
    loading: boolean,
    id: null|number,
    name: null|string,
    surname: null|string,
    email: null|string,
    role: null|string,
    phone: null|string,
    country: null|string,
    region: null|string,
    createdAt: null|string,
    message: null|string,
    lastCall: null|string,
    tokens: Tokens
}