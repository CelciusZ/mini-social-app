import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

function Home({ posts, setPosts, error, setError }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://mini-social-backend.onrender.com/posts');
      if (!response.ok) throw new Error('Backend’den cevap alınamadı');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://mini-social-backend.onrender.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) throw new Error('Gönderi eklenemedi');
      const newPost = await response.json();
      setPosts([...posts, newPost]);
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
    <div className="App">
      <h1>Mini Sosyal Medya</h1>
      {error && <p>Hata: {error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Başlık"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="İçerik"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Gönderi Ekle</button>
      </form>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button onClick={() => handleDelete(post._id)}>Sil</button>
          </li>
        ))}
      </ul>
      <Link to="/about">Hakkında</Link>
    </div>
  );
}

function About() {
  return (
    <div className="App">
      <h1>Hakkında</h1>
      <p>Bu Mini Sosyal Medya uygulaması kanka için yapıldı!</p>
      <Link to="/">Ana Sayfaya Dön</Link>
    </div>
  );
}

function App() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://mini-social-backend.onrender.com/posts');
        if (!response.ok) throw new Error('Backend’den cevap alınamadı');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home posts={posts} setPosts={setPosts} error={error} setError={setError} />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;