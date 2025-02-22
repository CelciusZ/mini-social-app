import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/posts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Backend’den cevap alınamadı: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('Gelen veri:', data);
        setPosts(data);
      })
      .catch(error => {
        console.error('Hata:', error);
        setError(error.message);
      });
  }, []);

  return (
    <div className="App">
      <h1>Mini Sosyal Medya</h1>
      {error ? (
        <p>Hata: {error}</p>
      ) : posts.length > 0 ? (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Gönderi yükleniyor veya yok...</p>
      )}
    </div>
  );
}



export default App;