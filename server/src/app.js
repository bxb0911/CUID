const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

// 指定日志输出格式（Standard Apache combined log output）
app.use(morgan('combined'))
// 对post请求的请求体进行解析
app.use(bodyParser.json())
// 允许所有跨域请求
app.use(cors())

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/posts')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection Error'))
db.once('open', callback => {
  console.log('Connection Succeeded')
})
const Post = require('../models/post')

app.post('/posts', (req, res) => {
  let db = req.db
  let title = req.body.title
  let description = req.body.description
  let new_post = new Post({
    title: title,
    description: description
  })

  new_post.save(error => {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Post saved successfully!'
    })
  })
})

app.get('/posts', (req, res) => {
  Post.find({}, 'title description', (error, posts) => {
    if (error) {
      console.error(error)
    }
    res.send({
      posts: posts
    })
  }).sort({_id: -1})
})

app.get('/post/:id', (req, res) => {
  let db = req.db
  Post.findById(req.params.id, 'title description', (error, post) => {
    if (error) {
      console.error(error)
    }
    res.send(post)
  })
})

app.put('/posts/:id', (req, res) => {
  let db = req.db
  Post.findById(req.params.id, 'title description', (error, post) => {
    if (error) {
      console.error(error)
    }
    post.title = req.body.title
    post.description = req.body.description
    post.save(error => {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

app.delete('/posts/:id', (req, res) => {
  let db = req.db
  Post.remove({
    _id: req.params.id
  }, (error) => {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true
    })
  })
})

app.listen(process.env.PORT || 8082)

