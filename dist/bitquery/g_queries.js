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
exports.G_QUERY_GetQuotePrice = exports.G_QUERY_GetTokenPair = void 0;
var axios_1 = __importDefault(require("axios"));
var G_QUERY_GetTokenPair = function (pair_address, bitqueryKey) { return __awaiter(void 0, void 0, void 0, function () {
    var res, e_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.post("https://graphql.bitquery.io", {
                        query: "\n      query getPairTokenPrice($pair_address: String)\n      {\n        ethereum(network: ethereum) {\n          dexTrades(\n            smartContractAddress: {is: $pair_address}\n            options: {limit: 1}\n          ) {\n            exchange {\n              fullName\n            }\n            token0: baseCurrency {\n              symbol\n              address\n              name\n            }\n            token1: quoteCurrency {\n              symbol\n              address\n              name\n            }\n          }\n        }\n      }\n      ",
                        variables: {
                            pair_address: pair_address,
                        },
                    }, {
                        headers: {
                            "X-API-KEY": bitqueryKey,
                        },
                    })];
            case 1:
                res = _d.sent();
                if (res.status != 200) {
                    return [2 /*return*/, {
                            success: false,
                            error: res.statusText
                        }];
                }
                return [2 /*return*/, {
                        success: true,
                        data: (_c = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.ethereum) === null || _c === void 0 ? void 0 : _c.dexTrades[0]
                    }];
            case 2:
                e_1 = _d.sent();
                return [2 /*return*/, {
                        success: false,
                        error: e_1
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.G_QUERY_GetTokenPair = G_QUERY_GetTokenPair;
var G_QUERY_GetQuotePrice = function (baseCurrency, quoteCurrency, timeBefore, bitqueryKey) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, axios_1.default.post("https://graphql.bitquery.io", {
                    query: "\n        query getQuotePrice($baseCurrency: String, $quoteCurrency: String, $timeBefore: ISO8601DateTime)\n        {\n          ethereum(network: ethereum) {\n            dexTrades(\n              baseCurrency: {is: $baseCurrency}\n              quoteCurrency: {is: $quoteCurrency}\n              options: {desc: [\"block.timestamp.time\", \"transaction.index\"], limit: 1}\n              time: {before: $timeBefore}\n            ) {\n              block {\n                height\n                timestamp {\n                  time(format: \"%Y-%m-%d %H:%M:%S\")\n                }\n              }\n              transaction {\n                index\n              }\n              baseCurrency {\n                symbol\n              }\n              quoteCurrency {\n                symbol\n              }\n              quotePrice\n            }\n          }\n        }\n        ",
                    variables: {
                        baseCurrency: baseCurrency,
                        quoteCurrency: quoteCurrency,
                        timeBefore: timeBefore,
                    },
                }, {
                    headers: {
                        "X-API-KEY": bitqueryKey,
                    },
                })];
            case 1:
                res = _e.sent();
                if (res.status != 200) {
                    return [2 /*return*/, {
                            success: false,
                            error: res.statusText
                        }];
                }
                return [2 /*return*/, {
                        success: true,
                        data: (_d = (_c = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.ethereum) === null || _c === void 0 ? void 0 : _c.dexTrades[0]) === null || _d === void 0 ? void 0 : _d.quotePrice
                    }];
        }
    });
}); };
exports.G_QUERY_GetQuotePrice = G_QUERY_GetQuotePrice;
