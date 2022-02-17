import InventoryManagerDAO from "../dao/inventory_managerDAO.js"

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

    }

    static async apiDeleteItem(req, res, next) {

    }

    static async apiModifyItem(req, res, next) {
        
    }
}
