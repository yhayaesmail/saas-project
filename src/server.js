import app from './app.js';
import { connectDB } from './config/db.js';
import { seedPlans } from './services/subscriptionService.js';
import { env } from './config/env.js';

const start = async () => {
  try {
    await connectDB();
    await seedPlans();
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
    });
  } catch (err) {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

start();
