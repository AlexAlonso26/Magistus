import { describe, expect, it } from 'vitest'
import { getCellDisplayValue } from './excelImport.js'

describe('getCellDisplayValue', () => {
  it('uses the Excel format mask for date serial values', () => {
    const cell = { t: 'n', v: 45292, z: 'dd/mm/yyyy' }

    expect(getCellDisplayValue(cell)).toBe('01/01/2024')
  })
})
