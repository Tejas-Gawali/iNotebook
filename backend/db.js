const moongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook";

const connectToMongo = ()=>{
    moongoose.connect(mongoURI,()=>{
        console.log("Connected to mongo")
    });

}

module.exports = connectToMongo;