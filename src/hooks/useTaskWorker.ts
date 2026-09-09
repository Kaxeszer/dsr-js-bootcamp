import { useEffect, useRef, useState } from 'react'
import type { Task } from '../types'
import type { SortField, SortDirection } from '../workers/taskSort.worker'

export function useTaskWorker(
    tasks: Task[],
    searchText: string,
    sortField: SortField,
    sortDirection: SortDirection
) {
    const [result, setResult] = useState<Task[]>([])
    const workerRef = useRef<Worker | null>(null)

    useEffect(() => {
        workerRef.current = new Worker(
            new URL('../workers/taskSort.worker.ts', import.meta.url),
            { type: 'module' }
        )

        workerRef.current.onmessage = (event: MessageEvent<Task[]>) => {
            setResult(event.data)
        }

        return () => {
            workerRef.current?.terminate()
        }
    }, [])

    useEffect(() => {
        workerRef.current?.postMessage({ tasks, searchText, sortField, sortDirection })
    }, [tasks, searchText, sortField, sortDirection])

    return result
}