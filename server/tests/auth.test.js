/**
 * Integration tests for auth routes.
 * These hit a real test database — set TEST_DATABASE_URL in .env or use your main DB.
 * Run with: npm test
 */
const request = require('supertest');
const app = require('../index');

describe('POST /api/auth/register', () => {
  it('returns 400 if fields are missing', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'test@test.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('POST /api/auth/login', () => {
  it('returns 401 for wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
