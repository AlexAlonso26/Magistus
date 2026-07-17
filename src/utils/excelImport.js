import * as XLSX from 'xlsx'

export function extractRowsFromSheet(worksheet) {
  if (!worksheet) {
    return []
  }

  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
  const headers = []

  for (let columnIndex = range.s.c; columnIndex <= range.e.c; columnIndex += 1) {
    const cell = worksheet[XLSX.utils.encode_cell({ r: range.s.r, c: columnIndex })]
    headers.push(getCellDisplayValue(cell))
  }

  const rows = []

  for (let rowIndex = range.s.r + 1; rowIndex <= range.e.r; rowIndex += 1) {
    const row = {}

    for (let columnIndex = range.s.c; columnIndex <= range.e.c; columnIndex += 1) {
      const header = headers[columnIndex - range.s.c]
      const cell = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: columnIndex })]

      if (!header) {
        continue
      }

      row[header] = getCellDisplayValue(cell)
    }

    if (Object.values(row).some((value) => value !== '')) {
      rows.push(row)
    }
  }

  return rows
}

export function getCellDisplayValue(cell) {
  if (!cell) {
    return ''
  }

  if (cell.w !== undefined && cell.w !== null && cell.w !== '') {
    return String(cell.w)
  }

  if (cell.v === undefined || cell.v === null) {
    return ''
  }

  if (cell.t === 'd' && cell.v instanceof Date) {
    return cell.v.toLocaleDateString('pt-BR')
  }

  if (cell.t === 'n' && typeof cell.v === 'number' && cell.z) {
    try {
      const formatted = XLSX.SSF.format(cell.z, cell.v)
      if (formatted && formatted !== 'Invalid date') {
        return formatted
      }
    } catch {
      // fallback to default formatting
    }
  }

  if (cell.t === 'n' && typeof cell.v === 'number') {
    const date = new Date((cell.v - 25569) * 86400 * 1000)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return String(cell.v)
}
