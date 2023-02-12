import { ComponentOptions } from './options'

export declare class Component {
  constructor(options?: any)

  // public property
  $options: ComponentOptions

  // public method
  // $mount: (el?: Element | void) => Component & { [key: string]: any }
  $mount: (el?: Element | string) => void

  // life circle
  _init: Function

  // private property
  _data: Record<string, any>
}
