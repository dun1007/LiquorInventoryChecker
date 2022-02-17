import express from "express"
import InventoryManagerController from "./inventory_manager.controller.js"

const router = express.Router()

router.route("/")
    .get(InventoryManagerController.apiGetItems)
    .post(InventoryManagerController.apiAddItem)
    .put(InventoryManagerController.apiModifyItem)
    .delete(InventoryManagerController.apiDeleteItem)


//(req, res) => res.send("hello world")
export default router