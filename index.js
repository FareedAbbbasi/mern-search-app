const express = require("express");
const { connectToMonogodb, getCollection } = require("./client");
const app = express();

const PORT = 8080

const dbName = "MySampleApp"


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
                $limit: 2
            }
        ]
        const results = await productCollection.aggregate(aggressionPipeLine).toArray();
        res.status(200).json({data: results})
    } catch (error) {
        res.status(500).json("Internal Server Error")
        
    }
})

init()


