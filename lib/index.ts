import axios from "axios";
import { Etherscan } from "./lib/etherscan";
import { getTokenPrice, percentChange } from "./lib/tokenData";
import { PricingData, Result, TokenNamesResult } from "./types";
import { G_QUERY_GetTokenPair } from "./bitquery/g_queries";
import { DAI_ADDR, USDC_ADDR, USDT_ADDR, WETH_ADDR } from "./lib/addresses";

export type CDALConfig = {
    bitqueryKey: string,
    etherscanKey: string,
    ethplorerKey: string,
    providerUrl: string,
}

export class CDAL {
    static bitqueryKey: string;
    static etherscanKey: string;
    static ethplorerKey: string;
    static providerUrl: string;

    /**
     * Initializes CDAS with API keys
     * @param config 
     */
    static init(config: CDALConfig) {
        this.bitqueryKey = config.bitqueryKey;
        this.etherscanKey = config.etherscanKey;
        this.ethplorerKey = config.ethplorerKey ?? "freeKey";
        this.providerUrl = config.providerUrl ?? "";
        
    }

    /**
     * Gets updated current price and percent change
     * @param contractAddress The tokens contract address
     * @param pairAddress The address of the token pair to get the price from
     * @returns 
     */
    static async getPriceData(contractAddress: string, pairAddress: string): Promise<Result<PricingData, string>> {
        const [earliest_price_res, latest_price_res] = await Promise.all([
            (await getTokenPrice(pairAddress, contractAddress, true, this.bitqueryKey)),
            (await getTokenPrice(pairAddress, contractAddress, false, this.bitqueryKey))
        ])

        if(!earliest_price_res.success || !earliest_price_res.data?.base_price) {
            console.log(`CDAL: Unable to get token price for ${contractAddress} in pair ${pairAddress}`)
            return {
                success: false,
                error: earliest_price_res.error
            }
        }
    
        if(!latest_price_res.success || !latest_price_res.data?.base_price) {
            console.log(`CDAL: Unable to get token price for ${contractAddress} in pair ${pairAddress}`)
            return {
                success: false,
                error: latest_price_res.error
            }
        }

        const percent_change = percentChange(earliest_price_res.data.base_price, latest_price_res.data.base_price)
    
        return {
            success: true,
            data: {
                price: latest_price_res.data.base_price,
                percentChange: percent_change
            }
        }
    }

    /**
     * Gets the FDV for the provided token
     * @param contractAddress The tokens contract address
     * @param price The tokens price in USD
     * @returns 
     */
    static async getFDV(contractAddress: string, price: number): Promise<number> {
        try {
            if(contractAddress && price) {
                const marketCap = await Etherscan.getFDV(contractAddress, price, this.providerUrl, this.etherscanKey)
                return marketCap
            }
        } catch (e) {
            console.log(`Unable to get market cap for ${contractAddress}`)
            console.log(e)
        }
      
        return 0
    }
      
    /**
     * Gets the total number of holders for the token
     * @param contractAddress The tokens contract address
     * @returns 
     */
    static async getHolders(contractAddress: string): Promise<number> {
        try {
            if(contractAddress) {
                const holders = (await axios.get(`https://api.ethplorer.io/getTokenInfo/${contractAddress}?apiKey=${this.ethplorerKey}`)).data.holdersCount
                return holders
            }
        } catch (e) {
            console.log(`Unable to get holders for ${contractAddress}`)
            console.log(e)
        }
      
        return 0
    }

    /**
     * Server-Side
     * Gets the two token names from the provided pair address
     * @param pair_address  
     * @returns 
     */
    static async getTokenNamesFromPair(pair_address: string): Promise<Result<TokenNamesResult, any>> {
        const tokenPairResponse = (await G_QUERY_GetTokenPair(
            pair_address as string,
            this.bitqueryKey
        ));
        if(!tokenPairResponse.success) {
            console.log(`Unable to get token pair info for ${pair_address}`)
            console.log(tokenPairResponse.error)
        }
        
        const token0 = tokenPairResponse.data?.token0;
        const token1 = tokenPairResponse.data?.token1;

        if(!token0 || !token1) {
            console.log(`Unable to get reference to both tokens ${pair_address}`)
            return {
                success: false,
                error: `Unable to get reference to both tokens ${pair_address}`
            }
        }

        let baseToken, pairedToken;
        if (
            [
                WETH_ADDR,
                DAI_ADDR,
                USDT_ADDR,
                USDC_ADDR,
            ].includes(String(token0.address).toLowerCase())
        ) {
            baseToken = token1;
            pairedToken = token0;
        } else {
            baseToken = token0;
            pairedToken = token1;
        }

        if(!baseToken.symbol || !baseToken.name || !pairedToken.symbol || !pairedToken.name) {
            console.log(`Unable to get token names or symbols for ${pair_address}`)
            return {
                success: false,
                error: `Unable to get token names or symbols for ${pair_address}`
            }
        }
    
        return {
            success: true,
            data: {
                baseTokenSymbol: baseToken.symbol,
                baseTokenName: baseToken.name,
                pairedTokenSymbol: pairedToken.symbol,
                pairedTokenName: pairedToken.name
            }
        }
    }
}