import { supabase } from '../config/supabase'

const STORAGE_KEY = 'lasttimesince_tasks'
const FOLDERS_STORAGE_KEY = 'lasttimesince_folders'

// Default tasks for new users (resetCount/resetHistory for frequency tracking)
const defaultTasks = [
  { id: '1', label: 'i texted her', date: '2025-12-08T23:47:00', color: '#dc2626', iconIndex: 0, folderId: null, resetCount: 0, resetHistory: [] },
  { id: '2', label: 'i saw her', date: '2025-12-22T17:47:00', color: '#f43f5e', iconIndex: 1, folderId: null, resetCount: 0, resetHistory: [] },
  { id: '3', label: 'i smoked joint', date: '2025-12-06T22:38:00', color: '#10b981', iconIndex: 2, folderId: null, resetCount: 0, resetHistory: [] },
  { id: '4', label: 'i smoked cigarette', date: '2025-12-22T18:38:00', color: '#6b7280', iconIndex: 3, folderId: null, resetCount: 0, resetHistory: [] },
  { id: '5', label: 'i drank alcohol', date: '2025-12-06T23:48:00', color: '#9333ea', iconIndex: 4, folderId: null, resetCount: 0, resetHistory: [] },
]

// Max number of reset timestamps to keep in history (for "last N resets" display)
const MAX_RESET_HISTORY = 20

// Default folder for "All"
const defaultFolder = {
  id: 'all',
  name: 'All',
  color: '#6366f1',
  icon: '',
  description: 'All tracked activities',
  isDefault: true,
}

// Helper: Convert Supabase task to app format
// Note: If using Supabase, add columns: reset_count (int default 0), reset_history (jsonb default '[]')
const fromSupabaseTask = (task) => ({
  id: task.id,
  label: task.label,
  date: task.last_done,
  color: task.color || '#6366f1',
  iconIndex: task.icon_index || 0,
  folderId: task.folder_id,
  resetCount: task.reset_count ?? 0,
  resetHistory: Array.isArray(task.reset_history) ? task.reset_history : [],
})

// Helper: Convert app task to Supabase format
const toSupabaseTask = (task, userId) => ({
  user_id: userId,
  folder_id: task.folderId || null,
  label: task.label,
  last_done: task.date,
  color: task.color,
  icon_index: task.iconIndex ?? 0,
  reset_count: task.resetCount ?? 0,
  reset_history: task.resetHistory ?? [],
})

// Helper: Convert Supabase folder to app format
const fromSupabaseFolder = (folder) => ({
  id: folder.id,
  name: folder.name,
  color: folder.color,
  icon: folder.icon,
  description: folder.description,
  isDefault: folder.is_default,
})

// Helper: Convert app folder to Supabase format
const toSupabaseFolder = (folder, userId) => ({
  user_id: userId,
  name: folder.name,
  color: folder.color,
  icon: folder.icon,
  description: folder.description,
  is_default: folder.isDefault || false,
})

// Normalize task from storage (backward compat: add resetCount/resetHistory if missing)
const normalizeTask = (task) => ({
  ...task,
  resetCount: task.resetCount ?? 0,
  resetHistory: Array.isArray(task.resetHistory) ? task.resetHistory : [],
})

// LocalStorage helpers
const loadFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const tasks = Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultTasks
      return tasks.map(normalizeTask)
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

const loadFoldersFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(FOLDERS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : [defaultFolder]
    }
  } catch (error) {
    console.error('Error loading folders from localStorage:', error)
  }
  return [defaultFolder]
}

const saveFoldersToLocalStorage = (folders) => {
  try {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders))
  } catch (error) {
    console.error('Error saving folders to localStorage:', error)
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

  // FOLDER OPERATIONS

  // Get all folders for user
  async getFolders() {
    const isAuth = await this.isAuthenticated()
    
    if (isAuth && supabase) {
      try {
        const user = await this.getCurrentUser()
        if (!user) throw new Error('No user found')

        const { data, error } = await supabase
          .from('folders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })

        if (error) throw error

        const folders = (data || []).map(fromSupabaseFolder)
        return [defaultFolder, ...folders]
      } catch (error) {
        console.error('Error loading folders from Supabase, falling back to localStorage:', error)
        return [defaultFolder, ...loadFoldersFromLocalStorage().filter(f => f.id !== 'all')]
      }
    }

    // Guest mode: use localStorage
    return [defaultFolder, ...loadFoldersFromLocalStorage().filter(f => f.id !== 'all')]
  },

  // Add new folder
  async addFolder(folder) {
    const isAuth = await this.isAuthenticated()

    if (isAuth && supabase) {
      try {
        const user = await this.getCurrentUser()
        if (!user) throw new Error('No user found')

        const supabaseFolder = toSupabaseFolder(folder, user.id)
        const { data, error } = await supabase
          .from('folders')
          .insert([supabaseFolder])
          .select()
          .single()

        if (error) throw error

        return fromSupabaseFolder(data)
      } catch (error) {
        console.error('Error adding folder to Supabase, falling back to localStorage:', error)
        const folders = loadFoldersFromLocalStorage()
        const newFolder = {
          ...folder,
          id: String(Date.now()) + Math.random().toString(36).slice(2),
        }
        const updatedFolders = [...folders, newFolder]
        saveFoldersToLocalStorage(updatedFolders)
        return newFolder
      }
    }

    // Guest mode: use localStorage
    const folders = loadFoldersFromLocalStorage()
    const newFolder = {
      ...folder,
      id: String(Date.now()) + Math.random().toString(36).slice(2),
    }
    const updatedFolders = [...folders, newFolder]
    saveFoldersToLocalStorage(updatedFolders)
    return newFolder
  },

  // Update folder
  async updateFolder(id, updates) {
    const isAuth = await this.isAuthenticated()

    if (isAuth && supabase) {
      try {
        const user = await this.getCurrentUser()
        if (!user) throw new Error('No user found')

        const supabaseUpdates = {
          name: updates.name,
          color: updates.color,
          icon: updates.icon,
          description: updates.description,
          updated_at: new Date().toISOString(),
        }

        const { data, error } = await supabase
          .from('folders')
          .update(supabaseUpdates)
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) throw error

        return fromSupabaseFolder(data)
      } catch (error) {
        console.error('Error updating folder in Supabase, falling back to localStorage:', error)
        const folders = loadFoldersFromLocalStorage()
        const updatedFolders = folders.map((f) =>
          f.id === id ? { ...f, ...updates } : f
        )
        saveFoldersToLocalStorage(updatedFolders)
        return updatedFolders.find((f) => f.id === id)
      }
    }

    // Guest mode: use localStorage
    const folders = loadFoldersFromLocalStorage()
    const updatedFolders = folders.map((f) =>
      f.id === id ? { ...f, ...updates } : f
    )
    saveFoldersToLocalStorage(updatedFolders)
    return updatedFolders.find((f) => f.id === id)
  },

  // Delete folder
  async deleteFolder(id) {
    const isAuth = await this.isAuthenticated()

    if (isAuth && supabase) {
      try {
        const user = await this.getCurrentUser()
        if (!user) throw new Error('No user found')

        // Move tasks to default folder (null)
        await supabase
          .from('tasks')
          .update({ folder_id: null })
          .eq('folder_id', id)
          .eq('user_id', user.id)

        // Delete folder
        const { error } = await supabase
          .from('folders')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)

        if (error) throw error
        return true
      } catch (error) {
        console.error('Error deleting folder from Supabase, falling back to localStorage:', error)
        const folders = loadFoldersFromLocalStorage()
        const updatedFolders = folders.filter((f) => f.id !== id)
        saveFoldersToLocalStorage(updatedFolders)
        return true
      }
    }

    // Guest mode: use localStorage
    const folders = loadFoldersFromLocalStorage()
    const updatedFolders = folders.filter((f) => f.id !== id)
    saveFoldersToLocalStorage(updatedFolders)
    return true
  },

  // TASK OPERATIONS
  async getTasks(folderId = null) {
    const isAuth = await this.isAuthenticated()
    
    if (isAuth && supabase) {
      try {
        const user = await this.getCurrentUser()
        if (!user) throw new Error('No user found')

        let query = supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)

        // Filter by folder if specified and not "all"
        if (folderId && folderId !== 'all') {
          query = query.eq('folder_id', folderId)
        }

        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) throw error

        // Convert Supabase format to app format (normalize for backward compat)
        const tasks = (data || []).map((t) => normalizeTask(fromSupabaseTask(t)))
        return tasks.length > 0 ? tasks : defaultTasks
      } catch (error) {
        console.error('Error loading from Supabase, falling back to localStorage:', error)
        // Fallback to localStorage if Supabase fails
        let tasks = loadFromLocalStorage()
        if (folderId && folderId !== 'all') {
          tasks = tasks.filter((t) => t.folderId === folderId)
        }
        return tasks
      }
    }

    // Guest mode: use localStorage
    let tasks = loadFromLocalStorage()
    if (folderId && folderId !== 'all') {
      tasks = tasks.filter((t) => t.folderId === folderId)
    }
    return tasks
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
          label: updates.label !== undefined ? updates.label : undefined,
          last_done: updates.date !== undefined ? updates.date : undefined,
          color: updates.color !== undefined ? updates.color : undefined,
          icon_index: updates.iconIndex !== undefined ? updates.iconIndex : undefined,
          folder_id: updates.folderId !== undefined ? (updates.folderId || null) : undefined,
          reset_count: updates.resetCount !== undefined ? updates.resetCount : undefined,
          reset_history: updates.resetHistory !== undefined ? updates.resetHistory : undefined,
          updated_at: new Date().toISOString(),
        }
        // Remove undefined keys so we don't overwrite with null
        Object.keys(supabaseUpdates).forEach((k) => supabaseUpdates[k] === undefined && delete supabaseUpdates[k])

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
      t.id === id ? normalizeTask({ ...t, ...updates }) : t
    )
    saveToLocalStorage(updatedTasks)
    return updatedTasks.find((t) => t.id === id)
  },

  /**
   * Reset a task's timestamp to now and increment reset count.
   * Persists to Supabase or localStorage. Returns the updated task.
   */
  async resetTask(id) {
    const isAuth = await this.isAuthenticated()
    const now = new Date().toISOString()

    if (isAuth && supabase) {
      try {
        const user = await this.getCurrentUser()
        if (!user) throw new Error('No user found')

        // Fetch current task (select * so missing columns don't break)
        const { data: existing } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single()

        const resetCount = ((existing?.reset_count ?? 0) + 1)
        const resetHistory = Array.isArray(existing?.reset_history) ? existing.reset_history : []
        resetHistory.unshift(now)
        const trimmed = resetHistory.slice(0, MAX_RESET_HISTORY)

        const supabaseUpdates = {
          last_done: now,
          reset_count: resetCount,
          reset_history: trimmed,
          updated_at: now,
        }

        const { data, error } = await supabase
          .from('tasks')
          .update(supabaseUpdates)
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) {
          // If table lacks reset_count/reset_history, try updating only last_done
          if (error.code === '42703' || error.message?.includes('reset_count') || error.message?.includes('reset_history')) {
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('tasks')
              .update({ last_done: now, updated_at: now })
              .eq('id', id)
              .eq('user_id', user.id)
              .select()
              .single()
            if (fallbackError) throw fallbackError
            return normalizeTask(fromSupabaseTask(fallbackData))
          }
          throw error
        }
        return fromSupabaseTask(data)
      } catch (error) {
        console.error('Error resetting task in Supabase:', error)
        throw error
      }
    }

    return this.resetTaskLocal(id, now)
  },

  // Shared reset logic for localStorage (and Supabase fallback)
  async resetTaskLocal(id, now) {
    const tasks = loadFromLocalStorage()
    const task = tasks.find((t) => t.id === id)
    if (!task) return null
    const resetCount = (task.resetCount ?? 0) + 1
    const resetHistory = [...(task.resetHistory || [])]
    resetHistory.unshift(now)
    const trimmed = resetHistory.slice(0, MAX_RESET_HISTORY)
    const updated = normalizeTask({ ...task, date: now, resetCount, resetHistory })
    const updatedTasks = tasks.map((t) => (t.id === id ? updated : t))
    saveToLocalStorage(updatedTasks)
    return updated
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
      // migrate folders first
      const localFolders = loadFoldersFromLocalStorage()
      const userFolders = localFolders.filter((f) => f.id !== 'all' && !f.isDefault)

      if (userFolders.length > 0) {
        // insert with same ids so tasks can reference them
        const supabaseFolders = userFolders.map((f) => ({
          id: f.id,
          user_id: userId,
          name: f.name,
          color: f.color,
          icon: f.icon,
          description: f.description,
          is_default: f.isDefault || false,
        }))
        const { error: folderError } = await supabase.from('folders').insert(supabaseFolders)
        if (folderError) throw folderError
      }

      const localTasks = loadFromLocalStorage()

      // Filter out default tasks (don't migrate those)
      const userTasks = localTasks.filter(
        (task) => !defaultTasks.some((dt) => dt.id === task.id)
      )

      if (userTasks.length === 0 && userFolders.length === 0) {
        return { success: true, migrated: 0 }
      }

      // Convert and insert tasks
      const supabaseTasks = userTasks.map((task) => toSupabaseTask(task, userId))
      const { data, error } = await supabase.from('tasks').insert(supabaseTasks).select()

      if (error) throw error

      // Clear localStorage after successful migration
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(FOLDERS_STORAGE_KEY)

      return { success: true, migrated: userTasks.length }
    } catch (error) {
      console.error('Error migrating tasks:', error)
      return { success: false, error: error.message }
    }
  },
}
