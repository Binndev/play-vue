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
    return patchVNode(oldVNode, vnode)
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
      oldVNode.el.textContent = newVNode.text
      return el
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
    updataChildren(el, oldChildren, newChildren)
  } else if (newChildren.length > 0 && !oldChildren.length) {
    mountChildren(el, null, newChildren)
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
  oldProps = oldProps || {}
  props = props || {}
  const oldStyles = oldProps.style || {}
  const newStyles = props.style || {}
  for (const key in oldStyles) {
    if (!newStyles[key]) {
      el.style[key] = ''
    }
  }
  // 旧节点中存在属性，新节点不存在
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

function mountChildren(el, insert, newChildren) {
  for (let i = 0, l = newChildren.length; i < l; i++) {
    const child = newChildren[i]
    if (child.el) {
      el.insertBefore(insert, child.el)
    } else {
      el.insertBefore(insert, createElm(child))
    }
  }
}

function unmountChildren(el, oldChildren) {
  for (let i = 0, l = oldChildren.length; i < l; i++) {
    const child = oldChildren[i]
    el.removeChild(child.el)
  }
}

function updataChildren(el, oldChildren, newChildren) {
  // 双指针
  let oldStartIndex = 0
  let oldEndIndex = oldChildren.length - 1
  let newStartIndex = 0
  let newEndIndex = newChildren.length - 1

  let oldStartVNode = oldChildren[oldStartIndex]
  let oldEndVNode = oldChildren[oldEndIndex]
  let newStartVNode = newChildren[newStartIndex]
  let newEndVNode = newChildren[newEndIndex]

  const map = {}

  for (let i = 0, l = oldChildren.length; i < l; i++) {
    const child = oldChildren[i]
    map[child.key] = i
  }

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVNode) {
      oldStartVNode = oldChildren[++oldStartIndex]
    } else if (!oldEndVNode) {
      oldEndVNode = oldChildren[--oldEndVNode]
    }
    // 头节点从左往右
    else if (isSameVnode(oldStartVNode, newStartVNode)) {
      patchVNode(oldStartVNode, newStartVNode)
      oldStartVNode = oldChildren[++oldStartIndex]
      newStartVNode = newChildren[++newStartIndex]
    }
    // 尾节点从右向左
    else if (isSameVnode(oldEndVNode, newEndVNode)) {
      patchVNode(oldEndVNode, newEndVNode)
      oldEndVNode = oldChildren[--oldEndIndex]
      newEndVNode = newChildren[--newEndIndex]
    }
    // 首尾节点对比
    // 旧end节点与新start节点对比
    else if (isSameVnode(oldEndVNode, newStartVNode)) {
      patchVNode(oldEndVNode, newStartVNode)
      mountChildren(el, oldStartVNode.el, [oldEndVNode])
      oldEndVNode = oldChildren[--oldEndIndex]
      newStartVNode = newChildren[++newStartIndex]
    }
    // 旧start节点和新end节点对比
    else if (isSameVnode(oldStartVNode, newEndVNode)) {
      patchVNode(oldStartVNode, newEndVNode)
      mountChildren(el, oldEndVNode.el.nextSibling, [oldStartVNode])
      oldStartVNode = oldChildren[++oldStartIndex]
      newEndVNode = newChildren[--newEndIndex]
    } else {
      // 乱序对比（根据旧的列表做一个映射关系，用新的节点查找，找到则移动，找不到则添加，最后删除多余的）
      let moveIndex = map[newStartVNode.key]
      if (moveIndex != null) {
        const moveNode = oldChildren[moveIndex]
        mountChildren(el, oldStartVNode.el, [moveNode])
        oldChildren[moveIndex] = undefined //节点已经移动
        patchVNode(moveNode, newStartVNode)
      } else {
        mountChildren(el, oldStartVNode.el, [newStartVNode])
      }
      newStartVNode = newChildren[++newStartIndex]
    }
  }
  if (newStartIndex <= newEndIndex) {
    const anchor = newChildren[newStartIndex + 1]
      ? newChildren[newStartIndex + 1].el
      : null
    mountChildren(el, anchor, newChildren.slice(newStartIndex))
  }
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i < oldEndIndex; i++) {
      const child = oldChildren[i]
      if (child) {
        el.removeChild(child.el)
      }
    }
  }
}
