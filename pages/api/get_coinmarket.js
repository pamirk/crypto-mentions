// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// const {GoogleSpreadsheet} = require('google-spreadsheet');
import fetch from "node-fetch";

const url = 'https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing?start=1&limit=100&sortBy=market_cap&sortType=desc&convert=USD&cryptoType=all&tagType=all&aux=ath,atl,high24h,low24h,num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,volume_7d,volume_30d';

export default async (req, res) => {
    const _res = await fetch(url).then(res => res.json())
    res.status(200).json(_res)
}
