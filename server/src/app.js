import cors from 'cors'
import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(cors())
app.use(express.json())

const movementInclude = {
  categories: { include: { category: true } },
}

function serializeMovement(m) {
  return {
    id: m.id,
    type: m.type,
    amount: m.amount,
    date: m.date.toISOString().slice(0, 10),
    description: m.description,
    categoryIds: m.categories.map((mc) => mc.categoryId),
  }
}

// ---------- Movimientos ----------

app.get('/api/movements', async (req, res) => {
  try {
    const movements = await prisma.movement.findMany({
      include: movementInclude,
      orderBy: { date: 'desc' },
    })
    res.json(movements.map(serializeMovement))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/movements', async (req, res) => {
  try {
    const { type, amount, date, description, categoryIds } = req.body
    if (!type || !amount || !date) {
      return res.status(400).json({ error: 'type, amount y date son requeridos' })
    }
    const movement = await prisma.movement.create({
      data: {
        type,
        amount: Number(amount),
        date: new Date(date),
        description: description || 'Sin descripción',
        categories: {
          create: (categoryIds || []).map((categoryId) => ({ categoryId })),
        },
      },
      include: movementInclude,
    })
    res.status(201).json(serializeMovement(movement))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.put('/api/movements/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { type, amount, date, description, categoryIds } = req.body

    await prisma.movementCategory.deleteMany({ where: { movementId: id } })

    const movement = await prisma.movement.update({
      where: { id },
      data: {
        type,
        amount: Number(amount),
        date: new Date(date),
        description,
        categories: {
          create: (categoryIds || []).map((categoryId) => ({ categoryId })),
        },
      },
      include: movementInclude,
    })
    res.json(serializeMovement(movement))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.delete('/api/movements/:id', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.movement.delete({ where: { id } })
    res.status(204).end()
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ---------- Categorías ----------

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    res.json(categories)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/categories', async (req, res) => {
  try {
    const { name, color } = req.body
    if (!name) {
      return res.status(400).json({ error: 'name es requerido' })
    }
    const category = await prisma.category.create({
      data: { name, color: color || '#38bdf8' },
    })
    res.status(201).json(category)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, color } = req.body
    const category = await prisma.category.update({
      where: { id },
      data: { name, color },
    })
    res.json(category)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.category.delete({ where: { id } })
    res.status(204).end()
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default app
