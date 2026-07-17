import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { buildCards } from './utils/cardsFromRows.js'
import { extractRowsFromSheet } from './utils/excelImport.js'
import './App.css'

const STORAGE_KEY = 'magistus-state'

function App() {
  const [cards, setCards] = useState([])
  const [columns, setColumns] = useState([])
  const [fileName, setFileName] = useState('')
  const [sheetName, setSheetName] = useState('')
  const [error, setError] = useState('')
  const [doneCards, setDoneCards] = useState([])

  useEffect(() => {
    try {
      const savedState = window.localStorage.getItem(STORAGE_KEY)
      if (!savedState) {
        return
      }

      const parsedState = JSON.parse(savedState)
      if (parsedState.cards?.length) {
        setCards(parsedState.cards)
        setColumns(parsedState.columns ?? [])
        setFileName(parsedState.fileName ?? '')
        setSheetName(parsedState.sheetName ?? '')
        setDoneCards(parsedState.doneCards ?? [])
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    const stateToSave = {
      cards,
      columns,
      fileName,
      sheetName,
      doneCards,
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
  }, [cards, columns, fileName, sheetName, doneCards])

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const rows = extractRowsFromSheet(worksheet)

      setFileName(file.name)
      setSheetName(firstSheetName)
      setColumns(Object.keys(rows[0] ?? {}).filter(Boolean))
      setCards(buildCards(rows))
      setDoneCards([])
      setError('')
    } catch {
      setError('Não foi possível ler a planilha. Envie um arquivo .xlsx, .xls ou .csv válido.')
      setCards([])
      setColumns([])
      setFileName('')
      setSheetName('')
      setDoneCards([])
    }
  }

  const toggleDone = (cardId) => {
    setDoneCards((current) =>
      current.includes(cardId) ? current.filter((id) => id !== cardId) : [...current, cardId],
    )
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Magistus</p>
        <h1>Arraste uma planilha e transforme cada linha em uma ficha.</h1>
        <p className="description">
          Envie um arquivo Excel ou CSV e o app vai converter as colunas em cartões com os dados de cada linha.
        </p>

        <label className="upload-box" htmlFor="excel-file">
          <span>Escolher arquivo</span>
          <input id="excel-file" type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
        </label>
      </header>

      {error ? <p className="error">{error}</p> : null}

      {cards.length > 0 ? (
        <section className="summary">
          <div>
            <strong>Arquivo:</strong> {fileName}
          </div>
          <div>
            <strong>Planilha:</strong> {sheetName}
          </div>
          <div>
            <strong>Colunas:</strong> {columns.join(', ')}
          </div>
          <div>
            <strong>Fichas:</strong> {cards.length}
          </div>
        </section>
      ) : null}

      <section className="cards-grid">
        {cards.map((card) => {
          const isDone = doneCards.includes(card.id)

          return (
            <article key={card.id} className={`card ${isDone ? 'card-done' : ''}`}>
              <div className="card-header">
                <span className="pill">Ficha {card.id}</span>
                <h2>{card.title}</h2>
              </div>

              <ul className="card-list">
                {card.fields.map((field) => (
                  <li key={`${card.id}-${field.key}`}>
                    <span>{field.label}</span>
                    <strong>{field.value}</strong>
                  </li>
                ))}
              </ul>

              <button type="button" className="done-button" onClick={() => toggleDone(card.id)}>
                {isDone ? '✓ Feito' : 'Marcar como feito'}
              </button>
            </article>
          )
        })}
      </section>
    </main>
  )
}

export default App
