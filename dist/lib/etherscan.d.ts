export declare class Etherscan {
    /**
     * Gets the fully diluted valuation of a token
     * @param contract_address The token contracts address. Not a pair address
     * @param latest_price The tokens latest price in usd
     * @returns The FDV in usd
     */
    static getFDV(contract_address: string, latest_price: number, infuraKey: string, etherscanKey: string): Promise<number>;
}
