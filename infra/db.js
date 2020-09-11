const mongoose = require('mongoose')

const connectToDB = async() => {
    try{
        await mongoose.connect(process.env.DBURL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        mongoose.Promise = global.Promise;
    }
    catch(err){
        console.log("Cannot connect to the Database")
    }
}

module.exports = connectToDB