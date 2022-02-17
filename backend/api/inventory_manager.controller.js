//EXPRESS
import InventoryManagerDAO from "../dao/inventory_managerDAO.js"

/*
req.body: 
actual body of the request. 
generally used in POST/PUT requests.

req.params: 
route parameter. 
app.get('/giraffe/:number', (req, res) => {
    console.log(req.params.number)
})

req.query: 
any query parameters. used for searching, filtering etc
GET http://localhost:5000/api/v1/inventory_manager?type=liquor 
query is {type=liquor}

*/
export default class InventoryManagerController {
    static async apiGetItems(req, res, next) {
        const itemsPerPage = req.query.itemsPerPage ? parseInt(req.query.itemsPerPage, 10) : 10
        const page = req.query.page ? parseInt(req.query.page, 10) : 0
        
        let filters = {}
        if (req.query.name) {
            filters.name = req.query.name
        } else if (req.query.type) {
            filters.type = req.query.type
        }

        const { itemsList, totalNumItems } = await InventoryManagerDAO.getItemList({
            filters,
            page,
            itemsPerPage,
        })

        let response = {
            items: itemsList,
            page: page,
            filters: filters,
            entries_per_page: itemsPerPage,
            total_results: totalNumItems,
        }
        res.json(response)
    }

    static async apiAddItem(req, res, next) {
        try {
            const itemName = req.body.name
            const itemType = req.body.type
            const itemPackaging = req.body.packaging
            const itemVolume = req.body.volume
            const itemUnit = req.body.unit


            const ItemResponse = await InventoryManagerDAO.addItem(
                itemName,
                itemType,
                itemPackaging,
                itemVolume,
                itemUnit,
            )

            res.json({status:"success"})
        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    
    static async apiModifyItem(req, res, next) {
        try {
            const id = req.body.id
            const itemName = req.body.name
            const itemType = req.body.type
            const itemPackaging = req.body.packaging
            const itemUnit = req.body.unit
            const itemVolume = req.body.volume

            const modifyResponse = await InventoryManagerDAO.modifyItem(
                id,
                itemName,
                itemType,
                itemPackaging,
                itemUnit,
                itemVolume,
            )

            var { error } = modifyResponse
            if (error) {
                res.status(400).json({error})
            }

            res.json({status:"success"})
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteItem(req, res, next) {
        try {
            const id = req.body.id
            const deleteResponse = await InventoryManagerDAO.deleteItem(
                id
            )
            res.json({status:"success"})
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}
