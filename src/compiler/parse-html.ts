import { ASTAttrs, ASTElement } from 'types/compiler'

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) //匹配结束标签名
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ //匹配属性
const startTagClose = /^\s*(\/?)>/ // <div> <br />

// 思想：匹配一个标签删除一个标签，解析结束的标志为html===''
export function parseHtml(html: string) {
  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3
  const stack: any[] = [] //存放node节点
  let currentParent //当前node节点的父节点，栈中最后一个元素
  let root //根节点

  while (html) {
    // 如果textEnd === 0 说明是一个开始标签或者一个结束标签
    // 如果textEnd > 0 说明是文本结束的位置
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      const startTagMatch = parseStartTag() //解析到的开始标签
      if (startTagMatch) {
        start(startTagMatch.tageName, startTagMatch.attrs)
        continue
      }
      const endTagMatch = html.match(endTag)
      // 处理结束标签
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    if (textEnd > 0) {
      const text = html.substring(0, textEnd) //解析到的文本内容
      if (text) {
        advance(text.length)
        chars(text)
      }
    }
  }
  console.log(html)

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tageName: start[1],
        attrs: [] as ASTAttrs[],
      }
      advance(start[0].length)

      // 如果不是开启标签的结束，就一直匹配
      let attr, end
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5] || true,
        })
      }

      if (end) {
        advance(end[0].length)
      }
      return match
    }
    return false
  }

  function advance(index: number) {
    html = html.substring(index)
  }

  function start(tag: string, attrs: ASTAttrs[]) {
    let node = createASTElement(tag, attrs)
    if (!root) {
      root = node
    }
    if (currentParent) {
      node.parent = currentParent
      currentParent.children.push(node)
    }
    stack.push(node)
    currentParent = node
  }

  function chars(text: string) {
    text = text.replace(/\s/g, ' ')
    text &&
      currentParent.children.push({
        type: TEXT_TYPE,
        text,
        parent: currentParent,
      })
  }

  function end(tag) {
    stack.pop()
    currentParent = stack[stack.length - 1]
  }

  function createASTElement(tag: string, attrs: ASTAttrs[]): ASTElement {
    return {
      tag,
      attrs,
      type: ELEMENT_TYPE,
      children: [],
      parent: null,
    }
  }
  return root
}
