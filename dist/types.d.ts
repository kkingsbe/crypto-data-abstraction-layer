export interface ApiResponse {
    success: boolean;
    data: any | null;
}
export type TokenProject = {
    contract_address: string;
    pair_address: string;
    project_data: TokenData;
};
export type TokenData = {
    id: number;
    created_at: string;
    project_id: number;
    market_cap: number;
    liquidity_usd: number;
    deployer_funds: number;
    rating: number;
    category: string;
    price: number;
    percent_change: number;
    holders: number;
    is_audited: boolean;
};
export type PricingData = {
    price: number;
    percentChange: number;
};
export type TokenPriceInPair = {
    base_price: number;
    quote_price: number;
};
export type TokenPairInfo = {
    baseToken?: TokenInfo;
    pairedToken?: TokenInfo;
};
export interface TokenInfo {
    name?: string;
    address?: string;
    symbol?: string;
}
export type Result<T, J> = {
    success: boolean;
    data?: T;
    error?: J;
};
export type TokenNamesResult = {
    baseTokenSymbol: string;
    baseTokenName: string;
    pairedTokenSymbol: string;
    pairedTokenName: string;
};
