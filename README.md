# OpenWebPlayer

A lightweight, privacy-focused IPTV web player that runs entirely in your browser. Watch live TV streams from M3U playlists or Xtream Codes providers with a clean, modern interface.

## 🔒 Privacy First

**OpenWebPlayer stores NO login credentials.** Your M3U URLs and Xtream Codes credentials are stored only in your browser's session storage and are:
- Never sent to any server (except your IPTV provider)
- Automatically cleared when you close the browser tab
- Only accessible to you on your device
- Not stored permanently anywhere

## ✨ Features

- **Dual Login Support**: Connect via M3U URL or Xtream Codes
- **EPG Support**: Automatic Electronic Program Guide loading when available
- **Category Filtering**: Organize channels by categories
- **Real-time Search**: Instantly find channels by name
- **Session Persistence**: Stay logged in during your browsing session
- **Clean UI**: Modern, responsive design with dark theme
- **Codec Support**: Plays any format your browser supports (HLS, MPEG-DASH, etc.)

## 🛠️ Technology Stack

- **React**: UI framework for component-based architecture
- **Tailwind CSS**: Utility-first styling for responsive design
- **Lucide React**: Beautiful icon library
- **HTML5 Video**: Native browser video player
- **Session Storage**: Browser-based temporary credential storage
- **No Backend Required**: Runs entirely client-side

## 🚀 Deployment Options

### Option 1: Cloudflare Pages (Recommended)

1. **Fork this Repository**
   - Click "Fork" on GitHub to create your own copy

2. **Connect to Cloudflare Pages**
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Go to "Workers & Pages" → "Create Application" → "Pages"
   - Connect your GitHub account
   - Select your forked repository

3. **Configure Build Settings**
   - Framework preset: `Create React App` or `React`
   - Build command: `npm run build`
   - Build output directory: `build`

4. **Deploy**
   - Click "Save and Deploy"
   - Your player will be live at `your-project.pages.dev`

### Option 2: Self-Hosting

**Requirements:**
- Node.js 16+ and npm

**Steps:**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/openwebplayer.git
   cd openwebplayer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Serve the build folder**
   
   Using a simple static server:
   ```bash
   npx serve -s build
   ```
   
   Or use any web server (nginx, Apache, etc.) to serve the `build` directory.

### Option 3: Vercel, Netlify, GitHub Pages

OpenWebPlayer works with any static hosting service:

- **Vercel**: Import from GitHub, auto-detects React settings
- **Netlify**: Drag and drop `build` folder or connect to Git
- **GitHub Pages**: Push `build` folder to `gh-pages` branch

## 📖 Usage

1. **Access the player** in your browser
2. **Choose login method**:
   - **M3U URL**: Paste your playlist URL
   - **Xtream Codes**: Enter server URL, username, and password
3. **Browse channels** by category or search by name
4. **Click a channel** to start watching
5. **Session persists** until you logout or close the tab

## 🎨 Customization

The player is built with Tailwind CSS. To customize:

1. Edit the component in `src/OpenWebPlayer.jsx`
2. Modify Tailwind classes for colors, spacing, etc.
3. Rebuild the project

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📋 Browser Compatibility

OpenWebPlayer supports all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Note**: Codec support depends on your browser. HLS streams work best on Safari and Edge. Firefox and Chrome may require the stream to be in a supported format or use MSE.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

**OpenWebPlayer is free and open-source software.**

### Terms of Use:

✅ **You CAN**:
- Use this software for personal or commercial purposes
- Modify and customize the code
- Fork and redistribute the code
- Host your own instances

❌ **You CANNOT**:
- Sell this software or charge for its use
- Sell access to instances of this software
- Claim this software as your own creation

### MIT License with Commercial Restriction

Copyright (c) 2025 OpenWebPlayer Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

**The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.**

**THE SOFTWARE MAY NOT BE SOLD, AND ACCESS TO THE SOFTWARE OR SERVICES BASED ON THE SOFTWARE MAY NOT BE SOLD OR LICENSED FOR A FEE.**

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## 🆘 Support

For issues, questions, or feature requests, please open an issue on GitHub.

## ⚖️ Legal Notice

This software is a player interface only. You are responsible for ensuring you have the legal right to access any IPTV services you connect to. OpenWebPlayer developers are not responsible for how you use this software.

---

**Made with ❤️ for the open-source community**
