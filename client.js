const { MongoClient } = require('mongodb');
let client = null
const connectToMonogodb = async () => {
    if(!client){
        const url = "mongodb+srv://fareed:Khan1234@cluster0.hvkhsdg.mongodb.net/"
        const mongoClient = new MongoClient(url)
        client = mongoClient.connect()
    }
    return client
}

const getCollection = async(dbName, collectionName) => {
    const client = await connectToMonogodb();
    return client.db(dbName).collection(collectionName)
}

const closeMongodb = async() => {
    if (client) {
        const mongoClient = await client;
        await mongoClient.close()
        client = null
        console.log("MongoDb connection is closed")
    }
}

module.exports= {
    connectToMonogodb,
    getCollection,
    closeMongodb
}