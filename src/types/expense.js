/**
 * Modelo de datos de la app (referencia para el futuro esquema de base de datos).
 *
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} color
 *
 * @typedef {Object} Movement
 * @property {string} id
 * @property {'ingreso'|'gasto'} type
 * @property {number} amount
 * @property {string} date - formato ISO (YYYY-MM-DD)
 * @property {string} description
 * @property {string[]} categoryIds - un movimiento puede tener varias etiquetas/categorías
 */

export const MOVEMENT_TYPES = {
  INCOME: 'ingreso',
  EXPENSE: 'gasto',
}

// Categorías por defecto que siempre existen en el sistema.
export const DEFAULT_CATEGORY_IDS = {
  INCOME: 'cat-ingreso',
  EXPENSE: 'cat-gasto',
}
