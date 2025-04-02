export const callbackSymbol = Symbol('callback') as InjectionKey<(eventName: string, ...args: any[]) => void>
