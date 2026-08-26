import { writeFileSync } from 'fs'
import { generateMockTasks } from '../src/api/mockTasks.ts'

const tasks = generateMockTasks(100)

writeFileSync('db.json', JSON.stringify({ tasks }, null, 2))
console.log(`Generated ${tasks.length} tasks into db.json`)