import { supabase } from '../config/supabase'

const STORAGE_KEY = 'lasttimesince_tasks'

// Default tasks for new users
const defaultTasks = [
  { id: '1', label: 'i texted her', date: '2025-12-08T23:47:00', color: '#dc2626', iconIndex: 0 },
  { id: '2', label: 'i saw her', date: '2025-12-22T17:47:00', color: '#f43f5e', iconIndex: 1 },
  { id: '3', label: 'i smoked joint', date: '2025-12-06T22:38:00', color: '#10b981', iconIndex: 2 },
  { id: '4', label: 'i smoked cigarette', date: '2025-12-22T18:38:00', color: '#6b7280', iconIndex: 3 },
  { id: '5', label: 'i drank alcohol', date: '2025-12-06T23:48:00', color: '#9333ea', iconIndex: 4 },
]

// Helper: Convert Supabase task to app format
const fromSupabaseTask = (task) => ({
  id: task.id,
  label: task.label,
  date: task.last_done,
  color: task.color || '#6366f1',
  iconIndex: task.icon_index || 0,
})

// Helper: Convert app task to Supabase format
const toSupabaseTask = (task, userId) => ({
  user_id: userId,
  label: task.label,
  last_done: task.date,
  color: task.color,
  icon_index: task.iconIndex ?? 0,
})

// LocalStorage helpers
const loadFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultTasks
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
  }
  return defaultTasks
}

const saveToLocalStorage = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const dataService = {
  // Check if user is authenticated
  async isAuthenticated() {
    if (!supabase) return false
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) return false
      return !!user
    } catch (error) {
      console.error('Error checking auth:', error)
      return false
    }
  },

  // Get current user
  async getCurrentUser() {
    if (!supabase) return null
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) return null
      return user
    } catch (error) {
      console.error('Error getting user:', error)
      return null
    }
  },

  // Get all tasks (from Supabase or localStorage)
  async getTasks() {
    const isAuth = await this.isAuthenticated()
    
    if (isAuth && supabase) {
      try {
        const user = await this.getCurrentUser()
        if (!user) throw new Error('No user found')

        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        // Convert Supabase format to app format
        const tasks = (data || []).map(fromSupabaseTask)
        return tasks.length > 0 ? tasks : defaultTasks
      } catch (error) {
        console.error('Error loading from Supabase, falling back to localStorage:', error)
        // Fallback to localStorage if Supabase fails
        return loadFromLocalStorage()
      }
    }

    // Guest mode: use localStorage
    return loadFromLocalStorage()
  },

  // Add new task
  async addTask(task) {
    const isAuth = await this.isAuthenticated()

    if (isAuth && supabase) {
      try {
        const user = await this.getCurrentUser()
        if (!user) throw new Error('No user found')

        const supabaseTask = toSupabaseTask(task, user.id)
        const { data, error } = await supabase
          .from('tasks')
          .insert([supabaseTask])
          .select()
          .single()

        if (error) throw error

        return fromSupabaseTask(data)
      } catch (error) {
        console.error('Error adding to Supabase, falling back to localStorage:', error)
        // Fallback to localStorage
        const tasks = loadFromLocalStorage()
        const newTask = {
          ...task,
          id: String(Date.now()) + Math.random().toString(36).slice(2),
        }
        const updatedTasks = [...tasks, newTask]
        saveToLocalStorage(updatedTasks)
        return newTask
      }
    }

    // Guest mode: use localStorage
    const tasks = loadFromLocalStorage()
    const newTask = {
      ...task,
      id: String(Date.now()) + Math.random().toString(36).slice(2),
    }
    const updatedTasks = [...tasks, newTask]
    saveToLocalStorage(updatedTasks)
    return newTask
  },

  // Update existing task
  async updateTask(id, updates) {
    const isAuth = await this.isAuthenticated()

    if (isAuth && supabase) {
      try {
        const user = await this.getCurrentUser()
        if (!user) throw new Error('No user found')

        const supabaseUpdates = {
          label: updates.label,
          last_done: updates.date,
          color: updates.color,
          icon_index: updates.iconIndex ?? 0,
          updated_at: new Date().toISOString(),
        }

        const { data, error } = await supabase
          .from('tasks')
          .update(supabaseUpdates)
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) throw error

        return fromSupabaseTask(data)
      } catch (error) {
        console.error('Error updating in Supabase, falling back to localStorage:', error)
        // Fallback to localStorage
        const tasks = loadFromLocalStorage()
        const updatedTasks = tasks.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        )
        saveToLocalStorage(updatedTasks)
        return updatedTasks.find((t) => t.id === id)
      }
    }

    // Guest mode: use localStorage
    const tasks = loadFromLocalStorage()
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    )
    saveToLocalStorage(updatedTasks)
    return updatedTasks.find((t) => t.id === id)
  },

  // Delete task
  async deleteTask(id) {
    const isAuth = await this.isAuthenticated()

    if (isAuth && supabase) {
      try {
        const user = await this.getCurrentUser()
        if (!user) throw new Error('No user found')

        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)

        if (error) throw error
        return true
      } catch (error) {
        console.error('Error deleting from Supabase, falling back to localStorage:', error)
        // Fallback to localStorage
        const tasks = loadFromLocalStorage()
        const updatedTasks = tasks.filter((t) => t.id !== id)
        saveToLocalStorage(updatedTasks)
        return true
      }
    }

    // Guest mode: use localStorage
    const tasks = loadFromLocalStorage()
    const updatedTasks = tasks.filter((t) => t.id !== id)
    saveToLocalStorage(updatedTasks)
    return true
  },

  // Save all tasks (for batch operations)
  async saveAllTasks(tasks) {
    const isAuth = await this.isAuthenticated()

    if (isAuth && supabase) {
      try {
        const user = await this.getCurrentUser()
        if (!user) throw new Error('No user found')

        // Delete all existing tasks for this user
        await supabase.from('tasks').delete().eq('user_id', user.id)

        // Insert all tasks
        if (tasks.length > 0) {
          const supabaseTasks = tasks.map((task) => toSupabaseTask(task, user.id))
          const { error } = await supabase.from('tasks').insert(supabaseTasks)

          if (error) throw error
        }

        return true
      } catch (error) {
        console.error('Error saving all to Supabase, falling back to localStorage:', error)
        saveToLocalStorage(tasks)
        return true
      }
    }

    // Guest mode: use localStorage
    saveToLocalStorage(tasks)
    return true
  },

  // Migrate localStorage tasks to Supabase (on signup)
  async migrateLocalToCloud(userId) {
    if (!supabase) {
      console.warn('Supabase not configured, cannot migrate')
      return { success: false, error: 'Supabase not configured' }
    }

    try {
      const localTasks = loadFromLocalStorage()

      // Filter out default tasks (don't migrate those)
      const userTasks = localTasks.filter(
        (task) => !defaultTasks.some((dt) => dt.id === task.id)
      )

      if (userTasks.length === 0) {
        return { success: true, migrated: 0 }
      }

      // Convert and insert tasks
      const supabaseTasks = userTasks.map((task) => toSupabaseTask(task, userId))
      const { data, error } = await supabase.from('tasks').insert(supabaseTasks).select()

      if (error) throw error

      // Clear localStorage after successful migration
      localStorage.removeItem(STORAGE_KEY)

      return { success: true, migrated: userTasks.length }
    } catch (error) {
      console.error('Error migrating tasks:', error)
      return { success: false, error: error.message }
    }
  },
}
