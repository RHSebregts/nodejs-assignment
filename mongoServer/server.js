// Database logic
const mongoose = require('mongoose')
const RouteInformationEntry = require('./dbModels/routeInformationModel.js')
const IncidentEntry = require('./dbModels/incidentModel.js')
const dbLocation = "mongodb://localhost/viricitiTech"
/* Note:
In production app we would hide locations like these and portinformation in enviroment variables stored in seperate files.
The elements of the server: Database logic, socket logic, routing logic and NATS logic would also be seperated.
*/
mongoose.connect(dbLocation, async (err,res)=>{
    if(err){
        throw(err)
    }else{
        console.log('Succesfully connected to database')
        // Clean up collection if it gets too big
        const routeInformationCount = await RouteInformationEntry.count()
        if(routeInformationCount > 40000){
            RouteInformationEntry.collection.drop()
            IncidentEntry.collection.drop()
            console.log('Emptied the RouteInformation and Incident Collection')
        }
    }
})


// REST Logic
const express = require('express')
const app = express()
app.set("view engine", "ejs");
const http = require('http').createServer(app)
const port = 2021
http.listen(port, ()=>{
    console.log(`Listening on *:${port}`);
});

app.get("/", async(req,res)=>{
    res.render('../mongoServer/views/routeInformation.ejs')
})
app.get("/incidents", async(req,res)=>{
    const incidents = await IncidentEntry.find()
    res.render('../mongoServer/views/incidents.ejs', {incidents : incidents})
})
// Websocket Logic
const io = require('socket.io')(http);
io.on('connection', (socket) => {
    let date = new Date (socket.handshake.time)
    console.log(`Connection to socket made at ${date} with  ${socket.handshake.headers["x-real-ip"]}. ${io.engine.clientsCount} open connection(s).`)
    socket.emit('connectedToServer', true)
})

// Recieving and dealing with incoming data
const NATS = require('nats')
const nats = NATS.connect({json : true})

const listenForVehicleData = (vehicleName) => {
    nats.subscribe(`vehicle.${vehicleName}`, async (data)=>{
        data.vehicleName = vehicleName
        try{
            let addNewEntry = await RouteInformationEntry.create(data)
            io.emit('vehicleMessage', data)
        }catch(err){
           incidentHandling(err)
    }
    })
  }

const incidentHandling = (data) =>{
    data.error = true
    io.emit('vehicleError', data)
    IncidentEntry.create({data : data})
}
listenForVehicleData('test-bus-1')