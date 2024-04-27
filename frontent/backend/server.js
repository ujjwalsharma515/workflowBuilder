const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");

const dotenv = require("dotenv");
const methods = require('methods');
app.use(express.json());
app.use(require("./routes/router"));
dotenv.config({path:"./.env"});
const PORT = process.env.PORT || 5000 ;
app.use(cors(
    {
        origin:'http://localhost:3000',
        methods:["POST","GET"],
        credentials:true
    }
))

//for connect MongoDB server
const Connect =async()=>{
    await mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("connected..");
    }).catch((err)=>{
        console.log(err);
    });
}     
Connect();

//for lisning the port
app.listen(PORT,()=>{
    console.log(`app is Listening on port no ${PORT}`);
})