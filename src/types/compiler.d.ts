export type ASTElement = {
  type: 1
  tag: string
  parent: ASTElement | null
  children: Array<ASTNode>
  text?: string
  attrs?: Array<ASTAttrs>
}

export type ASTNode = ASTElement | ASTText

export type ASTText = {
  type: 3
  text: string
  static: boolean
}

export type ASTAttrs = {
  name: string
  value: any
}
