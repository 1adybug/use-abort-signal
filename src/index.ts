import { type DependencyList, useEffect } from "react"

export function useAbortSignal(effect: (signal: AbortSignal) => Promise<void>, callback: () => void, deps?: DependencyList): void
export function useAbortSignal(effect: (signal: AbortSignal) => Promise<void>, deps?: DependencyList): void
export function useAbortSignal(effect: (signal: AbortSignal) => Promise<void>, callbackOrDeps?: (() => void) | DependencyList, deps?: DependencyList) {
    if (callbackOrDeps === undefined) {
        useEffect(() => {
            const controller = new AbortController()
            effect(controller.signal).catch(error => {
                if (!(error instanceof DOMException) || error.name !== "AbortError") {
                    throw error
                }
            })
            return () => {
                controller.abort()
            }
        })
        return
    }
    if (typeof callbackOrDeps === "function") {
        useEffect(() => {
            const controller = new AbortController()
            effect(controller.signal).catch(error => {
                if (!(error instanceof DOMException) || error.name !== "AbortError") {
                    throw error
                }
            })
            return () => {
                controller.abort()
                callbackOrDeps()
            }
        }, deps)
        return
    }
    useEffect(() => {
        const controller = new AbortController()
        effect(controller.signal).catch(error => {
            if (!(error instanceof DOMException) || error.name !== "AbortError") {
                throw error
            }
        })
        return () => {
            controller.abort()
        }
    }, callbackOrDeps)
}

const originalFetch = fetch

export function useAbortableFetch(effect: (fetch: typeof originalFetch) => Promise<void>, callback: () => void, deps?: DependencyList): void
export function useAbortableFetch(effect: (fetch: typeof originalFetch) => Promise<void>, deps?: DependencyList): void
export function useAbortableFetch(effect: (fetch: typeof originalFetch) => Promise<void>, callbackOrDeps?: (() => void) | DependencyList, deps?: DependencyList) {
    if (callbackOrDeps === undefined) {
        useEffect(() => {
            const controller = new AbortController()
            const fetch: typeof originalFetch = (input, init) => {
                init ??= {}
                init.signal = controller.signal
                return originalFetch(input, init)
            }
            effect(fetch).catch(error => {
                if (!(error instanceof DOMException) || error.name !== "AbortError") {
                    throw error
                }
            })
            return () => {
                controller.abort()
            }
        })
        return
    }
    if (typeof callbackOrDeps === "function") {
        useEffect(() => {
            const controller = new AbortController()
            const fetch: typeof originalFetch = (input, init) => {
                init ??= {}
                init.signal = controller.signal
                return originalFetch(input, init)
            }
            effect(fetch).catch(error => {
                if (!(error instanceof DOMException) || error.name !== "AbortError") {
                    throw error
                }
            })
            return () => {
                controller.abort()
                callbackOrDeps()
            }
        }, deps)
        return
    }
    useEffect(() => {
        const controller = new AbortController()
        const fetch: typeof originalFetch = (input, init) => {
            init ??= {}
            init.signal = controller.signal
            return originalFetch(input, init)
        }
        effect(fetch).catch(error => {
            if (!(error instanceof DOMException) || error.name !== "AbortError") {
                throw error
            }
        })
        return () => {
            controller.abort()
        }
    }, callbackOrDeps)
}
