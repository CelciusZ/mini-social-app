import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  // Gönderileri çek
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://mini-social-backend.onrender.com/posts');
        if (!response.ok) throw new Error('Backend’den veri alınamadı');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPosts();
  }, []);

  // Gönderi ekle
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

  // Gönderi sil
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
      <header>
        <h1>Mini Sosyal</h1>
      </header>
      <main>
        {error && <p className="error">{error}</p>}
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
      </main>
    </div>
  );
}

export default App;