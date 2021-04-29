const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const moment = require('moment')
const redis = require('redis')
const {promisify} = require('util')
// const {host} = require('./.env')
//
//
// let redisClient = redis.createClient({host:host,port:6379})
let redisClient = redis.createClient()


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
        parkinLot:req.query.parkingLot,
        paid:false
    }
    await set(ticketId,JSON.stringify(data))
    ticketId += 1;
    await set('ticketId',ticketId)



});

app.post('/exit', async (req, res) =>{

    let {ticketId} = (req.query)
    let end = moment();
    let data = await get(ticketId)
    if (data === null){
        res.json('no such ticket exits')
    }
    else {
        data = JSON.parse(data)
        if (data.paid === true) {
            res.json('ticket is paid already')
        }
    else {
            let diffHours = end.diff(data.start, 'minutes');
            let money = Math.floor(diffHours / 15 * 2.5);
            res.json({platId: data.plateId, money, parkingLot: data.parkinLot, paid: true})
            data.paid = true
            await set(ticketId, JSON.stringify(data))
        }
    }

});




app.listen(3000, () => {
    console.log("apps running 3000");
})
