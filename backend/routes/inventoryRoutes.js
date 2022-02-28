const express = require('express')
const router = express.Router()
const {getItems, addItem, updateItem, deleteItem, findItem, 
    updateInventory, createInventory, setUpDemoData} = require('../controllers/inventoryController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getItems).post(protect, addItem)
router.route('/all').put(protect, updateInventory)
router.route('/create').post(protect, createInventory)
router.route('/demo_setup').post(protect, setUpDemoData)
router.route('/:id').get(protect, findItem).put(protect, updateItem).delete(protect, deleteItem)

module.exports = router