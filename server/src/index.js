const { createApp } = require('./app');
const { config } = require('./config');
const { prisma } = require('./prisma');

async function main() {
  const app = createApp();
  const server = app.listen(config.port, () => {
    console.log(`🚚 TransitOps API listening on http://localhost:${config.port} (${config.env})`);
  });

  const shutdown = async (signal) => {
    console.log(`\n${signal} received — shutting down…`);
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch(async (err) => {
  console.error('Failed to start server:', err);
  await prisma.$disconnect();
  process.exit(1);
});
