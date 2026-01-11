import React, { useState, useEffect, useRef } from 'react';
import { Search, Tv, Play, ChevronRight, Info } from 'lucide-react';
import './App.css';

const OpenWebPlayer = () => {
  const [loginType, setLoginType] = useState(null);
  const [m3uUrl, setM3uUrl] = useState('');
  const [xtreamUrl, setXtreamUrl] = useState('');
  const [xtreamUser, setXtreamUser] = useState('');
  const [xtreamPass, setXtreamPass] = useState('');
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentChannel, setCurrentChannel] = useState(null);
  const [epgData, setEpgData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('iptv_session');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.type === 'm3u') {
          setLoginType('m3u');
          setM3uUrl(data.url);
          loadM3U(data.url);
        } else if (data.type === 'xtream') {
          setLoginType('xtream');
          setXtreamUrl(data.url);
          setXtreamUser(data.user);
          setXtreamPass(data.pass);
          loadXtream(data.url, data.user, data.pass);
        }
      } catch (e) {
        console.error('Failed to restore session', e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smart fetch function that auto-detects CORS issues and uses proxy
  const smartFetch = async (url, options = {}) => {
    try {
      // First, try direct fetch
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      // If direct fetch fails, use CF proxy
      console.log('Direct fetch failed, using proxy:', error.message);
      return await proxyFetch(url, options);
    }
  };

  // Proxy fetch through Cloudflare Worker
  const proxyFetch = async (url, options = {}) => {
    const proxyUrl = '/proxy';
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        method: options.method || 'GET',
        headers: options.headers || {}
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    // Create a mock Response object
    return {
      ok: data.status >= 200 && data.status < 300,
      status: data.status,
      statusText: data.statusText,
      headers: new Headers(data.headers),
      json: async () => typeof data.body === 'string' ? JSON.parse(data.body) : data.body,
      text: async () => typeof data.body === 'string' ? data.body : JSON.stringify(data.body)
    };
  };

  const parseM3U = (content) => {
    const lines = content.split('\n');
    const parsed = [];
    let current = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#EXTINF:')) {
        const tvgId = line.match(/tvg-id="([^"]*)"/)?.[1] || '';
        const tvgName = line.match(/tvg-name="([^"]*)"/)?.[1] || '';
        const tvgLogo = line.match(/tvg-logo="([^"]*)"/)?.[1] || '';
        const groupTitle = line.match(/group-title="([^"]*)"/)?.[1] || 'Uncategorized';
        const nameMatch = line.split(',');
        const name = nameMatch[nameMatch.length - 1].trim();

        current = {
          id: tvgId || `ch_${parsed.length}`,
          name: tvgName || name,
          logo: tvgLogo,
          category: groupTitle,
          epgId: tvgId
        };
      } else if (line && !line.startsWith('#') && current.name) {
        current.url = line;
        parsed.push({ ...current });
        current = {};
      }
    }

    return parsed;
  };

  const loadM3U = async (url) => {
    setLoading(true);
    setError('');
    try {
      // Use CORS proxy for M3U URLs if needed
      const fetchUrl = url.startsWith('http://') ? `https://corsproxy.io/?${encodeURIComponent(url)}` : url;
      const response = await fetch(fetchUrl);
      const content = await response.text();
      const parsed = parseM3U(content);
      
      setChannels(parsed);
      const cats = [...new Set(parsed.map(ch => ch.category))].sort();
      setCategories(cats);
      
      sessionStorage.setItem('iptv_session', JSON.stringify({ type: 'm3u', url }));
      setLoginType('m3u');
      
      const epgUrl = content.match(/url-tvg="([^"]*)"/)?.[1];
      if (epgUrl) {
        loadEPG(epgUrl);
      }
    } catch (e) {
      setError('Failed to load M3U playlist: ' + e.message);
    }
    setLoading(false);
  };

  const loadXtream = async (url, user, pass) => {
    setLoading(true);
    setError('');
    try {
      const baseUrl = url.replace(/\/$/, '');
      // Ensure HTTPS for Xtream connections
      const secureUrl = baseUrl.replace(/^http:/, 'https:');
      
      const catResponse = await fetch(`${secureUrl}/player_api.php?username=${user}&password=${pass}&action=get_live_categories`);
      const categories = await catResponse.json();
      
      const chResponse = await fetch(`${secureUrl}/player_api.php?username=${user}&password=${pass}&action=get_live_streams`);
      const streams = await chResponse.json();
      
      const parsed = streams.map(ch => ({
        id: ch.stream_id,
        name: ch.name,
        logo: ch.stream_icon,
        category: categories.find(c => c.category_id === ch.category_id)?.category_name || 'Uncategorized',
        url: `${secureUrl}/live/${user}/${pass}/${ch.stream_id}.m3u8`,
        epgId: ch.epg_channel_id
      }));
      
      setChannels(parsed);
      const cats = [...new Set(parsed.map(ch => ch.category))].sort();
      setCategories(cats);
      
      sessionStorage.setItem('iptv_session', JSON.stringify({ type: 'xtream', url: secureUrl, user, pass }));
      setLoginType('xtream');
      
      if (parsed.length > 0) {
        const epgResponse = await fetch(`${secureUrl}/player_api.php?username=${user}&password=${pass}&action=get_simple_data_table&stream_id=${parsed[0]?.id}`);
        const epg = await epgResponse.json();
        if (epg.epg_listings) {
          processXtreamEPG(epg.epg_listings);
        }
      }
    } catch (e) {
      setError('Failed to connect to Xtream Codes: ' + e.message + '. Note: Your IPTV provider must support HTTPS and allow browser access (CORS). Many providers only work with native apps.');
    }
    setLoading(false);
  };

  const loadEPG = async (url) => {
    try {
      const response = await fetch(url);
      const xml = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      const programmes = doc.querySelectorAll('programme');
      const epg = {};
      
      programmes.forEach(prog => {
        const channel = prog.getAttribute('channel');
        const start = prog.getAttribute('start');
        const title = prog.querySelector('title')?.textContent || '';
        const desc = prog.querySelector('desc')?.textContent || '';
        
        if (!epg[channel]) epg[channel] = [];
        epg[channel].push({ start, title, desc });
      });
      
      setEpgData(epg);
    } catch (e) {
      console.error('EPG load failed', e);
    }
  };

  const processXtreamEPG = (listings) => {
    const epg = {};
    Object.keys(listings).forEach(channelId => {
      epg[channelId] = listings[channelId].map(item => ({
        start: item.start,
        title: item.title,
        desc: item.description
      }));
    });
    setEpgData(epg);
  };

  const handleM3UConnect = () => {
    if (m3uUrl) {
      loadM3U(m3uUrl);
    }
  };

  const handleXtreamConnect = () => {
    if (xtreamUrl && xtreamUser && xtreamPass) {
      loadXtream(xtreamUrl, xtreamUser, xtreamPass);
    }
  };

  const playChannel = (channel) => {
    setCurrentChannel(channel);
    if (videoRef.current) {
      videoRef.current.src = channel.url;
      videoRef.current.load();
      videoRef.current.play().catch(e => console.error('Play failed', e));
    }
  };

  const logout = () => {
    sessionStorage.removeItem('iptv_session');
    setLoginType(null);
    setChannels([]);
    setCategories([]);
    setCurrentChannel(null);
    setM3uUrl('');
    setXtreamUrl('');
    setXtreamUser('');
    setXtreamPass('');
  };

  const filteredChannels = channels.filter(ch => {
    const matchesCategory = selectedCategory === 'all' || ch.category === selectedCategory;
    const matchesSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCurrentEPG = (channel) => {
    if (!channel?.epgId || !epgData[channel.epgId]) return null;
    const now = new Date();
    return epgData[channel.epgId].find(prog => {
      const start = new Date(prog.start);
      return start <= now;
    });
  };

  if (!loginType) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="logo-header">
            <Tv className="logo-icon" />
            <h1 className="logo-text">OpenWebPlayer</h1>
          </div>
          
          <div className="button-group">
            <button
              onClick={() => setShowSettings('m3u')}
              className="login-button m3u-button"
            >
              <span>Login with M3U URL</span>
              <ChevronRight className="chevron-icon" />
            </button>
            
            <button
              onClick={() => setShowSettings('xtream')}
              className="login-button xtream-button"
            >
              <span>Login with Xtream Codes</span>
              <ChevronRight className="chevron-icon" />
            </button>
          </div>

          {showSettings === 'm3u' && (
            <div className="settings-form">
              <input
                type="url"
                value={m3uUrl}
                onChange={(e) => setM3uUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleM3UConnect()}
                placeholder="Enter M3U URL"
                className="input-field"
              />
              <button
                onClick={handleM3UConnect}
                disabled={loading || !m3uUrl}
                className="connect-button"
              >
                {loading ? 'Loading...' : 'Connect'}
              </button>
            </div>
          )}

          {showSettings === 'xtream' && (
            <div className="settings-form">
              <input
                type="url"
                value={xtreamUrl}
                onChange={(e) => setXtreamUrl(e.target.value)}
                placeholder="Server URL"
                className="input-field"
              />
              <input
                type="text"
                value={xtreamUser}
                onChange={(e) => setXtreamUser(e.target.value)}
                placeholder="Username"
                className="input-field"
              />
              <input
                type="password"
                value={xtreamPass}
                onChange={(e) => setXtreamPass(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleXtreamConnect()}
                placeholder="Password"
                className="input-field"
              />
              <button
                onClick={handleXtreamConnect}
                disabled={loading || !xtreamUrl || !xtreamUser || !xtreamPass}
                className="connect-button"
              >
                {loading ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="privacy-notice">
            <Info className="info-icon" />
            Your credentials are stored only in your browser session
          </div>
          
          <div className="mt-4 text-center text-yellow-400 text-xs">
            ⚠️ Note: Your IPTV provider must support HTTPS and browser access (CORS). Some providers only work with native apps.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <Tv className="header-icon" />
          <h1 className="header-title">OpenWebPlayer</h1>
        </div>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <div className="sidebar-controls">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search channels..."
                className="search-input"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="channel-list">
            {filteredChannels.map(channel => (
              <button
                key={channel.id}
                onClick={() => playChannel(channel)}
                className={`channel-item ${currentChannel?.id === channel.id ? 'active' : ''}`}
              >
                {channel.logo ? (
                  <img src={channel.logo} alt="" className="channel-logo" />
                ) : (
                  <div className="channel-logo-placeholder">
                    <Tv className="placeholder-icon" />
                  </div>
                )}
                <div className="channel-info">
                  <div className="channel-name">{channel.name}</div>
                  <div className="channel-category">{channel.category}</div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="video-section">
          {currentChannel ? (
            <>
              <div className="video-container">
                <video
                  ref={videoRef}
                  controls
                  className="video-player"
                  autoPlay
                >
                  Your browser does not support video playback.
                </video>
              </div>
              
              <div className="now-playing">
                <div className="now-playing-content">
                  {currentChannel.logo && (
                    <img src={currentChannel.logo} alt="" className="now-playing-logo" />
                  )}
                  <div className="now-playing-info">
                    <h2 className="now-playing-title">{currentChannel.name}</h2>
                    <p className="now-playing-category">{currentChannel.category}</p>
                    {getCurrentEPG(currentChannel) && (
                      <div className="epg-info">
                        <div className="epg-title">
                          {getCurrentEPG(currentChannel).title}
                        </div>
                        {getCurrentEPG(currentChannel).desc && (
                          <div className="epg-desc">
                            {getCurrentEPG(currentChannel).desc}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Play className="empty-icon" />
              <p>Select a channel to start watching</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OpenWebPlayer;