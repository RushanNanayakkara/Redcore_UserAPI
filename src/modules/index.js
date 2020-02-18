import userRoutes from './user.route';

export default app => {
  app.use('/api/v1/users', userRoutes);

  app.get('/', (req, res) => {
    res.send('Invalid URL');
  });
};
