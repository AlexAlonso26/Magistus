const fieldDefinitions = [
  {
    key: 'nomeRazaoSocial',
    label: 'Nome / Razão Social',
    aliases: ['nome / razão social', 'nome razao social', 'nome', 'razao social', 'nome da empresa'],
  },
  {
    key: 'nomeSocialNomeFantasia',
    label: 'Nome Social / Nome Fantasia',
    aliases: ['nome social / nome fantasia', 'nome social', 'nome fantasia', 'apelido'],
  },
  {
    key: 'documento',
    label: 'Documento',
    aliases: ['documento', 'cpf', 'cnpj', 'cpf/cnpj'],
  },
  {
    key: 'tipoDePessoa',
    label: 'Tipo de Pessoa',
    aliases: ['tipo de pessoa', 'tipo', 'pessoa física', 'pessoa juridica'],
  },
  {
    key: 'emailPrincipal',
    label: 'Email Principal',
    aliases: ['email principal', 'email', 'e-mail'],
  },
  {
    key: 'telefonePrincipal',
    label: 'Telefone Principal',
    aliases: ['telefone principal', 'telefone', 'celular', 'whatsapp'],
  },
  {
    key: 'dataDeCadastro',
    label: 'Data de Cadastro',
    aliases: ['data de cadastro', 'data cadastro', 'datacadastro'],
  },
  {
    key: 'ultimaAtualizacao',
    label: 'Última Atualização',
    aliases: ['última atualização', 'ultima atualizacao', 'ultima atualizacao', 'ultimaatualizacao'],
  },
  {
    key: 'status',
    label: 'Status',
    aliases: ['status'],
  },
]

export function buildCards(rows = []) {
  return (rows ?? []).map((row, index) => {
    const fields = fieldDefinitions.map((definition) => {
      const value = getFieldValue(row, definition.aliases)
      return {
        key: definition.key,
        label: definition.label,
        value: formatValue(value),
      }
    })

    const titleValue =
      fields.find((field) => field.key === 'nomeRazaoSocial')?.value ||
      fields.find((field) => field.key === 'nomeSocialNomeFantasia')?.value ||
      fields[0]?.value ||
      `Ficha ${index + 1}`

    return {
      id: index + 1,
      title: String(titleValue),
      fields,
    }
  })
}

function getFieldValue(row, aliases = []) {
  const normalizedRow = Object.entries(row ?? {}).reduce((accumulator, [key, value]) => {
    accumulator[normalizeText(key)] = value
    return accumulator
  }, {})

  for (const alias of aliases) {
    const normalizedAlias = normalizeText(alias)
    if (normalizedAlias in normalizedRow) {
      return normalizedRow[normalizedAlias]
    }
  }

  return ''
}

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function formatValue(value) {
  if (value === undefined || value === null || value === '') {
    return ''
  }

  if (value instanceof Date) {
    return value.toLocaleDateString('pt-BR')
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const date = new Date((value - 25569) * 86400 * 1000)
    return date.toLocaleDateString('pt-BR')
  }

  return String(value)
}
