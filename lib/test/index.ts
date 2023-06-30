import { CDAL } from "..";
require('dotenv').config()

CDAL.init({
    bitqueryKey: process.env.BITQUERY_KEY ?? "",
    etherscanKey: process.env.ETHERSCAN_KEY ?? "",
    ethplorerKey: process.env.ETHPLORER_KEY ?? "",
    providerUrl: process.env.PROVIDER_URL ?? ""
})

async function test() {
    /*
    const names = await CDAL.getTokenNamesFromPair("0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852")
    console.log(names)
    */
   const names = await CDAL.getTokenNamesFromPair("0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852")
   const price = await CDAL.getPriceData("0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852")
   console.log(`Pricing data for ${names.data?.baseTokenName} (${names.data?.baseTokenSymbol}): $${price.data?.price} (${price.data?.percentChange}%)`)
}

test()