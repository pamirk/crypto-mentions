// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// const {GoogleSpreadsheet} = require('google-spreadsheet');
import {GoogleSpreadsheet} from 'google-spreadsheet'

const doc = new GoogleSpreadsheet('1GioPc78i7XM3rdcr1a2P7NWB_0vhrzD75dDXKYK-e6E');

export default async (req, res) => {
    await doc.useServiceAccountAuth(require('../../components/credentials.json'));
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows()

    res.status(200).json({
        headerValues: sheet.headerValues,
        rows: formatRows(sheet.headerValues, rows)
    })
}

function formatRows(headerValues, rows) {
    let uniqueColumns = {};
    let sumArr = [];
    let i = 0
    let value = 0
    rows.map(row => {
        for (i = 1; i <= headerValues.length; i++) {
            value = headerValues[i]
            if (value && row[value] !== undefined) {
                if (uniqueColumns[value.split('/')[0]] === undefined) {
                    uniqueColumns[value.split('/')[0]] = 0
                }
                uniqueColumns[value.split('/')[0]] += Number(row[value])
            }
        }
        sumArr.push({time: row['time'], values: uniqueColumns})
        uniqueColumns = {}
    })
    return sumArr
}
