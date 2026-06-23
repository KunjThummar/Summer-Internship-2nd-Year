const mongoose = require('mongoose')

const connectToDatabase = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://Yug_Patel:Yug%40083@ac-i1tzijf-shard-00-00.xkhh3qi.mongodb.net:27017,ac-i1tzijf-shard-00-01.xkhh3qi.mongodb.net:27017,ac-i1tzijf-shard-00-02.xkhh3qi.mongodb.net:27017/EM?ssl=true&replicaSet=atlas-9im7pm-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';
        await mongoose.connect(uri)
        console.log("Database connected");
    } catch (error) {
        console.log(error)
    }
}

module.exports = { connectToDatabase } 