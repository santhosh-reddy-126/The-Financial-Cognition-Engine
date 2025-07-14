import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Load from .env
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Test DB connection
async function checkDbConnection() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) {
    console.error('❌ Supabase DB connection failed:', error.message);
  } else {
    console.log('✅ Supabase DB connected!');
  }
}
checkDbConnection();

// Register endpoint
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existingUser)
    return res.status(400).json({ error: 'User already exists' });

  // Hash the password
  const password_hash = await bcrypt.hash(password, 10);

  // Insert user into users table
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password_hash }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'User registered successfully', user: data[0] });
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  // Fetch user by email
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error || !user)
    return res.status(400).json({ error: 'Invalid credentials' });

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch)
    return res.status(400).json({ error: 'Invalid credentials' });

  // For demo: return user data (in production, issue JWT here)
  res.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
