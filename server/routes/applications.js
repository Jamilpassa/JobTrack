const router = require('express').Router();
const pool = require('../db');
const requireAuth = require('../middleware/auth');

const VALID_STATUSES = [
  'Applied',
  'Interview Scheduled',
  'Interview Completed',
  'Offer Received',
  'Rejected',
  'Withdrawn'
];

// All routes below require the user to be logged in
router.use(requireAuth);

// GET /api/applications — list all applications for the logged-in user
router.get('/', async (req, res) => {
  try {
    const { status, sort } = req.query;
    let query = 'SELECT * FROM applications WHERE user_id = $1';
    const params = [req.user.id];

    if (status && VALID_STATUSES.includes(status)) {
      query += ' AND status = $2';
      params.push(status);
    }

    const sortMap = {
      date_asc:  'date_applied ASC NULLS LAST',
      date_desc: 'date_applied DESC NULLS LAST',
      company:   'company ASC',
    };
    query += ` ORDER BY ${sortMap[sort] || 'created_at DESC'}`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications/stats — dashboard summary numbers
router.get('/stats', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        COUNT(*)                                                    AS total,
        COUNT(*) FILTER (WHERE status = 'Applied')                 AS applied,
        COUNT(*) FILTER (WHERE status LIKE '%Interview%')          AS interviews,
        COUNT(*) FILTER (WHERE status = 'Offer Received')          AS offers,
        COUNT(*) FILTER (WHERE status = 'Rejected')                AS rejected,
        COUNT(*) FILTER (WHERE status = 'Withdrawn')               AS withdrawn
       FROM applications
       WHERE user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/applications — create a new application
router.post('/', async (req, res) => {
  const { company, role, status, date_applied, salary_range, application_url, notes } = req.body;
  if (!company || !role) {
    return res.status(400).json({ error: 'Company and role are required' });
  }
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO applications
         (user_id, company, role, status, date_applied, salary_range, application_url, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.user.id, company, role, status || 'Applied', date_applied || null,
       salary_range || null, application_url || null, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/applications/:id — update an existing application
router.put('/:id', async (req, res) => {
  const { company, role, status, date_applied, salary_range, application_url, notes } = req.body;
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }
  try {
    const result = await pool.query(
      `UPDATE applications
       SET company=$1, role=$2, status=$3, date_applied=$4,
           salary_range=$5, application_url=$6, notes=$7, updated_at=NOW()
       WHERE id=$8 AND user_id=$9
       RETURNING *`,
      [company, role, status, date_applied || null, salary_range || null,
       application_url || null, notes || null, req.params.id, req.user.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/applications/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM applications WHERE id=$1 AND user_id=$2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
