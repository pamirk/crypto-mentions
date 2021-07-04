const {GoogleSpreadsheet} = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('13MavQqERCUlglFEqvQoecBNRVvAwFsPbBJPrz2_KWDI');//Mytesting

export default async (req, res) => {
    console.log("req: ",req.body)
    console.time("time")
    await doc.useServiceAccountAuth(require('../../components/credentials.json'))
    await doc.loadInfo();
    const sheet = await doc.sheetsByIndex[0];
    let rows = JSON.parse(req.body)
    rows = Object.keys(rows).map(i => rows[i])
    const rowValues = [new Date(), ...rows]
    await sheet.addRow(rowValues)
    console.log(rowValues)
    console.timeEnd('time');
    res.status(200).json({})
}
