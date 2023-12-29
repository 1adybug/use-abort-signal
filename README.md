# use-abort-signal

English | <a href="https://github.com/1adybug/use-abort-signal/blob/main/README.zh-CN.md">简体中文</a>

[![NPM version](https://img.shields.io/npm/v/use-abort-signal.svg?style=flat)](https://npmjs.org/package/use-abort-signal)
[![NPM downloads](https://img.shields.io/npm/dm/use-abort-signal)](https://npmjs.org/package/use-abort-signal)

During the development process with `react`, it is often necessary to make network requests within `useEffect`. However, when the dependencies of `useEffect` change or the component is unmounted, the network request might not be completed yet, leading to unexpected effects. `use-abort-signal` is designed to solve this problem by safely canceling `fetch` requests in `useEffect`.

## How to Use

### useAbortSignal

Type:

```typescript
export function useAbortSignal(effect: (signal: AbortSignal) => Promise<void>, deps?: DependencyList): void
export function useAbortSignal(effect: (signal: AbortSignal) => Promise<void>, callback: () => void, deps?: DependencyList): void
```

Usage：

```typescript
import useAbortSignal from "use-abort-signal"
// Or
import { useAbortSignal } from "use-abort-signal"

useAbortSignal(
    async signal => {
        // Do something
        // Pass the signal parameter into your fetch request
        const response = await fetch("xxx", { signal })
        // If the fetch request has not completed when the dependencies change or the component is unmounted, it will automatically cancel, and the code below will not be executed.
        // Things to do after successfully obtaining the response.
    },
    [/** dependencies */]
)
```

If you need to perform certain actions when the dependencies change or the component is unmounted, you can do so by passing the callback function as the second argument:

```typescript
import useAbortSignal from "use-abort-signal"

useAbortSignal(
    async signal => {
        // Do something
        // Pass the signal parameter into your fetch request
        const response = await fetch("xxx", { signal })
        // If the fetch request has not completed when the dependencies change or the component is unmounted, it will automatically cancel, and the code below will not be executed.
        // Things to do after successfully obtaining the response.
    },
    () => {
        // Executed when dependencies change or the component is unmounted.
    },
    [/** dependencies */]
)
```

### useAbortableFetch

Type:

```typescript
export function useAbortableFetch(effect: (fetch: typeof window.fetch) => Promise<void>, deps?: DependencyList): void
export function useAbortableFetch(effect: (fetch: typeof window.fetch) => Promise<void>, callback: () => void, deps?: DependencyList): void
```

The usage is basically the same as `useAbortSignal`, except that the first function's parameter changes from `abortSignal` to `fetch`:

```typescript
import { useAbortableFetch } from "use-abort-signal"

useAbortableFetch(
    async fetch => {
        // No need to add a signal, it will be added automatically.
        const response = await fetch("xxx")
    },
    [/** dependencies */]
)

useAbortableFetch(
    async fetch => {
        const response = await fetch("xxx")
    },
    () => {
        // Executed when dependencies change or the component is unmounted.
    },
    [/** dependencies */]
)
```
