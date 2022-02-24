const express = require('express')
const router = express.Router()
const {getAlcohols, addAlcohol, updateAlcohol, deleteAlcohol, findAlcohol} = require('../controllers/itemController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getAlcohols).post(protect, addAlcohol)
router.route('/:id').put(protect, updateAlcohol).delete(protect, deleteAlcohol)
router.route('/find/:id').get(findAlcohol)
/* 
route() method allows to clear up code
router.get('/', getAlcohols)
router.post('/', addAlcohol)
router.put('/:id', updateAlcohol)
router.delete('/:id', deleteAlcohol)
*/

module.exports = router