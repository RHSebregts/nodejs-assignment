
/*

In this file you will find how we send raw data to other services via nats
There are 2 question points for you to tell us the answer on your presentation
If you're up for it

*/
const csvParse      = require ( "csv-parse")
const fs            = require ( "fs")
const Writable      = require ("stream").Writable

// NATS Server is a simple, high performance open source messaging system
// for cloud native applications, IoT messaging, and microservices architectures.
// https://nats.io/
// It acts as our pub-sub (https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)
// mechanism for other service that needs raw data
const NATS = require("nats")

// At this point, do not forget to run NATS server!

// NATS connection happens here
// After a connection is made you can start broadcasting messages (take a look at nats.publish())
const nats = NATS.connect({json: true})

// This function will start reading out csv data from file and publish it on nats
const readOutLoud = (vehicleName) => {
	// Read out meta/route.csv and turn it into readable stream
	const fileStream = fs.createReadStream("./meta/route.csv")
	// =========================
	// Question Point 1:
	// What's the difference betweeen fs.createReadStream, fs.readFileSync, and fs.readFileAsync?
	// And when to use one or the others
	// =========================
    // Answer:
    // fs.createReadStream will process data in chunks of a set size. 
    // This keeps the memory load smaller. Since it deals with data in small chunks you can start processing the data early.
    // Freeing up memory for a readStream is more complex (for the system, that is).
    // fs.readFileAsync will asynchronously add the entire file to memory.
    // fs.readFileSync will synchronously add the entire file to memory, and thus will block the eventloop. This is less ideal for larger files.
    // fs.readFileSync and fs.readFileAsync will put the entire file in memory. This makes it easy for Node to remove them from memory, but it will also take a lot of memory.
    // Because fs.createReadStream works with smaller chunks of data your data will most likely be available for use quicker.
    // fs.createReadStream is best used with more frequent requests and larger files. fs.readFile
	// Now comes the interesting part,
	// Handling this filestream requires us to create pipeline that will transform the raw string
	// to object and sent out to nats
	// The pipeline should looks like this
	//
	//  File -> parse each line to object -> published to nats
	//

	let i = 0

	return (fileStream
		// Filestream piped to csvParse which accept nodejs readablestreams and parses each line to a JSON object
		.pipe(csvParse({ delimiter: ",", columns: true, cast: true }))
		// Then it is piped to a writable streams that will push it into nats
		.pipe(new Writable({
			objectMode: true,
			write(obj, enc, cb) {
				// setTimeout in this case is there to emulate real life situation
				// data that came out of the vehicle came in with irregular interval
				// Hence the Math.random() on the second parameter
				const connectionDelay = Math.ceil(Math.random()*10)
				setTimeout(() => {
					i++
					if((i % 100) === 0)
						console.log(`vehicle ${vehicleName} sent have sent ${i} messages`)

					// The first parameter on this function is topics in which data will be broadcasted
					// it also includes the vehicle name to seggregate data between different vehicle

					nats.publish(`vehicle.${vehicleName}`, obj, cb)
					obj.vehicleName = vehicleName;
					routeArray.push(obj)
				}, Math.ceil(Math.random() * 150) * connectionDelay)
			}
		})))
	// =========================
	// Question Point 2:
	// What would happend if it failed to publish to nats or connection to nats is slow?
	// Maybe you can try to emulate those slow connection
	// =========================
	// 
}

// This next few lines simulate Henk's (our favorite driver) shift
console.log("Henk checks in on test-bus-1 starting his shift...")
readOutLoud("test-bus-1")
	.once("finish", () => {
		console.log("Henk is on the last stop and he is taking a cigarrete while waiting for his next trip")
		console.log("Henk is ready to go again!")
		if(routeArray.length){
			const reversedRoute = routeArray.reverse()
			readReverse(reversedRoute)
		}
	})
// To make your presentation interesting maybe you can make henk drive again in reverse
let routeArray = []
const readReverse = (array) =>{
	const publishRouteInfo = (i)=>{
		const data = array[i]
		setTimeout(
			function(){
				nats.publish(`vehicle.${data.vehicleName}`, data)
				if((i % 100) === 0)
				console.log(`vehicle ${data.vehicleName} sent have sent ${i} reversed messages`)
		}, (i*100) +  Math.ceil(Math.random() * 150))
	}
	for (let i = 1; i < array.length; i++) {
		publishRouteInfo(i)
	}
}