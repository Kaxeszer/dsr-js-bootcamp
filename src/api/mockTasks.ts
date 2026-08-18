import type { Task } from '../types'

const verbs = ['Buy', 'Call', 'Finish', 'Clean', 'Review', 'Prepare', 'Send', 'Update', 'Fix', 'Schedule']
const subjects = ['groceries', 'the report', 'the kitchen', 'the presentation', 'the invoice', 'the email', 'the bug', 'the meeting', 'the dashboard', 'the proposal']

function randomDeadline(): string {
    const today = new Date()
    const randomDaysAhead = Math.floor(Math.random() * 60) - 10 // entre −10 e +50 dias
    const date = new Date(today)
    date.setDate(today.getDate() + randomDaysAhead)
    return date.toISOString().split('T')[0] // formato YYYY-MM-DD
}

export function generateMockTasks(count: number): Task[] {
    const tasks: Task[] = []

    for (let i = 0; i < count; i++) {
        const verb = verbs[i % verbs.length]
        const subject = subjects[Math.floor(i / verbs.length) % subjects.length]

        tasks.push({
            id: crypto.randomUUID(),
            title: `${verb} ${subject}`,
            deadline: randomDeadline(),
            completed: false,
        })
    }

    return tasks
}