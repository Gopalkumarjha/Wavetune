# 🎵 WaveTune — Music Streaming App

A full-stack music streaming web application built with React, Node.js, Express, and MongoDB.

---

## 🚀 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Audio | HTML5 Audio API |
| Routing | React Router v6 |
| State | Context API |
| Icons | React Icons |
| Notifications | React Hot Toast |

---

## ✨ Features

- 🎵 Stream music freely (no premium restrictions)
- 🔍 Real-time search by song, artist, album
- 💜 Like/unlike songs
- 📋 Create and manage playlists
- 🕐 Recently played tracking
- 🔀 Shuffle & repeat modes
- 📱 Fully responsive (mobile + desktop)
- 🌙 Dark theme with glassmorphism effects
- 🎨 Animated music player with equalizer
- 🔔 Toast notifications
- 🔐 JWT Authentication

---

## 📁 Folder Structure

```
wavetune/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── cards/      # SongCard, SongRow
│   │   │   ├── common/     # LoadingSpinner, SectionHeader, MobileNav
│   │   │   ├── layout/     # Sidebar, Layout
│   │   │   └── player/     # MusicPlayer
│   │   ├── context/        # AuthContext, PlayerContext
│   │   ├── pages/          # Home, Search, Library, LikedSongs, Playlist, Login, Register
│   │   └── utils/          # api.js (axios helpers)
│   └── ...
│
└── server/                 # Express backend
    ├── models/             # User, Song, Playlist (Mongoose schemas)
    ├── routes/             # auth, songs, playlists, users
    ├── middleware/         # JWT auth middleware
    ├── seed.js             # Populate DB with sample songs
    └── index.js            # Entry point
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Git

---

### 1. Clone & Install

```bash
# Clone the repo
git clone <your-repo-url>
cd wavetune

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### 2. Configure Environment

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/wavetune
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173
```

---

### 3. Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas — paste your connection string in .env
```

---

### 4. Seed the Database

```bash
cd server
npm run seed
# Adds 12 sample songs with cover art and audio URLs
```

---

### 5. Start the App

**Terminal 1 — Backend:**
```bash
cd server
npm run dev    # Uses nodemon for hot-reload
# Server runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Songs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/songs` | Get all songs (supports `?search=` & `?genre=`) |
| GET | `/api/songs/trending` | Get trending songs |
| GET | `/api/songs/featured` | Get featured songs |
| GET | `/api/songs/:id` | Get single song |
| POST | `/api/songs/:id/play` | Increment play count (auth) |
| POST | `/api/songs/:id/like` | Toggle like (auth) |

### Playlists
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/playlists` | Get user playlists (auth) |
| POST | `/api/playlists` | Create playlist (auth) |
| GET | `/api/playlists/:id` | Get playlist details |
| PUT | `/api/playlists/:id` | Update playlist (auth) |
| DELETE | `/api/playlists/:id` | Delete playlist (auth) |
| POST | `/api/playlists/:id/songs` | Add song to playlist (auth) |
| DELETE | `/api/playlists/:id/songs/:songId` | Remove song (auth) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/liked-songs` | Get liked songs (auth) |
| GET | `/api/users/recently-played` | Get recent plays (auth) |

---

## 🎨 Adding Your Own Songs

Edit `server/seed.js` and add entries:
```javascript
{
  title: "My Song",
  artist: "My Artist",
  album: "My Album",
  genre: "Electronic",
  duration: 210,          // seconds
  coverImage: "https://...",  // image URL or leave empty
  audioUrl: "https://...",    // MP3 URL (local or remote)
  trending: true
}
```

Or upload local MP3s to `server/uploads/audio/` and set `audioUrl: "/uploads/audio/mysong.mp3"`.

---

## 🔧 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the dist/ folder
```

### Backend (Railway/Render)
```bash
cd server
# Set MONGO_URI to your Atlas connection string
# Set JWT_SECRET to a strong random string
# Deploy server/ folder
```

---

## 📝 License

MIT — Free to use for learning and portfolio projects.

---

Built with ❤️ for learning full-stack development.
