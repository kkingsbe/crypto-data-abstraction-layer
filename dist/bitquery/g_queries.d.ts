import { Result, TokenInfo } from "../types";
export type TokenPairData = {
    exchange: {
        fullName: string;
    };
    token0: TokenInfo;
    token1: TokenInfo;
};
export declare const G_QUERY_GetTokenPair: (pair_address: string, bitqueryKey: string) => Promise<Result<TokenPairData, any>>;
export declare const G_QUERY_GetQuotePrice: (baseCurrency: string, quoteCurrency: string, timeBefore: string, bitqueryKey: string) => Promise<Result<number, any>>;
