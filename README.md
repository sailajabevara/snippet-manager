# 🚀 Code Snippet Manager

A full-featured **Code Snippet Manager** built with React and Monaco Editor. This application allows users to create, manage, and share code snippets efficiently with GitHub Gist integration, backup & restore functionality, and Docker support.

---

##  Features

- ✨ Create, edit, and delete code snippets  
- 🧠 Monaco Editor (VS Code-like experience)  
- 🔍 Search snippets instantly  
- 📋 Copy code to clipboard  
- 🌗 Light/Dark theme toggle  
- 🌐 GitHub Gist Integration  
  - Export snippets as Gists  
  - Import snippets using Gist URL  
- 💾 Backup & Restore (Download & Upload JSON)  
- 🧭 Routing with React Router  
- 🐳 Docker support  

---

## 🛠️ Tech Stack

- React (Vite)
- Tailwind CSS
- Monaco Editor
- GitHub Gist API
- Docker & Docker Compose

---

## 📦 Installation (Local Setup)

```bash
git clone https://github.com/your-username/snippet-manager.git
cd snippet-manager
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GITHUB_TOKEN=your_github_personal_access_token
```

> This token is required for GitHub Gist import/export functionality.

---

## 🐳 Run with Docker

```bash
docker-compose up --build
```

Open in browser:

```
http://localhost:5173
```

---


---

## 📁 Project Structure

```
src/
 ├── pages/
 │   ├── Home.jsx
 │   └── ViewSnippet.jsx
 ├── hooks/
 │   └── useSnippets.js
 ├── App.jsx
 ├── main.jsx
```

---


---

## 💡 Key Functionalities

- Snippets stored in localStorage  
- Real-time editing using Monaco Editor  
- GitHub Gist API integration  
- Backup & restore using JSON files  
- Responsive UI with Tailwind CSS  

---

## 🎯 Future Improvements

- User authentication  
- Cloud storage (MongoDB / Firebase)  
- Snippet sharing via links  
- Advanced filtering & tags UI  

---

## 🧠 Author

**Sailaja**

---

## ⭐ Acknowledgements

- Monaco Editor  
- GitHub API  
- Vercel  
- Docker  