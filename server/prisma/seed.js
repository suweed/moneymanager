import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Categorías por defecto del sistema + etiquetas iniciales.
// Los movimientos se crean desde la app, no se siembran datos de ejemplo.
const DEFAULT_CATEGORIES = [
  { name: 'Ingreso', color: '#22c55e', isDefault: true },
  { name: 'Gasto', color: '#f87171', isDefault: true },
  { name: 'Comida', color: '#f59e0b' },
  { name: 'Transporte', color: '#38bdf8' },
  { name: 'Servicios', color: '#a78bfa' },
  { name: 'Salario', color: '#4ade80' },
  { name: 'Entretenimiento', color: '#fb923c' },
  { name: 'Freelance', color: '#2dd4bf' },
  { name: 'Salud', color: '#f472b6' },
]

async function main() {
  for (const c of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { id: `cat-${c.name.toLowerCase()}` },
      update: {},
      create: { id: `cat-${c.name.toLowerCase()}`, ...c },
    })
  }

  console.log(`Seed completado: ${DEFAULT_CATEGORIES.length} categorías (sin movimientos)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
