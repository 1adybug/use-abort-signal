import { type DependencyList, useEffect } from "react"

export function isAbortError(error: unknown): error is DOMException {
    return error instanceof DOMException && error.name === "AbortError"
}

export function useAbortSignal(effect: (signal: AbortSignal) => Promise<void>, deps?: DependencyList): void
export function useAbortSignal(effect: (signal: AbortSignal) => Promise<void>, callback: () => void, deps?: DependencyList): void
export function useAbortSignal(effect: (signal: AbortSignal) => Promise<void>, callbackOrDeps?: (() => void) | DependencyList, deps?: DependencyList) {
    if (callbackOrDeps === undefined) {
        useEffect(() => {
            const controller = new AbortController()
            effect(controller.signal).catch(error => {
                if (!isAbortError(error)) {
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
                if (!isAbortError(error)) {
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
            if (!isAbortError(error)) {
                throw error
            }
        })
        return () => {
            controller.abort()
        }
    }, callbackOrDeps)
}

export function useAbortableFetch(effect: (fetch: typeof window.fetch) => Promise<void>, deps?: DependencyList): void
export function useAbortableFetch(effect: (fetch: typeof window.fetch) => Promise<void>, callback: () => void, deps?: DependencyList): void
export function useAbortableFetch(effect: (fetch: typeof window.fetch) => Promise<void>, callbackOrDeps?: (() => void) | DependencyList, deps?: DependencyList) {
    if (callbackOrDeps === undefined) {
        useAbortSignal(async signal => {
            const fetch: typeof window.fetch = (input, init) => {
                init ??= {}
                init.signal = signal
                return window.fetch(input, init)
            }
            effect(fetch)
        })
        return
    }
    if (typeof callbackOrDeps === "function") {
        useAbortSignal(
            async signal => {
                const fetch: typeof window.fetch = (input, init) => {
                    init ??= {}
                    init.signal = signal
                    return window.fetch(input, init)
                }
                effect(fetch)
            },
            callbackOrDeps,
            deps
        )
        return
    }
    useAbortSignal(async signal => {
        const fetch: typeof window.fetch = (input, init) => {
            init ??= {}
            init.signal = signal
            return window.fetch(input, init)
        }
        effect(fetch)
    }, callbackOrDeps)
}

export default useAbortSignal
