import { PricingData, Result, TokenNamesResult } from "./types";
export type CDALConfig = {
    bitqueryKey: string;
    etherscanKey: string;
    ethplorerKey: string;
    providerUrl: string;
};
export declare class CDAL {
    static bitqueryKey: string;
    static etherscanKey: string;
    static ethplorerKey: string;
    static providerUrl: string;
    /**
     * Initializes CDAS with API keys
     * @param config
     */
    static init(config: CDALConfig): void;
    /**
     * Gets updated current price and percent change
     * @param contractAddress The tokens contract address
     * @param pairAddress The address of the token pair to get the price from
     * @returns
     */
    static getPriceData(contractAddress: string, pairAddress: string): Promise<Result<PricingData, string>>;
    /**
     * Gets the FDV for the provided token
     * @param contractAddress The tokens contract address
     * @param price The tokens price in USD
     * @returns
     */
    static getFDV(contractAddress: string, price: number): Promise<Result<number, string>>;
    /**
     * Gets the total number of holders for the token
     * @param contractAddress The tokens contract address
     * @returns
     */
    static getHolders(contractAddress: string): Promise<Result<number, any>>;
    /**
     * Server-Side
     * Gets the two token names from the provided pair address
     * @param pair_address
     * @returns
     */
    static getTokenNamesFromPair(pair_address: string): Promise<Result<TokenNamesResult, any>>;
}
