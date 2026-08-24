import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { env } from './config/env.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
if (env.nodeEnv !== 'production') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Subscription-based SaaS Backend API',
    version: '1.0.0',
    documentation: 'See README.md or import postman_collection.json into Postman',
    endpoints: {
      auth: ['/api/signup', '/api/login'],
      plans: ['/api/plans'],
      subscriptions: [
        '/api/subscribe',
        '/api/upgrade-plan',
        '/api/downgrade-plan',
        '/api/cancel-subscription',
        '/api/subscription/me'
      ],
      user: ['/api/profile', '/api/dashboard', '/api/premium-content'],
      admin: ['/api/admin/users', '/api/admin/subscriptions', '/api/admin/plans'],
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok', uptime: process.uptime() });
});

app.use('/api', authRoutes);
app.use('/api', subscriptionRoutes);
app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
