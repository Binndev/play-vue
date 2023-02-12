import { ASTAttrs, ASTElement } from 'types/compiler'
import { parseHtml } from './parse-html'

export function compileToFunction(template: string) {
  // 1.将template转化成ast语法树
  // 2.生成render方法（render方法执行后返回的结果是vdom）
  const ast = parseHtml(template)
  genCode(ast)
}

function genCode(ast: ASTElement) {
  let children
  if (ast.children) {
    children = genChildren(ast.children)
  }
  const code = `
    _c('${ast.tag}', ${ast.attrs?.length ? genProps(ast.attrs) : 'null'}
    ${children ? `,${children}` : ''}
    )
  `

  return code
}

// 对属性操作
function genProps(attrs: ASTAttrs[]) {
  let str = ''
  for (let i = 0, l = attrs.length; i < l; i++) {
    const attr = attrs[i]
    if (attr.name === 'style') {
      const obj = {}
      attr.value.split(';').forEach(item => {
        const [k, v] = item.split(':')
        obj[k] = v
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }

  return `{${str.slice(0, -1)}}`
}

function genChildren(children) {
  return children.map(child => gen(child))
}

// 对node节点操作
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{}} 匹配到表达式变量
function gen(node: ASTElement) {
  if (node.type === 1) {
    return genCode(node)
  } else {
    // 文本处理
    const text = node.text!
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    } else {
      //匹配文本节点 并转化为 _v(_s(变量)+'字符')
      let token: string[] = []
      let match
      defaultTagRE.lastIndex = 0 //重置正则位置
      let lastIndex = 0
      while ((match = defaultTagRE.exec(text))) {
        const index = match.index
        if (index > lastIndex) {
          token.push(text.slice(lastIndex, index))
        }
        token.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {
        token.push(text.slice(lastIndex))
      }
      return `_v(${token.join('+')})`
    }
  }
}
