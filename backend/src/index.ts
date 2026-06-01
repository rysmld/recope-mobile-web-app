import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recipeRoutes from './routes/recipes';
import profileRoutes from './routes/profile';
import pantryRoutes from './routes/pantry';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => {
  res.json({ status: 'ok', app: 'recope' });
});

app.use('/api/recipes', recipeRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/pantry', pantryRoutes);

app.listen(PORT, () => {
  console.log(`Recope backend running on http://localhost:${PORT}`);
});