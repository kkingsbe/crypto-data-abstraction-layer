import { Result, TokenPriceInPair } from "../types";
export declare const getTokenPrice: (pair_address: string, token_address: string, yesterday: boolean, bitqueryKey: string) => Promise<Result<TokenPriceInPair, string>>;
export declare function percentChange(initial: number, final: number): number;
