import mongodb from "mongodb"
const ObjectID = mongodb.ObjectId
let inventory


export default class InventoryManagerDAO {
    static async injectDB(conn) {
        if (inventory) {
            return
        }
        
        try {
            inventory = await conn.db(process.env.INVENTORY_NS).collection("inventory")
        } catch(e) {
            console.error(`Unable to establish a collection handle in inventoryDAO' ${e}`)
        }
    }

    static async getItemList({
        filters = null,
        page = 0,
        itemsPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("name" in filters) {
                query = { $text : { $search: filters["name"]}}
            } 
            else if ("type" in filters) {
                query = { "type": { $eq: filters["type"]}}
            }
            else if ("packaging" in filters) {
                query = {"packaging": {$eq: filters["packaging"]}}
            }
        }

        let cursor 

        try {
            cursor = await inventory
                .find(query)
        } 
        catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { itemsList: [], totalNumItems: 0}
        }

        const displayCursor = cursor.limit(itemsPerPage).skip(itemsPerPage * page)

        try {
            const itemsList = await displayCursor.toArray()
            const totalNumItems = await inventory.countDocuments(query)
            return { itemsList, totalNumItems }
        } 
        catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`,)
            return { itemsList: [], totalNumItems: 0}
        }
    }

    static async addItem(name, type, packaging, unit, volume) {
        try {
            const newItem = {
                name: name,
                type: type,
                packaging: packaging,
                volume: volume,
                unit: unit,
            }
            return await inventory.insertOne(newItem) 
        } catch (e) {
            console.error(`Unable to add an item: ${e}`)
            return {error: e}
        }
    }

    static async modifyItem(id, name, type, packaging, unit, volume) {
        try {
            const modifiedItem = {
                name: name,
                type: type,
                packaging: packaging,
                volume: volume,
                unit: unit,
            }
            const modifyResponse = await inventory.updateOne(
                {_id: ObjectID(id)},
                { $set: modifiedItem},
            )
            
            return modifyResponse
        } catch (e) {
            console.error(`Unable to modify item: ${e}`)
            return { error: e }
        }
    }

    static async deleteItem(id) {
        try {
            const deleteResponse = await inventory.deleteOne({
                _id: ObjectID(id)
            })

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete review: ${e}`)
            return { error: e }
        }
    }
}