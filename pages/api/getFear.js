// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// const {GoogleSpreadsheet} = require('google-spreadsheet');
const fetch = require("isomorphic-fetch");
const url = 'https://api.alternative.me/fng/?limit=31';
export default async (req, res) => {
    const _res = await fetch(url).then(res => res.json())
    return res.status(200).json(_res)
}
