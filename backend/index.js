const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://kanka:sifre123@mini-social.8bzmg.mongodb.net/mini-social?retryWrites=true&w=majority&appName=mini-social', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB bağlandı'))
  .catch(err => console.error('MongoDB hata:', err));

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Post = mongoose.model('Post', postSchema);

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

app.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) throw new Error('Gönderi bulunamadı');
    res.json({ message: 'Gönderi silindi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Sunucu 5000’de çalışıyor'));