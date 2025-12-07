import { useState, useEffect, useRef } from 'react'
import { useItems, useCreateItem, useUpdateItem, useDeleteItem } from './hooks/useItems'
import type { Item } from './types'
import ConfirmDialog from './components/ConfirmDialog'
import './App.scss'

function App() {
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const messageTimeoutRef = useRef<number | null>(null)

  // React Query hooks
  const { data: items = [], isLoading: loading } = useItems()
  const createItemMutation = useCreateItem()
  const updateItemMutation = useUpdateItem()
  const deleteItemMutation = useDeleteItem()

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })

    if (messageTimeoutRef.current) {
      window.clearTimeout(messageTimeoutRef.current)
    }

    messageTimeoutRef.current = window.setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const createItem = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTitle.trim()) {
      showMessage('error', 'Введите название элемента')
      return
    }

    try {
      await createItemMutation.mutateAsync({
        title: newTitle,
        description: newDescription
      })
      setNewTitle('')
      setNewDescription('')
      showMessage('success', 'Элемент успешно создан!')
    } catch (error) {
      console.error('Error creating item:', error)
      showMessage('error', 'Ошибка при создании элемента')
    }
  }

  const handleDeleteClick = (item: Item) => {
    setItemToDelete(item)
    setShowConfirmDialog(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    setShowConfirmDialog(false)

    try {
      await deleteItemMutation.mutateAsync(itemToDelete.id)
      showMessage('success', `Элемент "${itemToDelete.title}" успешно удалён!`)
      setItemToDelete(null)
    } catch (error) {
      console.error('Error deleting item:', error)
      showMessage('error', 'Ошибка при удалении элемента')
    }
  }

  const cancelDelete = () => {
    setShowConfirmDialog(false)
    setItemToDelete(null)
  }

  const startEditing = (item: Item) => {
    setEditingId(item.id)
    setEditTitle(item.title)
    setEditDescription(item.description || '')
  }

  const saveEdit = async () => {
    if (!editTitle.trim()) {
      showMessage('error', 'Введите название элемента')
      return
    }

    if (!editingId) return

    try {
      await updateItemMutation.mutateAsync({
        id: editingId,
        data: {
          title: editTitle,
          description: editDescription
        }
      })
      showMessage('success', 'Элемент успешно обновлён!')
      setEditingId(null)
      setEditTitle('')
      setEditDescription('')
    } catch (error) {
      console.error('Error updating item:', error)
      showMessage('error', 'Ошибка при обновлении элемента')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
  }

  const testHealth = async () => {
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      console.log('Health check:', data)
      showMessage('success', `Бэкенд работает! Статус: ${data.status}`)
    } catch (error) {
      console.error('Health check failed:', error)
      showMessage('error', 'Бэкенд недоступен')
    }
  }

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        window.clearTimeout(messageTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Сообщения вверху страницы */}
      {message && (
        <div className="message-container">
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        </div>
      )}

      {/* Диалог подтверждения удаления */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Подтверждение удаления"
        message={`Вы уверены, что хотите удалить элемент "${itemToDelete?.title}"?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Удалить"
        cancelText="Отмена"
      />

      <div className="app">
        <h1>🚀 FullStack приложение</h1>
        <p>
          Современное приложение с React фронтендом и FastAPI бэкендом
        </p>

        <div className="form">
          <h2>Добавить новый элемент</h2>
          <form onSubmit={createItem}>
            <div className="form-group">
              <label htmlFor="title">Название элемента</label>
              <input
                id="title"
                type="text"
                placeholder="Введите название элемента"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                disabled={createItemMutation.isPending}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Описание</label>
              <textarea
                id="description"
                placeholder="Введите описание (необязательно)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
                disabled={createItemMutation.isPending}
              />
            </div>

            <button
              type="submit"
              disabled={createItemMutation.isPending || !newTitle.trim()}
            >
              {createItemMutation.isPending ? 'Создание...' : 'Создать элемент'}
            </button>
          </form>
        </div>

        <div className="items">
          <h2>Список элементов ({items.length})</h2>
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              Пока нет элементов. Создайте первый!
            </div>
          ) : (
            <ul>
              {items.map(item => (
                <li key={item.id}>
                  {editingId === item.id ? (
                    <div className="edit-form">
                      <div className="form-group">
                        <label>Название элемента</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          disabled={updateItemMutation.isPending}
                        />
                      </div>
                      <div className="form-group">
                        <label>Описание</label>
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={2}
                          disabled={updateItemMutation.isPending}
                        />
                      </div>
                      <div className="edit-buttons">
                        <button
                          onClick={saveEdit}
                          disabled={updateItemMutation.isPending || !editTitle.trim()}
                        >
                          {updateItemMutation.isPending ? 'Сохранение...' : '💾 Сохранить'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={updateItemMutation.isPending}
                        >
                          ❌ Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="item-header">
                        <h3>{item.title}</h3>
                        <div className="item-actions">
                          <button
                            className="edit-btn"
                            onClick={() => startEditing(item)}
                            title="Редактировать элемент"
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteClick(item)}
                            disabled={deleteItemMutation.isPending && itemToDelete?.id === item.id}
                            title="Удалить элемент"
                          >
                            {deleteItemMutation.isPending && itemToDelete?.id === item.id ? '⏳' : '🗑️'}
                          </button>
                        </div>
                      </div>
                      {item.description && <p>{item.description}</p>}
                      {item.created_at && (
                        <small>
                          Создано: {new Date(item.created_at).toLocaleString('ru-RU')}
                        </small>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="api-test">
          <h2>Тест подключения</h2>
          <p>
            Проверьте, что бэкенд корректно отвечает на запросы и соединение работает стабильно
          </p>
          <button onClick={testHealth}>
            Проверить health endpoint
          </button>
        </div>

        <div className="info-box">
          <h3>Технологии проекта</h3>
          <ul>
            <li>
              <strong>🎨 Frontend</strong>
              React 18 + TypeScript + Vite
            </li>
            <li>
              <strong>⚡ Backend</strong>
              FastAPI (Python) + Poetry + SQLAlchemy
            </li>
            <li>
              <strong>🗄️ Database</strong>
              PostgreSQL + Docker контейнер
            </li>
            <li>
              <strong>🚀 Development</strong>
              Hot Reload + ESLint + SCSS модули
            </li>
            <li>
              <strong>🔧 Tools</strong>
              Axios + React Hooks + CSS Grid/Flexbox
            </li>
            <li>
              <strong>🎯 Features</strong>
              Полные CRUD операции + Валидация + Гибкая архитектура
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default App
