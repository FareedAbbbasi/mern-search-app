const express = require("express");
const { connectToMonogodb, getCollection } = require("./client");
const { ObjectId } = require("mongodb");
const app = express();
const cors = require('cors')


const PORT = 8080
const dbName = "MySampleApp"
app.use(cors());
app.use(express.json());



app.get("/test", (req, res) => {
    res.send("test api")
})

const init = async () => {
    await connectToMonogodb();
    console.log("MongoDb connected......")
    app.listen(PORT, () =>
        console.log(`The server is running on the port ${PORT}`
    ))
}

app.get("/search" , async(req, res) => {
    try {
        const collectionName = "products_v2"
        const { query } = req.query
        const productCollection = await getCollection(dbName, collectionName)

        const aggressionPipeLine = [
            {
                $search: {
                    index: "products_autocomplete",
                    autocomplete: {
                        query: query,
                        path: "description"
                    }
                }
            },
            {
                $limit: 5
            }
        ]
        const results = await productCollection.aggregate(aggressionPipeLine).toArray();
        res.status(200).json({data: results})
    } catch (error) {
        res.status(500).json("Internal Server Error")
        
    }
})

app.get("/products/:id" , async(req, res) => {
    try {
        const collectionName = "products_v2"
        const { id } = req.params
        console.log
        const productCollection = await getCollection(dbName, collectionName)

        const results = await productCollection.findOne({_id: new ObjectId(id)})
        res.status(200).json({data: results})
    } catch (error) {
        res.status(500).json("Internal Server Error")
        
    }
})

init()


