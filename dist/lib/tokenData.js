"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.percentChange = exports.getTokenPrice = void 0;
var g_queries_1 = require("../bitquery/g_queries");
var addresses_1 = require("./addresses");
var getTokenPrice = function (pair_address, token_address, yesterday, bitqueryKey) { return __awaiter(void 0, void 0, void 0, function () {
    var timeBefore, tokenPairResponse, token0, token1, tokenAddress, pairedTokenAddress, quotePriceResponse, baseQuotePrice, baseCurrency, quoteCurrency, baseQuotePriceResponse, quoteQuotePrice;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                timeBefore = (yesterday
                    ? new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
                    : new Date()).toISOString();
                if (!pair_address) {
                    console.log("CDAL: No pair address provided");
                    return [2 /*return*/, {
                            success: false,
                            error: "No pair address provided"
                        }];
                }
                return [4 /*yield*/, (0, g_queries_1.G_QUERY_GetTokenPair)(pair_address, bitqueryKey)];
            case 1:
                tokenPairResponse = _e.sent();
                if (!tokenPairResponse.success) {
                    console.log("Unable to get token pair info for ".concat(pair_address));
                    console.log(tokenPairResponse.error);
                }
                token0 = (_b = (_a = tokenPairResponse.data) === null || _a === void 0 ? void 0 : _a.token0.address) !== null && _b !== void 0 ? _b : "";
                token1 = (_d = (_c = tokenPairResponse.data) === null || _c === void 0 ? void 0 : _c.token1.address) !== null && _d !== void 0 ? _d : "";
                if (token0.toLowerCase() === token_address.toLowerCase()) {
                    tokenAddress = token0;
                    pairedTokenAddress = token1;
                }
                else {
                    tokenAddress = token1;
                    pairedTokenAddress = token0;
                }
                return [4 /*yield*/, (0, g_queries_1.G_QUERY_GetQuotePrice)(tokenAddress, pairedTokenAddress, timeBefore, bitqueryKey)];
            case 2:
                quotePriceResponse = _e.sent();
                //If no trades are found
                if (!quotePriceResponse.success) {
                    return [2 /*return*/, {
                            success: false,
                            error: quotePriceResponse.error
                        }];
                }
                baseQuotePrice = quotePriceResponse === null || quotePriceResponse === void 0 ? void 0 : quotePriceResponse.data;
                baseCurrency = pairedTokenAddress;
                quoteCurrency = pairedTokenAddress === addresses_1.WETH_ADDR
                    ? addresses_1.USDC_ADDR
                    : addresses_1.USDT_ADDR;
                return [4 /*yield*/, (0, g_queries_1.G_QUERY_GetQuotePrice)(baseCurrency, quoteCurrency, timeBefore, bitqueryKey)];
            case 3:
                baseQuotePriceResponse = _e.sent();
                if (!baseQuotePriceResponse.success) {
                    return [2 /*return*/, {
                            success: false,
                            error: baseQuotePriceResponse.error
                        }];
                }
                quoteQuotePrice = baseQuotePriceResponse === null || baseQuotePriceResponse === void 0 ? void 0 : baseQuotePriceResponse.data;
                if (!baseQuotePrice || !quoteQuotePrice) {
                    console.log("CDAL: No price found");
                    return [2 /*return*/, {
                            success: false,
                            error: "No price found"
                        }];
                }
                return [2 /*return*/, {
                        success: true,
                        data: {
                            base_price: baseQuotePrice * quoteQuotePrice,
                            quote_price: quoteQuotePrice,
                        }
                    }];
        }
    });
}); };
exports.getTokenPrice = getTokenPrice;
function percentChange(initial, final) {
    return 100 * ((final - initial) / initial);
}
exports.percentChange = percentChange;
