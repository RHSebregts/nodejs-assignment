const mongoose = require("mongoose");
const incidentEntry = new mongoose.Schema({
        data : {}
      }
,{timestamps : true});
const IncidentEntry = mongoose.model("Incident", incidentEntry);

module.exports = IncidentEntry;