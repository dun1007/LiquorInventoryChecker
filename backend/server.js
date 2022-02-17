import express from "express"
import cors from "cors"
import inventory_manager from "./api/inventory_manager.route.js"

const app = express()

app.use(cors()) //cors stands for cross origin resource sharing. used to allow or restrict requested resources
app.use(express.json()) //built in method to recognize the incoming request object as JSON object

app.use("/api/v1/inventory_manager", inventory_manager) 
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

export default app