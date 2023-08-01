import MohammadExpress from './app';

const app = new MohammadExpress();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from MohammadExpress!' });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
})
