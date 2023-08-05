<div align="center">

# MMD Express Framework NodeJS
Built with Nodejs and TypeScript
  
![Express Logo](https://mms.businesswire.com/media/20230125005743/en/1397137/23/Express_%28black%29_Logo.jpg)
</div>
<hr>

> <b>1.  **Install npm mmd express** </b>
```shell
npm i mmdexpress
```

> <b>2.  **Framework syntax** </b>
```javascript
const { mmdExpress } = require('mmdexpress')
const path = require('path')
const Joi = require('joi')

const app = mmdExpress()

  app.use((req, res, next) => {
    console.log('Hello from middleware!')
    next()
  })

  app.get('/get', (req, res) => {
      res.send('Hello from mmdexpress!')
  })

  app.get('/json', (req , res) => {
    const jsonData = { message: 'Hello, this is a JSON response!' }
    res.json(jsonData)
  })

  app.get('/redirect', (req , res) => {
    setTimeout(() => {
      res.redirect('/get')
    }, 3000)
  })

  app.get('/query', (req, res) => {
      const name = req.query.name
      const age = req.query.age

      res.json({ name, age })
  })

  app.post('/post', (req, res) => {
      res.send(`Received a POST request with body:  ${JSON.stringify(req.body)}`)
  })

  const userSchema = Joi.object({
    name: Joi.string().min(3).required(),
    age: Joi.number().integer().min(0).required(),
    email: Joi.string().email().required()
  });

  const userCallback = (req, res) => {
      const userData = req.body;
      res.json({ message: 'User created successfully!', data: userData });
  };

  app.post('/validation', userCallback, { bodySchema: userSchema });

  app.put('/put', (req, res) => {
      res.send(`params : ${JSON.stringify(req.params)} Received a POST request with body: ${JSON.stringify(req.body)}`)
  })
  
  app.delete('/delete', (req, res) => {
      res.json(req.params)
  })

  
  app.get('/static', (req, res) => {
    const file = req.query.file
    console.log(file)
    const staticFolderPath = path.join(__dirname, `./public/${file}`)
    res.sendFile(staticFolderPath)
  })

app.listen(5000, () => {
  console.log('server started')
})
```
<div/>
