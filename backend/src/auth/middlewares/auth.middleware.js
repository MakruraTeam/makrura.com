import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No Authorization header' });

  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: data.id };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
