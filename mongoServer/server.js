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
        if(routeInformationCount > 3000){
            RouteInformationEntry.collection.drop()
            IncidentEntry.collection.drop()
            console.log('Emptied the RouteInformation and Incident Collection')
        }
    }
})


// REST Logic
const express = require('express')
const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
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
app.get("/incidentLookup", async (req,res)=>{
    res.render('../mongoServer/views/incidentLookup.ejs', {incidents : null})
})
app.post("/findIncidents", async (req,res)=>{
    const dbFilter = getRouteFilter(req.body, true)
    const foundIncidents = await IncidentEntry.find(dbFilter).catch((err)=>{console.log(err)})
    res.render('../mongoServer/views/incidents.ejs', {incidents : foundIncidents})
})
app.get("/routeInformationLookup", async (req,res)=>{
    res.render('../mongoServer/views/routeInformationLookup.ejs', {routeEntries : null})
})
app.post("/findRouteEntries", async (req,res)=>{
    const dbFilter = getRouteFilter(req.body)
    const foundRouteInformation = await RouteInformationEntry.find(dbFilter).catch((err)=>{console.log(err)})
    res.render('../mongoServer/views/viewRouteInformation.ejs', {routeEntries : foundRouteInformation})
})
// Websocket Logic
const io = require('socket.io')(http);
io.on('connection', (socket) => {
    let date = new Date (socket.handshake.time)
    console.log(`Connection to socket made at ${date} with  ${socket.handshake.headers["x-real-ip"]}. ${io.engine.clientsCount} open connection(s).`)
    socket.emit('connectedToServer', true)
})

// Recieving and dealing with incoming data from NATS
const NATS = require('nats')
const nats = NATS.connect({json : true})

const listenForVehicleData = (vehicleName) => {
    nats.subscribe(`vehicle.${vehicleName}`, async (data)=>{
        data.vehicleName = vehicleName
        try{
            let addNewEntry = await RouteInformationEntry.create(data)
            io.emit('vehicleMessage', data)
        }catch(err){
           incidentHandling(err, data)
    }
    })
}

const incidentHandling = (data, dataEntered) =>{
    data.error = true
    io.emit('vehicleError', dataEntered)
    IncidentEntry.create({data : dataEntered})
}
const getRouteFilter = (routeCriteria, lookForIncident)=>{
    let queryKeys = Object.keys(routeCriteria)
    let dbFilter = {}
    if(routeCriteria.time[0] !== 'ignore'){
        let newDate = new Date(routeCriteria.time[1])
        routeCriteria.time[1] = newDate.getTime()
    }
    queryKeys.forEach(key=>{
        let queryItem = routeCriteria[key]
        let dbKey = key
        if(lookForIncident){
            dbKey = `data.${key}`
        }
        if(queryItem[2]){
            dbFilter[`data.${key}`] = {$eq : ''}
        }else if(queryItem[0] === 'ignore'){
            return
        }else if(queryItem[0]=== 'gt'){
            dbFilter[dbKey] = {$gt : parseFloat(queryItem[1])}
        }else if(queryItem[0]=== 'lt'){
            dbFilter[dbKey] = {$lt : parseFloat(queryItem[1])}
        }else if(queryItem[0]=== '=='){
            dbFilter[dbKey] = {$eq : parseFloat(queryItem[1])}
        }
    })
    return dbFilter
}

// 
//  =================================
// 

listenForVehicleData('test-bus-1')

