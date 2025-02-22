import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

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

  return (
    <div className="App">
      <h1>Mini Sosyal Medya</h1>
      <p>Hoş geldin kanka, gönderi ekle!</p> {/* Yeni mesaj */}
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;