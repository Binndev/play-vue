// @ts-nocheck
import { isDef, isString } from 'utils'
import VNode from './vnode'

// 既有更新，又有挂载 oldVNode为VNode则为更新

export function patch(oldVNode: Element | VNode, vnode: VNode) {
  const isRealElement = isDef(oldVNode?.nodeType)
  if (isRealElement) {
    const elm = oldVNode
    const parentElm = elm.parentNode
    let newElm = createElm(vnode)
    console.log(newElm)
    parentElm.insertBefore(newElm, elm.nextSibling)
    parentElm.removeChild(elm)

    return newElm
  }
}

function createElm(vnode: VNode) {
  const { tag, text, children, data } = vnode
  if (isString(tag)) {
    vnode.el = document.createElement(tag) // 将真实节点和虚拟节点对应起来， 以便后续diff
    patchProps(vnode.el, data)
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

function patchProps(el, props) {
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
