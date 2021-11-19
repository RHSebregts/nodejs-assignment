const mongoose = require("mongoose");
const routeInformationEntry = new mongoose.Schema({
        time: {type : Date, required: true},
        energy: {type : mongoose.Decimal128, required : true},
        gps: {type : [String], required : true},
        odo: {type : mongoose.Decimal128, required : true},
        speed: {type : Number, required : true},
        soc: {type : mongoose.Decimal128, required : true},
        vehicleName : {type : String, required : true},
        error : {}
      }
,{timestamps : true});
const RouteInformationEntry = mongoose.model("RouteInformation", routeInformationEntry);

module.exports = RouteInformationEntry;