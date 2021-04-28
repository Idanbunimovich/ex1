const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const moment = require('moment')




const app = express();

app.set('view engine', 'ejs');
app.use(cors())
app.use(bodyParser.json());
let data = {
    ticketId:0
}


app.post('/onBoard', async (req, res) =>{
    data[`${data.ticketId}`] = req.query.plateId;
    data[`${data.ticketId}`] = {};
    data[`${data.ticketId}`].start = moment();
    res.json(data.ticketId)
    data.ticketId += 1;


});

app.post('/exit', async (req, res) =>{

    let {ticketId} = (req.query)
    let end = moment();

    let diffHours = end.diff(data[`${ticketId}`].start, 'seconds');
    let money = diffHours*10;
    res.json(money)

});
app.get('/hi', async (req, res) => {


});



app.listen(3000, () => {
    console.log("apps running 3000");
})
