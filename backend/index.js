const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB bağlantısı
mongoose.connect('mongodb+srv://kanka:sifre123@mini-social.8bzmg.mongodb.net/mini-social?retryWrites=true&w=majority&appName=mini-social', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB bağlandı'))
  .catch(err => console.error('MongoDB hata:', err));

// Post Modeli
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Post = mongoose.model('Post', postSchema);

// Gönderileri getir
app.get('/posts', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// Yeni gönderi ekle
app.post('/posts', async (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  await newPost.save();
  res.json(newPost);
});

app.listen(5000, () => console.log('Sunucu 5000’de çalışıyor'));