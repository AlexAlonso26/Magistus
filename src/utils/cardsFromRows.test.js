import { describe, expect, it } from 'vitest'
import { buildCards } from './cardsFromRows.js'

describe('buildCards', () => {
  it('converts rows into cards using only the requested fields', () => {
    const cards = buildCards([
      {
        'Nome / Razão Social': 'Ana Silva',
        'Nome Social / Nome Fantasia': 'Ana',
        Documento: '123.456.789-00',
        'Tipo de Pessoa': 'Física',
        'Email Principal': 'ana@email.com',
        'Telefone Principal': '(11) 99999-9999',
        'Data de Cadastro': '2024-01-02',
        'Última Atualização': '2024-02-03',
        Status: 'Ativo',
      },
    ])

    expect(cards).toHaveLength(1)
    expect(cards[0].title).toBe('Ana Silva')
    expect(cards[0].fields).toEqual([
      { key: 'nomeRazaoSocial', label: 'Nome / Razão Social', value: 'Ana Silva' },
      { key: 'nomeSocialNomeFantasia', label: 'Nome Social / Nome Fantasia', value: 'Ana' },
      { key: 'documento', label: 'Documento', value: '123.456.789-00' },
      { key: 'tipoDePessoa', label: 'Tipo de Pessoa', value: 'Física' },
      { key: 'emailPrincipal', label: 'Email Principal', value: 'ana@email.com' },
      { key: 'telefonePrincipal', label: 'Telefone Principal', value: '(11) 99999-9999' },
      { key: 'dataDeCadastro', label: 'Data de Cadastro', value: '2024-01-02' },
      { key: 'ultimaAtualizacao', label: 'Última Atualização', value: '2024-02-03' },
      { key: 'status', label: 'Status', value: 'Ativo' },
    ])
  })
})
