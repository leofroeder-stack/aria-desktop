import { useState, useRef, useEffect } from 'react';

const ARIA_WS = 'wss://aria-os.online/voice/ws';
const ARIA_CHAT = 'https://aria-os.online/voice/chat';

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hey Léo! ARIA Desktop online. What do you need?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('dark');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch(ARIA_CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || data.message || JSON.stringify(data) }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error: ' + e.message }]);
    }
    setLoading(false);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const isDark = theme === 'dark';
  const bg = isDark ? '#0f0f13' : '#f5f5f7';
  const bgCard = isDark ? '#1a1a24' : '#ffffff';
  const fg = isDark ? '#e8e8f0' : '#1a1a2e';
  const primary = '#7c5cfc';
  const muted = isDark ? '#555570' : '#999aaa';
  const userBg = isDark ? '#2a2040' : '#ede9ff';
  const aiBg = isDark ? '#1e1e2e' : '#f0f0f8';

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:bg, color:fg, fontFamily:"'Inter',system-ui,sans-serif", overflow:'hidden' }}>
      {/* HEADER */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px', background:bgCard, borderBottom:`1px solid ${isDark?'#2a2a3a':'#e0e0e8'}`, WebkitAppRegion:'drag' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg, ${primary}, #a78bfa)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>✦</div>
          <div>
            <div style={{ fontWeight:700, fontSize:14, letterSpacing:'0.5px' }}>ARIA</div>
            <div style={{ fontSize:11, color:'#22c55e' }}>● Online</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, WebkitAppRegion:'no-drag' }}>
          <button onClick={() => setTheme(isDark?'light':'dark')} style={{ background:'none', border:`1px solid ${muted}`, borderRadius:6, padding:'4px 10px', color:fg, cursor:'pointer', fontSize:12 }}>{isDark?'☀️':'🌙'}</button>
        </div>
      </div>

      {/* MESSAGES */}
      <div style={{ flex:1, overflowY:'auto', padding:'20px 16px', display:'flex', flexDirection:'column', gap:12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:'flex', justifyContent: m.role==='user'?'flex-end':'flex-start' }}>
            <div style={{ maxWidth:'75%', padding:'10px 14px', borderRadius: m.role==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px', background: m.role==='user'?userBg:aiBg, fontSize:14, lineHeight:1.6, whiteSpace:'pre-wrap', wordBreak:'break-word', border:`1px solid ${isDark?'#2a2a3a':'#e0e0e8'}` }}>
              {m.role==='assistant' && <span style={{ fontSize:11, color:primary, fontWeight:600, display:'block', marginBottom:4 }}>✦ ARIA</span>}
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', justifyContent:'flex-start' }}>
            <div style={{ padding:'10px 14px', borderRadius:'18px 18px 18px 4px', background:aiBg, border:`1px solid ${isDark?'#2a2a3a':'#e0e0e8'}` }}>
              <span style={{ fontSize:11, color:primary, fontWeight:600, display:'block', marginBottom:4 }}>✦ ARIA</span>
              <span style={{ color:muted }}>thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={{ padding:'12px 16px', background:bgCard, borderTop:`1px solid ${isDark?'#2a2a3a':'#e0e0e8'}` }}>
        <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Message ARIA... (Enter to send)"
            rows={1}
            style={{ flex:1, background:isDark?'#252535':'#f0f0f8', border:`1px solid ${isDark?'#3a3a4a':'#d0d0e0'}`, borderRadius:12, padding:'10px 14px', color:fg, fontSize:14, resize:'none', outline:'none', fontFamily:'inherit', lineHeight:1.5, maxHeight:120, overflowY:'auto' }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            style={{ background:primary, border:'none', borderRadius:12, width:42, height:42, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, opacity: (loading||!input.trim())?0.5:1, transition:'opacity 0.2s' }}
          >➤</button>
        </div>
        <div style={{ fontSize:10, color:muted, marginTop:6, textAlign:'center' }}>ARIA Desktop · aria-os.online · Enter to send · Shift+Enter new line</div>
      </div>
    </div>
  );
}

export default App;
