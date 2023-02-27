// @ts-nocheck
import { isDef, isString } from 'utils'
import VNode, { isSameVnode } from './vnode'

// 既有更新，又有挂载 oldVNode为VNode则为更新

export function patch(oldVNode: Element | VNode, vnode: VNode) {
  const isRealElement = isDef(oldVNode?.nodeType)
  if (isRealElement) {
    const elm = oldVNode
    const parentElm = elm.parentNode
    let newElm = createElm(vnode)
    parentElm.insertBefore(newElm, elm.nextSibling)
    parentElm.removeChild(elm)

    return newElm
  } else {
    patchVNode(oldVNode, vnode)
  }
}

function patchVNode(oldVNode: VNode, newVNode: VNode) {
  // 1. 两个节点不是同一个节点，直接删除旧节点
  if (!isSameVnode(newVNode, oldVNode)) {
    let el = createElm(newVNode)
    oldVNode.el.parentNode.replace(el, oldVNode.el)
    return el
  }
  // 2.两个节点是同一个节点（判断节点的tag和key）
  //    比较两个节点的属性，复用老的节点，将差异的属性更新到老节点
  //    比较节点的文本是否一致
  const el = (newVNode.el = oldVNode.el) //复用老节点
  // 文本情况
  if (!oldVNode.tag) {
    if (oldVNode.text !== newVNode.text) {
      oldVNode.children.textContent = newVNode.text
    }
  }
  // 标签情况 对比标签属性
  patchProps(el, oldVNode.data, newVNode.props)
  // 3.比较子孙节点
  //  新节点有子孙节点，老节点没有子孙节点
  //  新节点没有子孙节点，老节点有子孙节点
  //  双方都有子孙节点
  const oldChildren = oldVNode.children || []
  const newChildren = newVNode.children || []
  if (oldChildren.length > 0 && newChildren.length > 0) {
    // 具体的diff
    // updataChildren(el, oldChildren, oldChildren)
  } else if (newChildren.length > 0 && !oldChildren.length) {
    mountChildren(el, newChildren)
  } else if (!newChildren && oldChildren.length) {
    unmountChildren(el, oldChildren)
  }
  return el
}

function createElm(vnode: VNode) {
  const { tag, text, children, data } = vnode
  if (isString(tag)) {
    vnode.el = document.createElement(tag) // 将真实节点和虚拟节点对应起来， 以便后续diff
    patchProps(vnode.el, {}, data)
    if (children?.length) {
      children.forEach(child => {
        vnode.el.append(createElm(child))
      })
    }
  } else {
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}

function patchProps(el, oldProps, props) {
  // 旧节点中存在属性，新节点不存在
  const oldStyles = oldProps.style || {}
  const newStyles = props.style || {}
  for (const key in oldStyles) {
    if (!newStyles[key]) {
      el.style[key] = ''
    }
  }
  for (const key in oldProps) {
    if (!props[key]) {
      el.removeAttribute(key)
    }
  }
  for (const key in props) {
    if (key === 'style') {
      for (let styleName in props.style) {
        el.style[styleName] = props.style[styleName]
      }
    } else {
      el.setAttribute(key, props[key])
    }
  }
}

function mountChildren(el, newChildren) {
  for (let i = 0, l = newChildren.length; i < l; i++) {
    const child = newChildren[i]
    el.appendChild(createElm(child))
  }
}

function unmountChildren(el, oldChildren) {
  for (let i = 0, l = oldChildren.length; i < l; i++) {
    const child = oldChildren[i]
    el.removeChild(child.el)
  }
}
