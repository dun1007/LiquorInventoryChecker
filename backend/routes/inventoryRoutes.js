const express = require('express')
const router = express.Router()
const {getItems, addItem, updateItem, deleteItem, findItem} = require('../controllers/inventoryController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getItems).post(protect, addItem)
router.route('/:id').get(protect, findItem).put(protect, updateItem).delete(protect, deleteItem)

/* 
route() method allows to clear up code
router.get('/', getAlcohols)
router.post('/', addAlcohol)
router.put('/:id', updateAlcohol)
router.delete('/:id', deleteAlcohol)
*/


module.exports = router