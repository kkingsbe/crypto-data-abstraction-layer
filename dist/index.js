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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CDAL = void 0;
var axios_1 = __importDefault(require("axios"));
var etherscan_1 = require("./lib/etherscan");
var tokenData_1 = require("./lib/tokenData");
var g_queries_1 = require("./bitquery/g_queries");
var addresses_1 = require("./lib/addresses");
var CDAL = /** @class */ (function () {
    function CDAL() {
    }
    /**
     * Initializes CDAS with API keys
     * @param config
     */
    CDAL.init = function (config) {
        var _a;
        if (config.bitqueryKey == '') {
            throw new Error("CDAL: Bitquery key is required");
        }
        if (config.etherscanKey == '') {
            throw new Error("CDAL: Etherscan key is required");
        }
        if (config.providerUrl == '') {
            throw new Error("CDAL: Provider URL is required");
        }
        if (config.ethplorerKey == '') {
            this.ethplorerKey = "freekey";
        }
        else {
            this.ethplorerKey = config.ethplorerKey;
        }
        this.bitqueryKey = config.bitqueryKey;
        this.etherscanKey = config.etherscanKey;
        this.providerUrl = (_a = config.providerUrl) !== null && _a !== void 0 ? _a : "";
    };
    /**
     * Gets updated current price and percent change
     * @param contractAddress The tokens contract address
     * @param pairAddress The address of the token pair to get the price from
     * @returns
     */
    CDAL.getPriceData = function (contractAddress, pairAddress) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, earliest_price_res, latest_price_res, _d, _e, _f, percent_change;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _e = (_d = Promise).all;
                        return [4 /*yield*/, (0, tokenData_1.getTokenPrice)(pairAddress, contractAddress, true, this.bitqueryKey)];
                    case 1:
                        _f = [
                            (_g.sent())
                        ];
                        return [4 /*yield*/, (0, tokenData_1.getTokenPrice)(pairAddress, contractAddress, false, this.bitqueryKey)];
                    case 2: return [4 /*yield*/, _e.apply(_d, [_f.concat([
                                (_g.sent())
                            ])])];
                    case 3:
                        _c = _g.sent(), earliest_price_res = _c[0], latest_price_res = _c[1];
                        if (!earliest_price_res.success || !((_a = earliest_price_res.data) === null || _a === void 0 ? void 0 : _a.base_price)) {
                            console.log("CDAL: Unable to get token price for ".concat(contractAddress, " in pair ").concat(pairAddress));
                            return [2 /*return*/, {
                                    success: false,
                                    error: earliest_price_res.error
                                }];
                        }
                        if (!latest_price_res.success || !((_b = latest_price_res.data) === null || _b === void 0 ? void 0 : _b.base_price)) {
                            console.log("CDAL: Unable to get token price for ".concat(contractAddress, " in pair ").concat(pairAddress));
                            return [2 /*return*/, {
                                    success: false,
                                    error: latest_price_res.error
                                }];
                        }
                        percent_change = (0, tokenData_1.percentChange)(earliest_price_res.data.base_price, latest_price_res.data.base_price);
                        return [2 /*return*/, {
                                success: true,
                                data: {
                                    price: latest_price_res.data.base_price,
                                    percentChange: percent_change
                                }
                            }];
                }
            });
        });
    };
    /**
     * Gets the FDV for the provided token
     * @param contractAddress The tokens contract address
     * @param price The tokens price in USD
     * @returns
     */
    CDAL.getFDV = function (contractAddress, price) {
        return __awaiter(this, void 0, void 0, function () {
            var fdv, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!(contractAddress && price)) return [3 /*break*/, 2];
                        return [4 /*yield*/, etherscan_1.Etherscan.getFDV(contractAddress, price, this.providerUrl, this.etherscanKey)];
                    case 1:
                        fdv = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: fdv
                            }];
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log("Unable to get FDV for ".concat(contractAddress));
                        console.log(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, {
                            success: false,
                            error: "Unable to get FDV"
                        }];
                }
            });
        });
    };
    /**
     * Gets the total number of holders for the token
     * @param contractAddress The tokens contract address
     * @returns
     */
    CDAL.getHolders = function (contractAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var holders, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!contractAddress) return [3 /*break*/, 2];
                        return [4 /*yield*/, axios_1.default.get("https://api.ethplorer.io/getTokenInfo/".concat(contractAddress, "?apiKey=").concat(this.ethplorerKey))];
                    case 1:
                        holders = (_a.sent()).data.holdersCount;
                        return [2 /*return*/, {
                                success: true,
                                data: holders
                            }];
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.log("Unable to get holders for ".concat(contractAddress));
                        console.log(e_2);
                        return [2 /*return*/, {
                                success: false,
                                error: e_2
                            }];
                    case 4: return [2 /*return*/, {
                            success: false,
                            error: "Unable to get holders"
                        }];
                }
            });
        });
    };
    /**
     * Server-Side
     * Gets the two token names from the provided pair address
     * @param pair_address
     * @returns
     */
    CDAL.getTokenNamesFromPair = function (pair_address) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var tokenPairResponse, token0, token1, baseToken, pairedToken;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, g_queries_1.G_QUERY_GetTokenPair)(pair_address, this.bitqueryKey)];
                    case 1:
                        tokenPairResponse = (_c.sent());
                        if (!tokenPairResponse.success) {
                            console.log("Unable to get token pair info for ".concat(pair_address));
                            console.log(tokenPairResponse.error);
                        }
                        token0 = (_a = tokenPairResponse.data) === null || _a === void 0 ? void 0 : _a.token0;
                        token1 = (_b = tokenPairResponse.data) === null || _b === void 0 ? void 0 : _b.token1;
                        if (!token0 || !token1) {
                            console.log("Unable to get reference to both tokens ".concat(pair_address));
                            return [2 /*return*/, {
                                    success: false,
                                    error: "Unable to get reference to both tokens ".concat(pair_address)
                                }];
                        }
                        if ([
                            addresses_1.WETH_ADDR,
                            addresses_1.DAI_ADDR,
                            addresses_1.USDT_ADDR,
                            addresses_1.USDC_ADDR,
                        ].includes(String(token0.address).toLowerCase())) {
                            baseToken = token1;
                            pairedToken = token0;
                        }
                        else {
                            baseToken = token0;
                            pairedToken = token1;
                        }
                        if (!baseToken.symbol || !baseToken.name || !pairedToken.symbol || !pairedToken.name) {
                            console.log("Unable to get token names or symbols for ".concat(pair_address));
                            return [2 /*return*/, {
                                    success: false,
                                    error: "Unable to get token names or symbols for ".concat(pair_address)
                                }];
                        }
                        return [2 /*return*/, {
                                success: true,
                                data: {
                                    baseTokenSymbol: baseToken.symbol,
                                    baseTokenName: baseToken.name,
                                    pairedTokenSymbol: pairedToken.symbol,
                                    pairedTokenName: pairedToken.name
                                }
                            }];
                }
            });
        });
    };
    return CDAL;
}());
exports.CDAL = CDAL;
