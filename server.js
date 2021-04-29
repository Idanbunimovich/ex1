const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const moment = require('moment')
const redis = require('redis')
const {promisify} = require('util')

let redisClient = redis.createClient({host:'demo-redis2.hh98yr.ng.0001.use1.cache.amazonaws.com',port:6379})
let set = promisify(redisClient.set).bind(redisClient)
let get = promisify(redisClient.get).bind(redisClient)


const app = express();

app.set('view engine', 'ejs');
app.use(cors())
app.use(bodyParser.json());


app.post('/onBoard', async (req, res) =>{
    let ticketId = await get('ticketId')
    if(ticketId == null)
    {
        ticketId = 0
    }
    else{
        ticketId = parseInt(ticketId)
    }
    res.json(ticketId)
    let data = {
        start:moment(),
        plateId:req.query.plateId,
        parkinLot:req.query.parkingLot
    }
    await set(ticketId,JSON.stringify(data))
    ticketId += 1;
    await set('ticketId',ticketId)



});

app.post('/exit', async (req, res) =>{

    let {ticketId} = (req.query)
    let end = moment();
    let data = JSON.parse(await get(ticketId))
    let diffHours = end.diff(data.start, 'seconds');
    let money = diffHours*10;
    res.json({platId: data.plateId,money,parkingLot:data.parkinLot})

});
app.get('/hi', async (req, res) => {


});



app.listen(3000, () => {
    console.log("apps running 3000");
})
