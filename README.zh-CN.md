# use-abort-signal

<a href="https://github.com/1adybug/use-abort-signal/blob/main/README.md">English</a> | 简体中文

[![NPM version](https://img.shields.io/npm/v/use-abort-signal.svg?style=flat)](https://npmjs.org/package/use-abort-signal)
[![NPM downloads](https://img.shields.io/npm/dm/use-abort-signal)](https://npmjs.org/package/use-abort-signal)

在 `react` 的开发过程中，经常会需要在 `useEffect` 中进行网络请求，然而当 `useEffect` 的依赖项改变或者组件卸载时，可能网络请求还未完成，造成意料之外的作用。`use-abort-signal` 便是用于解决这一问题，安全地取消 `useEffect` 中的 `fetch` 请求。

## 使用方法

### useAbortSignal

类型：

```typescript
export function useAbortSignal(effect: (signal: AbortSignal) => Promise<void>, deps?: DependencyList): void
export function useAbortSignal(effect: (signal: AbortSignal) => Promise<void>, callback: () => void, deps?: DependencyList): void
```

用法：

```typescript
import useAbortSignal from "use-abort-signal"
// 或者
import { useAbortSignal } from "use-abort-signal"

useAbortSignal(
    async signal => {
        // 做一些事
        // 将 signal 参数传入你的 fetch 请求
        const response = await fetch("xxx", { signal })
        // 如果依赖项改变或者组件卸载时，fetch 请求还未完成，会自动取消，且下面的代码不会被执行
        // 成功获取 response 后要做的事情
    },
    [/** 依赖项 */]
)
```

如果你需要在依赖项改变或者组件卸载时，执行某些操作，将回调函数作为第二个参数传入即可：

```typescript
import useAbortSignal from "use-abort-signal"

useAbortSignal(
    async signal => {
        // 做一些事
        // 将 signal 参数传入你的 fetch 请求
        const response = await fetch("xxx", { signal })
        // 如果依赖项改变或者组件卸载时，fetch 请求还未完成，会自动取消，且下面的代码不会被执行
        // 成功获取 response 后要做的事情
    },
    () => {
        // 依赖项改变或者组件卸载时，被执行
    },
    [/** 依赖项 */]
)
```

### useAbortableFetch

类型：

```typescript
export function useAbortableFetch(effect: (fetch: typeof window.fetch) => Promise<void>, deps?: DependencyList): void
export function useAbortableFetch(effect: (fetch: typeof window.fetch) => Promise<void>, callback: () => void, deps?: DependencyList): void
```

用法与 `useAbortSignal` 基本一致，只不过第一个函数的参数从 `abortSignal` 变成了 `fetch`：

```typescript
import { useAbortableFetch } from "use-abort-signal"

useAbortableFetch(
    async fetch => {
        // 无需添加 signal，会自动添加
        const response = await fetch("xxx")
    },
    [/** 依赖项 */]
)

useAbortableFetch(
    async fetch => {
        const response = await fetch("xxx")
    },
    () => {
        // 依赖项改变或者组件卸载时，被执行
    },
    [/** 依赖项 */]
)
```
