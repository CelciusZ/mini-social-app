import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://mini-social-backend.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Kayıt başarısız');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Kayıt Ol</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <button type="submit" className="button">Kayıt Ol</button>
      </form>
      <p>Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link></p>
    </div>
  );
}

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://mini-social-backend.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Giriş başarısız');
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Giriş Yap</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <button type="submit" className="button">Giriş Yap</button>
      </form>
      <p>Hesabın yok mu? <Link to="/register">Kayıt Ol</Link></p>
    </div>
  );
}

function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://mini-social-backend.onrender.com/posts');
        if (!response.ok) throw new Error('Gönderiler alınamadı');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://mini-social-backend.onrender.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gönderi eklenemedi');
      setPosts([...posts, data]);
      setTitle('');
      setContent('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://mini-social-backend.onrender.com/posts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Gönderi silinemedi');
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Mini Sosyal</h1>
      {error && <p className="error">{error}</p>}
      {token ? (
        <div>
          <form onSubmit={handleSubmit} className="post-form">
            <input
              type="text"
              placeholder="Başlık yaz..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
            />
            <textarea
              placeholder="Ne düşünüyorsun kanka?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="textarea"
            />
            <button type="submit" className="button">Paylaş</button>
          </form>
          <div className="posts">
            {posts.length === 0 ? (
              <p className="no-posts">Henüz gönderi yok, bir tane ekle!</p>
            ) : (
              posts.map(post => (
                <div key={post._id} className="post">
                  <h2>{post.title}</h2>
                  <p>{post.content}</p>
                  <button onClick={() => handleDelete(post._id)} className="delete-button">Sil</button>
                </div>
              ))
            )}
          </div>
          <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="button logout">Çıkış Yap</button>
        </div>
      ) : (
        <p>Lütfen <Link to="/login">giriş yap</Link> veya <Link to="/register">kayıt ol</Link>.</p>
      )}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;