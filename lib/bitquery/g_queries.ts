import axios from "axios";
import { Result, TokenInfo } from "../types";

export type TokenPairData = {
  exchange: {
    fullName: string;
  },
  token0: TokenInfo;
  token1: TokenInfo;
}

export const G_QUERY_GetTokenPair = async (pair_address: string, bitqueryKey: string): Promise<Result<TokenPairData, any>> => {
  try {
    const res = await axios.post(
      "https://graphql.bitquery.io",
      {
        query: `
      query getPairTokenPrice($pair_address: String)
      {
        ethereum(network: ethereum) {
          dexTrades(
            smartContractAddress: {is: $pair_address}
            options: {limit: 1}
          ) {
            exchange {
              fullName
            }
            token0: baseCurrency {
              symbol
              address
              name
            }
            token1: quoteCurrency {
              symbol
              address
              name
            }
          }
        }
      }
      `,
        variables: {
          pair_address,
        },
      },
      {
        headers: {
          "X-API-KEY": bitqueryKey,
        },
      }
    );
    
    if(res.status != 200) {
      return {
        success: false,
        error: res.statusText
      }
    }

    return {
      success: true,
      data: res?.data?.data?.ethereum?.dexTrades[0]
    }
  } catch(e) {
    return {
      success: false,
      error: e
    }
  }
};

export const G_QUERY_GetQuotePrice = async (
    baseCurrency: string,
    quoteCurrency: string,
    timeBefore: string,
    bitqueryKey: string
  ): Promise<Result<number, any>> => {
    const res = await axios.post(
      "https://graphql.bitquery.io",
      {
        query: `
        query getQuotePrice($baseCurrency: String, $quoteCurrency: String, $timeBefore: ISO8601DateTime)
        {
          ethereum(network: ethereum) {
            dexTrades(
              baseCurrency: {is: $baseCurrency}
              quoteCurrency: {is: $quoteCurrency}
              options: {desc: ["block.timestamp.time", "transaction.index"], limit: 1}
              time: {before: $timeBefore}
            ) {
              block {
                height
                timestamp {
                  time(format: "%Y-%m-%d %H:%M:%S")
                }
              }
              transaction {
                index
              }
              baseCurrency {
                symbol
              }
              quoteCurrency {
                symbol
              }
              quotePrice
            }
          }
        }
        `,
        variables: {
          baseCurrency,
          quoteCurrency,
          timeBefore,
        },
      },
      {
        headers: {
          "X-API-KEY": bitqueryKey,
        },
      }
    );

    if(res.status != 200) {
      return {
        success: false,
        error: res.statusText
      }
    }

    return {
      success: true,
      data: res?.data?.data?.ethereum?.dexTrades[0]?.quotePrice
    }
};