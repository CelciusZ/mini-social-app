const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB bağlantısı (Atlas connection string)
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
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Yeni gönderi ekle
app.post('/posts', async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
    });
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Sunucu 5000’de çalışıyor'));