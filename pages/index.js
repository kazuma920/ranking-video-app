import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState(null);

  async function loadVideos() {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('votes', { ascending: false })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setVideos(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadVideos();
  }, []);

  async function handleVote(video) {
    setVotingId(video.id);
    const { error } = await supabase
      .from('videos')
      .update({ votes: video.votes + 1 })
      .eq('id', video.id);

    if (!error) {
      await loadVideos();
    }
    setVotingId(null);
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Ranking Video</h1>

        {loading && <p>Memuat...</p>}

        {!loading && videos.length === 0 && (
          <div className="empty-state">
            Belum ada video. Jadi yang pertama upload!
          </div>
        )}

        {videos.map((video, index) => (
          <div className="card" key={video.id}>
            <div className="rank-number">{index + 1}</div>
            <video src={video.video_url} muted />
            <div className="card-info">
              <h3>{video.judul}</h3>
              <small>{video.votes} vote</small>
            </div>
            <button
              className="vote-btn"
              disabled={votingId === video.id}
              onClick={() => handleVote(video)}
            >
              ▲ Vote
            </button>
          </div>
        ))}
      </div>
    </>
  );
                }
