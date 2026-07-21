import * as XLSX from 'xlsx'

export interface ExcelColumn<T = unknown> {
  label: string
  value: (item: T) => string | number | boolean | null | undefined
}

export function exportToExcel<T>(
  fileName: string,
  columns: ExcelColumn<T>[],
  data: T[]
) {
  const header = columns.map(col => col.label)
  const rows = data.map(item =>
    columns.map(col => {
      const raw = col.value(item)
      return raw === null || raw === undefined ? '' : raw
    })
  )

  const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos')

  const safeName = fileName.replace(/[<>:"/\\|?*]+/g, '_')
  XLSX.writeFile(workbook, `${safeName}.xlsx`)
}
