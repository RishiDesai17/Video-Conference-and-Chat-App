const mongoose = require('mongoose')

const connectToDB = async() => {
    try{
        await mongoose.connect(process.env.DBURL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        });
        mongoose.Promise = global.Promise;
        console.log("Database connected!")
    }
    catch(err){
        console.log("Cannot connect to the Database")
    }
}

module.exports = connectToDB