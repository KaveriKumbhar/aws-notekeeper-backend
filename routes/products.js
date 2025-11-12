const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const auth = require('../middleware/auth')

// Create
router.post('/', auth, async (req,res)=>{
  try {
    const { title, description, price } = req.body
    const p = await Product.create({ title, description, price, owner: req.userId })
    res.json({ product: p })
  } catch(e){ res.status(500).json({ message: 'Error' }) }
})

// List
router.get('/', async (req,res)=>{
  const products = await Product.find().sort({createdAt:-1})
  res.json({ products })
})

// Get by id
router.get('/:id', async (req,res)=>{
  try{
    const p = await Product.findById(req.params.id)
    if (!p) return res.status(404).json({ message: 'Not found' })
    res.json({ product: p })
  } catch(e){ res.status(500).json({ message: 'Error' }) }
})

// Delete (owner only)
router.delete('/:id', auth, async (req,res)=>{
  const p = await Product.findById(req.params.id)
  if(!p) return res.status(404).json({ message: 'Not found' })
  if (p.owner.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' })
  await p.remove()
  res.json({ message: 'Deleted' })
})

module.exports = router
