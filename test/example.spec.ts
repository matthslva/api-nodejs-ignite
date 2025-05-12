import { expect, test, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

beforeAll(async () => {
    await app.ready()
})

afterAll(async () => {
    await app.close()
})

test('o usuário consegue criar uma nova transação', async ()  => {
    await request(app.server)
        .post('/transactions')
        .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
        })
        .expect(201)
     })