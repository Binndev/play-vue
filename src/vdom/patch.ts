// @ts-nocheck
import { isDef, isString } from 'utils'
import VNode from './vnode'

// 既有更新，又有挂载 oldVNode为VNode则为更新

export function patch(oldVNode: Element | VNode, vnode: VNode) {
  const isRealElement = isDef(oldVNode?.nodeType)
  if (isRealElement) {
    const parentElm = oldVNode.parentNode
    createElm(vnode)
  }
}

function createElm(vnode: VNode) {
  const { tag } = vnode
  if (isString(tag)) {
    vnode.el = document.createElement(tag) // 将真实节点和虚拟节点对应起来， 以便后续diff
  }
}
