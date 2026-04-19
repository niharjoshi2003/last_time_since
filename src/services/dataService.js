const STORAGE_KEY = 'lasttimesince_tasks'
export const DEFAULT_PERSON = 'General'

const normalizePerson = (person) => {
  if (typeof person !== 'string') return DEFAULT_PERSON
  const normalized = person.trim().replace(/\s+/g, ' ')
  return normalized || DEFAULT_PERSON
}

const defaultTasks = [
  { id: '1', person: 'Her', label: 'i texted her', date: '2025-12-08T23:47:00', color: '#dc2626', iconIndex: 0, resetCount: 0 },
  { id: '2', person: 'Her', label: 'i saw her', date: '2025-12-22T17:47:00', color: '#f43f5e', iconIndex: 1, resetCount: 0 },
  { id: '3', person: 'Personal', label: 'i smoked joint', date: '2025-12-06T22:38:00', color: '#10b981', iconIndex: 2, resetCount: 0 },
  { id: '4', person: 'Personal', label: 'i smoked cigarette', date: '2025-12-22T18:38:00', color: '#6b7280', iconIndex: 3, resetCount: 0 },
  { id: '5', person: 'Personal', label: 'i drank alcohol', date: '2025-12-06T23:48:00', color: '#9333ea', iconIndex: 4, resetCount: 0 },
]

export const normalizeTask = (task) => ({
  ...task,
  resetCount: typeof task.resetCount === 'number' && !Number.isNaN(task.resetCount) ? task.resetCount : 0,
  iconIndex: task.iconIndex ?? 0,
  person: normalizePerson(task.person),
})

const loadFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeTask)
      }
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
  }
  return defaultTasks.map(normalizeTask)
}

const saveToLocalStorage = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const dataService = {
  getTasks() {
    return loadFromLocalStorage()
  },

  addTask(task) {
    const tasks = loadFromLocalStorage()
    const newTask = normalizeTask({
      ...task,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      resetCount: 0,
      date: task.date || new Date().toISOString(),
    })
    tasks.push(newTask)
    saveToLocalStorage(tasks)
    return newTask
  },

  updateTask(id, updates) {
    const tasks = loadFromLocalStorage()
    const updatedTasks = tasks.map((t) => (t.id === id ? normalizeTask({ ...t, ...updates }) : t))
    saveToLocalStorage(updatedTasks)
    return updatedTasks.find((t) => t.id === id)
  },

  deleteTask(id) {
    const tasks = loadFromLocalStorage().filter((t) => t.id !== id)
    saveToLocalStorage(tasks)
    return true
  },

  resetTask(id) {
    const tasks = loadFromLocalStorage()
    const task = tasks.find((t) => t.id === id)
    if (!task) return null
    const resetCount = (task.resetCount || 0) + 1
    return this.updateTask(id, {
      date: new Date().toISOString(),
      resetCount,
    })
  },
}
