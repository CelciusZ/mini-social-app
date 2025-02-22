const express = require('express');
const cors = require('cors'); // CORS’u ekle
const app = express();
app.use(cors()); // CORS’u etkinleştirir

app.use(express.json());
app.use(cors()); // CORS’u etkinleştirir

app.get('/', (req, res) => res.send('Backend çalışıyor kanka!'));

const posts = [
  { id: 1, title: 'İlk Gönderi', content: 'Merhaba kanka!' },
  { id: 2, title: 'İkinci Gönderi', content: 'Nasılsın?' }
];

app.get('/posts', (req, res) => res.json(posts));

app.listen(5000, () => console.log('Sunucu 5000’de çalışıyor'));