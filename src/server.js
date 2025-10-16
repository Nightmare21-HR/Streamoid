
const app =require('./app');
const {setupDatabase}=require('./db');

const PORT=process.env.PORT|| 8000;

setupDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to setup database:', err);
  process.exit(1);
});