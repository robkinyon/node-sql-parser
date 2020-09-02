import { columnDefinitionToSQL } from './column'
import { indexTypeAndOptionToSQL } from './index-definition'
import { tablesToSQL } from './tables'
import { exprToSQL } from './expr'
import { hasVal, toUpper, identifierToSql, keyPartToSQL } from './util'

function alterToSQL(stmt) {
  const { type, table, expr = [] } = stmt
  const action = toUpper(type)
  const tableName = tablesToSQL(table)
  const exprList = expr.map(exprToSQL)
  const result = [action, 'TABLE', tableName, exprList.join(', ')]
  return result.filter(hasVal).join(' ')
}

function alterExprToSQL(expr) {
  const {
    action, constraint_type: constraintType, if_not_exists: ifNotExists,keyword, resource,
  } = expr
  let name = ''
  let dataType = []
  switch (resource) {
    case 'column':
      dataType = [columnDefinitionToSQL(expr)]
      break
    case 'index':
      dataType = indexTypeAndOptionToSQL(expr)
      name = expr[resource]
      break
    case 'table':
      name = identifierToSql(expr[resource])
      break
    case 'algorithm':
    case 'lock':
      name = `= ${expr[resource]}`
      break
    case 'constraint':
      name = keyword === 'check' ? identifierToSql(expr[resource]) : keyPartToSQL(expr[resource])
      dataType = [toUpper(constraintType), ...indexTypeAndOptionToSQL(expr)]
      break
    default:
      break
  }
  const alterArray = [toUpper(action), toUpper(keyword), toUpper(ifNotExists), name, dataType.filter(hasVal).join(' ')]
  return alterArray.filter(hasVal).join(' ')
}

export {
  alterToSQL,
  alterExprToSQL,
}
