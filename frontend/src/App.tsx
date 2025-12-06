import { useState, useEffect, useRef } from 'react'
import { itemsApi } from './services/api'
import type { Item } from './types'
import ConfirmDialog from './components/ConfirmDialog'
import './App.scss'

function App() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null)

  const messageTimeoutRef = useRef<number | null>(null)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })

    if (messageTimeoutRef.current) {
      window.clearTimeout(messageTimeoutRef.current)
    }

    messageTimeoutRef.current = window.setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const fetchItems = async () => {
    try {
      const response = await itemsApi.getAll()
      setItems(response.data)
    } catch (error) {
      console.error('Error fetching items:', error)
      showMessage('error', 'Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const createItem = async () => {
    if (!newTitle.trim()) {
      showMessage('error', 'Введите название элемента')
      return
    }

    setIsSubmitting(true)

    try {
      await itemsApi.create({
        title: newTitle,
        description: newDescription
      })
      setNewTitle('')
      setNewDescription('')
      showMessage('success', 'Элемент успешно создан!')
      fetchItems()
    } catch (error) {
      console.error('Error creating item:', error)
      showMessage('error', 'Ошибка при создании элемента')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (item: Item) => {
    setItemToDelete(item)
    setShowConfirmDialog(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    setDeletingId(itemToDelete.id)
    setShowConfirmDialog(false)

    try {
      await itemsApi.delete(itemToDelete.id)
      showMessage('success', `Элемент "${itemToDelete.title}" успешно удалён!`)
      fetchItems()
    } catch (error) {
      console.error('Error deleting item:', error)
      showMessage('error', 'Ошибка при удалении элемента')
    } finally {
      setDeletingId(null)
      setItemToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowConfirmDialog(false)
    setItemToDelete(null)
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
    fetchItems()

    return () => {
      if (messageTimeoutRef.current) {
        window.clearTimeout(messageTimeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createItem()
  }

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
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Название элемента</label>
              <input
                id="title"
                type="text"
                placeholder="Введите название элемента"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !newTitle.trim()}
            >
              {isSubmitting ? 'Создание...' : 'Создать элемент'}
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
                  <div className="item-header">
                    <h3>{item.title}</h3>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(item)}
                      disabled={deletingId === item.id}
                      title="Удалить элемент"
                    >
                      {deletingId === item.id ? '⏳' : '🗑️'}
                    </button>
                  </div>
                  {item.description && <p>{item.description}</p>}
                  {item.created_at && (
                    <small>
                      Создано: {new Date(item.created_at).toLocaleString('ru-RU')}
                    </small>
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
              CRUD операции + Валидация + Гибкая архитектура
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default App