import '@testing-library/jest-dom'
import {afterAll, afterEach, beforeAll} from 'vitest'
import {cleanup} from '@testing-library/react'
import {setupServer} from 'msw/node'
import {http, HttpResponse} from 'msw'

// Очистка после каждого теста
afterEach(() => {
    cleanup()
})

// Создаем мок-сервер
export const server = setupServer(
    // Определяем обработчики для API
    http.get('/users', () => {
        return HttpResponse.json([
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        ])
    }),

    http.get('/users/:id', (req) => {
        const {id} = req.params
        return HttpResponse.json({
            id: Number(id),
            name: 'John Doe',
            email: 'john@example.com',
            details: {age: 30, location: 'New York'}
        })
    }),

    http.put('/users/:id', async (req) => {
        const {id} = req.params
        const body = req.request.body
        return HttpResponse.json({...body, id: Number(id)})
    })
)

// Запускаем сервер перед всеми тестами
beforeAll(() => server.listen())

// Сбрасываем обработчики между тестами
afterEach(() => server.resetHandlers())

// Закрываем сервер после всех тестов
afterAll(() => server.close())
