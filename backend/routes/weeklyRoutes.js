const express = require('express')
const router = express.Router()
const { createWeeklyDetails, getOrderSpans, 
    getItemsSold, addItemSold, editItemSold, deleteItemSold, 
    getOrdersReceived, addItemOrdered, editItemOrdered, deleteItemOrdered,
    getItemToOrder, addItemToOrder, editItemToOrder, deleteItemToOrder } = require('../controllers/weeklyController')

const { protect } = require('../middleware/authMiddleware')

router.route('/create/:year/:week').post(protect, createWeeklyDetails)
router.route('/order_spans').get(protect, getOrderSpans)

router.route('/:year/:week/items_sold/').get(protect, getItemsSold).post(protect,addItemSold)
    .put(protect, editItemSold)
router.route('/:year/:week/items_sold/:id').delete(protect, deleteItemSold)

router.route('/:year/:week/orders_received').get(protect, getOrdersReceived).post(protect,addItemOrdered)
    .put(protect, editItemOrdered)
router.route('/:year/:week/orders_received/:id').delete(protect, deleteItemOrdered)

router.route('/:week/order').get(protect, getItemToOrder).post(protect,addItemToOrder)
router.route('/:week/order/:id').put(protect, editItemToOrder).delete(protect,deleteItemToOrder)

module.exports = router