import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { DEFAULT_CATEGORY_IDS } from '../../types/expense'
import { formatCurrency } from '../../utils/format'

function isDefaultCategory(cat) {
  return cat.id === DEFAULT_CATEGORY_IDS.INCOME || cat.id === DEFAULT_CATEGORY_IDS.EXPENSE
}

const tooltipStyle = {
  background: 'var(--surface-alt)',
  border: '1px solid var(--border)',
}

// Dos gráficas de pay: una con Ingreso/Gasto y otra con las demás categorías.
export function MonthlyChart({ breakdown }) {
  const mainCategories = breakdown.filter((c) => isDefaultCategory(c))
  const otherCategories = breakdown.filter((c) => !isDefaultCategory(c))

  const mainData = mainCategories.map((cat) => ({
    name: cat.name,
    value: cat.amount,
    fill: cat.color,
  }))
  const otherData = otherCategories.map((cat) => ({
    name: cat.name,
    value: cat.amount,
    fill: cat.color,
    incomeAmount: cat.incomeAmount,
    expenseAmount: cat.expenseAmount,
  }))

  function OtherCategoriesTooltip({ active, payload }) {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div style={tooltipStyle}>
        <p style={{ margin: 0, color: 'var(--text)' }}>{d.name}: {formatCurrency(d.value)}</p>
        <p style={{ margin: 0, color: 'var(--income)' }}>Ingresos: {formatCurrency(d.incomeAmount)}</p>
        <p style={{ margin: 0, color: 'var(--expense)' }}>Gastos: {formatCurrency(d.expenseAmount)}</p>
      </div>
    )
  }

  return (
    <section style={styles.card}>
      <h2 style={styles.title}>Gráfico</h2>

      {breakdown.length === 0 ? (
        <p style={styles.empty}>Sin datos para graficar.</p>
      ) : (
        <div style={styles.chartsRow}>
          <div style={styles.chartCol}>
            <h3 style={styles.subtitle}>Ingresos y Gastos</h3>
            {mainData.length === 0 ? (
              <p style={styles.empty}>Sin datos.</p>
            ) : (
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={mainData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {mainData.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={tooltipStyle} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div style={styles.chartCol}>
            <h3 style={styles.subtitle}>Otras categorías</h3>
            {otherData.length === 0 ? (
              <p style={styles.empty}>Sin datos.</p>
            ) : (
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={otherData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {otherData.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<OtherCategoriesTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 12,
    color: 'var(--text-muted)',
  },
  subtitle: {
    fontSize: 14,
    margin: '8px 0 4px',
    color: 'var(--text)',
  },
  chartsRow: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
  },
  chartCol: {
    flex: '1 1 280px',
    minWidth: 0,
  },
  empty: {
    color: 'var(--text-muted)',
    fontSize: 14,
  },
}
