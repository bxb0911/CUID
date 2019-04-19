const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  title: String,
  description: String
})

const Post = mongoose.model('POST', PostSchema)
module.exports = Post