// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// const {GoogleSpreadsheet} = require('google-spreadsheet');
import {GoogleSpreadsheet} from 'google-spreadsheet'
const doc = new GoogleSpreadsheet('1xhwN6jzdBZUDrZy2iveiCCjpKqsDWdPffvsSeUnPJ-0');

export default async (req, res) => {

    await doc.useServiceAccountAuth(require('../../components/credentials.json'));
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows()
    res.status(200).json({
        headerValues: sheet.headerValues,
        rows: formatRows(rows)
    })
}
function formatRows(rows) {
    return rows.map((row, i) => ({
        time: row._rawData[0],
        values: row._rawData.slice(1)
    }))
}