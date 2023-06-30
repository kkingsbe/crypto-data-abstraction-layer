import { Result, TokenPriceInPair } from "../types"
import { G_QUERY_GetQuotePrice, G_QUERY_GetTokenPair } from "../bitquery/g_queries"
import { USDC_ADDR, USDT_ADDR, WETH_ADDR } from "./addresses";

export const getTokenPrice = async ( 
    pair_address: string,
    token_address: string,
    yesterday: boolean,
    bitqueryKey: string
  ): Promise<Result<TokenPriceInPair, string>> => {
    const timeBefore = (
      yesterday
        ? new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
        : new Date()
    ).toISOString();
    if(!pair_address) {
      console.log("CDAL: No pair address provided")
      return {
        success: false,
        error: "No pair address provided"
      }
    }
   
    //Query bitquery
    const tokenPairResponse = await G_QUERY_GetTokenPair(pair_address, bitqueryKey);

    if(!tokenPairResponse.success) {
      console.log(`Unable to get token pair info for ${pair_address}`)
      console.log(tokenPairResponse.error)
    }
  
    //Get token addresses from pair
    const token0 = tokenPairResponse.data?.token0.address ?? "";
    const token1 = tokenPairResponse.data?.token1.address ?? "";
    let tokenAddress, pairedTokenAddress;

    if(token0.toLowerCase() === token_address.toLowerCase()) {
        tokenAddress = token0;
        pairedTokenAddress = token1;
    } else {
        tokenAddress = token1;
        pairedTokenAddress = token0;
    }
  
    //Get the price of the token
    const quotePriceResponse = await G_QUERY_GetQuotePrice(
      tokenAddress,
      pairedTokenAddress,
      timeBefore,
      bitqueryKey
    );
  
    //If no trades are found
    if (!quotePriceResponse.success) {
      return {
        success: false,
        error: quotePriceResponse.error
      }
    }

    const baseQuotePrice = quotePriceResponse?.data;
    const baseCurrency = pairedTokenAddress;

    const quoteCurrency =
    pairedTokenAddress === WETH_ADDR
        ? USDC_ADDR
        : USDT_ADDR;

    const baseQuotePriceResponse = await G_QUERY_GetQuotePrice(
      baseCurrency,
      quoteCurrency as string,
      timeBefore,
      bitqueryKey
    );

    if (!baseQuotePriceResponse.success) {
        return {
          success: false,
          error: baseQuotePriceResponse.error
        }
    }

    const quoteQuotePrice = baseQuotePriceResponse?.data;

    if(!baseQuotePrice || !quoteQuotePrice) {
      console.log("CDAL: No price found")
      return { 
        success: false,
        error: "No price found"
      };
    }

    return {
      success: true,
      data: {
        base_price: baseQuotePrice * quoteQuotePrice,
        quote_price: quoteQuotePrice,
      }
    };
};
  
export function percentChange(initial: number, final: number): number {
    return 100 * ((final - initial) / initial)
}