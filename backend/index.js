const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Bağlantısı
mongoose.connect('mongodb+srv://kanka:sifre123@mini-social.8bzmg.mongodb.net/mini-social?retryWrites=true&w=majority&appName=mini-social')
  .then(() => console.log('MongoDB bağlandı'))
  .catch(err => console.error('MongoDB hata:', err));

// Kullanıcı Modeli
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Gönderi Modeli
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const Post = mongoose.model('Post', postSchema);

// Kayıt Endpoint
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli' });
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Bu kullanıcı adı zaten alınmış' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ message: 'Kullanıcı oluşturuldu' });
  } catch (err) {
    res.status(500).json({ error: 'Kayıt başarısız: ' + err.message });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli' });
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Şifre yanlış' });
    const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Giriş başarısız: ' + err.message });
  }
});

// Gönderileri Getir
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Gönderiler alınamadı: ' + err.message });
  }
});

// Gönderi Ekle
app.post('/posts', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token gerekli' });
    const decoded = jwt.verify(token, 'secret_key');
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      userId: decoded.userId,
    });
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Gönderi eklenemedi: ' + err.message });
  }
});

// Gönderi Sil
app.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Gönderi bulunamadı' });
    await post.remove();
    res.json({ message: 'Gönderi silindi' });
  } catch (err) {
    res.status(500).json({ error: 'Gönderi silinemedi: ' + err.message });
  }
});

app.listen(5000, () => console.log('Sunucu 5000’de çalışıyor'));