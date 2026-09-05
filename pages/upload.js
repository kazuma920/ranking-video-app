import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';

export default function Upload() {
  const router = useRouter();
  const [judul, setJudul] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (!judul.trim() || !file) {
      setMessage({ type: 'error', text: 'Judul dan file video wajib diisi.' });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase.from('videos').insert({
        judul: judul.trim(),
        video_url: publicUrlData.publicUrl,
        votes: 0,
      });

      if (insertError) throw insertError;

      setMessage({ type: 'success', text: 'Video berhasil diupload!' });
      setJudul('');
      setFile(null);

      setTimeout(() => router.push('/'), 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Gagal upload.' });
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Upload Video</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Judul video</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Misal: Kucing Paling Nekat"
            />
          </div>

          <div>
            <label>File video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          {message && (
            <div className={`status-msg ${message.type}`}>{message.text}</div>
          )}

          <button className="submit-btn" type="submit" disabled={uploading}>
            {uploading ? 'Mengupload...' : 'Upload'}
          </button>
        </form>
      </div>
    </>
  );
  }
