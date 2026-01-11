# OpenWebPlayer

A lightweight, privacy-focused IPTV web player with automatic CORS bypass. Watch live TV streams from M3U playlists or Xtream Codes providers with zero configuration.

## 🚀 Auto-Proxy Technology

OpenWebPlayer includes smart Cloudflare Functions proxy that automatically handles:
- ✅ CORS restrictions (works with any provider)
- ✅ HTTP/HTTPS conversion
- ✅ Seamless fallback (tries direct first, proxies if needed)
- ✅ Zero configuration required

### How It Works

```
User enters IPTV URL
         ↓
Try direct connection
         ↓
    ┌────┴────┐
Success?    CORS/HTTP Error?
    │              │
    ↓              ↓
Use direct    Auto-switch to
connection    CF Functions proxy
    │              │
    └──────┬───────┘
           ↓
      Stream works!
```

The player automatically detects connection issues and routes through your Cloudflare proxy when needed. Most connections work directly for best performance.

## 🔒 Privacy First

**Zero credential storage.** Your login details are:
- Stored only in browser session (cleared on tab close)
- Never sent to any server except your IPTV provider
- Not logged or stored anywhere
- Only accessible on your device

## ✨ Features

- **Dual Login Support**: M3U URL or Xtream Codes
- **Universal Compatibility**: Works with any IPTV provider (HTTP, HTTPS, CORS-restricted)
- **EPG Support**: Automatic program guide loading
- **Category Filtering**: Organized channel browsing
- **Real-time Search**: Instant channel filtering
- **Session Persistence**: Stay logged in during browsing session
- **Modern UI**: Responsive dark theme design
- **Codec Support**: Plays any format your browser supports (HLS, MPEG-DASH, etc.)

## 📋 Technology Stack

- **React** - UI framework
- **Tailwind CSS** - Utility styling (core classes only)
- **Cloudflare Functions** - Serverless CORS proxy
- **HTML5 Video** - Native browser playback
- **Session Storage** - Temporary credential storage

## 🚀 Quick Setup

### 1. Create Repository Structure

```
OpenWebPlayer/
├── functions/
│   └── proxy.js         # Cloudflare proxy (auto CORS bypass)
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

### 2. Deploy to Cloudflare Pages

#### A. Connect GitHub Repository

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Workers & Pages** → **Create Application** → **Pages**
3. Click **Connect to Git**
4. Select your repository

#### B. Configure Build Settings

| Setting | Value |
|---------|-------|
| Framework preset | `Create React App` |
| Build command | `npm run build` |
| Build output directory | `build` |

#### C. Deploy

Click **Save and Deploy**. Your player will be live at `your-project.pages.dev` in 2-3 minutes.

The Cloudflare Functions proxy at `/functions/proxy.js` is automatically deployed and requires no additional configuration.

## 📖 Usage

1. Visit your deployed URL
2. Choose login method:
   - **M3U URL**: Paste your playlist URL
   - **Xtream Codes**: Enter server URL, username, password
3. Browse channels by category or search
4. Click any channel to start watching
5. Session persists until you logout or close the browser

## 🔧 Alternative Deployment Options

### Vercel
1. Import from GitHub
2. Framework: Create React App
3. Deploy (Functions work as Serverless Functions)

### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `build`
4. Functions folder: `functions`

### Self-Hosting
```bash
git clone https://github.com/yourusername/OpenWebPlayer.git
cd OpenWebPlayer
npm install
npm run build
# Serve the 'build' folder with any web server
```

For self-hosting, you'll need to set up your own CORS proxy or the functions won't work.

## 🔧 Troubleshooting

### "Build failed: React Hook missing dependencies"
**Fix**: Make sure `src/App.js` includes the `eslint-disable-next-line` comment in the useEffect hook.

### "Mixed Content Error" or "CORS blocked"
**Status**: ✅ Automatically handled by the proxy. If you see these errors:
1. Clear browser cache
2. Make sure `functions/proxy.js` exists in your repository
3. Check Cloudflare Dashboard → Your Project → Functions tab

### Channels won't load
**Try**:
1. Check if your M3U URL or Xtream credentials are correct
2. Test the URL in a native IPTV app first
3. Check browser console (F12) for specific errors
4. Verify the Cloudflare Function deployed successfully

### Video won't play
**Common causes**:
- Stream format not supported by browser (try Chrome/Edge for best compatibility)
- Stream URL requires authentication you haven't provided
- Geographic restrictions on the stream

### Performance issues
The proxy adds minimal overhead (~50-100ms). If streams are slow:
1. Check your internet connection
2. Try a different IPTV provider/server
3. The issue is likely with the stream source, not the player

## 🌐 Browser Compatibility

| Browser | HLS Support | MPEG-DASH | Notes |
|---------|-------------|-----------|-------|
| Chrome 90+ | ✅ | ✅ | Best compatibility |
| Edge 90+ | ✅ | ✅ | Best compatibility |
| Safari 14+ | ✅ Native | ✅ | Best for HLS streams |
| Firefox 88+ | ⚠️ Limited | ✅ | May need format conversion |

## 💻 Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/OpenWebPlayer.git
cd OpenWebPlayer

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

**Note**: The Cloudflare Functions proxy won't work locally. For local testing with CORS-restricted providers, use a browser extension like "CORS Unblock".

## 📄 License

**MIT License with Commercial Restriction**

✅ **You CAN**:
- Use for personal or commercial purposes
- Modify and customize the code
- Fork and redistribute
- Host your own instances

❌ **You CANNOT**:
- Sell this software
- Charge for access to hosted instances
- Remove copyright notices

Copyright (c) 2025 OpenWebPlayer Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

**THE SOFTWARE MAY NOT BE SOLD, AND ACCESS TO THE SOFTWARE OR SERVICES BASED ON THE SOFTWARE MAY NOT BE SOLD OR LICENSED FOR A FEE.**

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

## ⚖️ Legal Notice

This is a player interface only. Users are responsible for ensuring they have legal rights to access any IPTV services. The developers are not responsible for how this software is used.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

For bugs or feature requests, open an issue on GitHub.

## 📞 Support

- **Issues**: Open a GitHub issue
- **Questions**: Check existing issues or start a discussion
- **Provider Problems**: Contact your IPTV provider first

---

**Made with ❤️ for the open-source community**