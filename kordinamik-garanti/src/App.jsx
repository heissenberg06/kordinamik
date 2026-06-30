import React, { useEffect, useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').trim();

function App() {
  const [form, setForm] = useState({
    product_id: '',
    full_name: '',
    phone: '',
    email: ''
  });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get('product_id');
    if (pid) setForm((prev) => ({ ...prev, product_id: pid }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/warranty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gönderim başarısız');
      setStatus({ type: 'success', message: 'Garanti kaydınız alındı.' });
      setForm((prev) => ({ ...prev, full_name: '', phone: '', email: '' }));
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Garanti Kaydı</h2>
        <p>Ürününüzün garanti kaydını oluşturmak için formu doldurun.</p>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Ürün ID
            <input name="product_id" value={form.product_id} onChange={handleChange} required />
          </label>
          <label>
            Ad Soyad
            <input name="full_name" value={form.full_name} onChange={handleChange} required />
          </label>
          <label>
            Telefon
            <input name="phone" value={form.phone} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </form>
        {status.type && (
          <div className={status.type === 'success' ? 'success' : 'error'}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
