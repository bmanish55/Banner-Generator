# Marketing Banner Generator 🎨

An AI-powered web application that transforms user requirements into professional social media banners. Built with modern technologies to provide a seamless 3-step workflow for creating stunning marketing materials.

## Features

- 🤖 **AI Design Generation**: Uses OpenAI GPT to generate multiple design variations based on user requirements
- 🎯 **3-Step Wizard**: Simple workflow - Requirements → AI Preview → Finalize
- 🖼️ **Image Rendering**: Puppeteer renders HTML templates into high-quality PNG images (1200x630px)
- 💾 **Banner Storage**: SQLite database stores user banners with metadata
- 🔐 **JWT Authentication**: Secure user authentication and authorization
- 📥 **Download & Store**: Save banners to database or download as PNG files

## Tech Stack

### Backend
- **Express.js**: RESTful API server
- **SQLite**: Lightweight database with better-sqlite3
- **OpenAI API**: AI-powered design generation
- **Puppeteer**: Headless browser for HTML-to-PNG rendering
- **JWT**: Secure token-based authentication
- **bcryptjs**: Password hashing

### Frontend
- **React**: UI library with hooks
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls

## Project Structure

```
Banner-Generator/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth middleware
│   │   ├── utils/             # OpenAI & Puppeteer services
│   │   └── index.js           # Express server
│   ├── public/banners/        # Generated banner images
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page components
│   │   ├── context/           # Auth context
│   │   ├── services/          # API service layer
│   │   └── main.jsx           # Entry point
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/bmanish55/Banner-Generator.git
   cd Banner-Generator
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   JWT_SECRET=your_secure_jwt_secret_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=development
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

## Usage

### Running in Development Mode

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Dev Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

3. **Access the Application**
   
   Open your browser and navigate to `http://localhost:3000`

### Creating Your First Banner

1. **Register/Login**: Create an account or login with existing credentials
2. **Step 1 - Requirements**: Enter a title and describe your banner needs (colors, theme, message)
3. **Step 2 - AI Preview**: Review AI-generated design variations and select your favorite
4. **Step 3 - Finalize**: Preview the final design and save it to your account

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

#### Banners
- `POST /api/banners/generate-designs` - Generate AI design variations
- `POST /api/banners` - Create new banner
- `GET /api/banners` - Get all user banners
- `GET /api/banners/:id` - Get specific banner
- `PUT /api/banners/:id` - Update banner
- `DELETE /api/banners/:id` - Delete banner

All banner endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Environment Variables

### Backend (`backend/.env`)
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT tokens
- `OPENAI_API_KEY`: Your OpenAI API key
- `NODE_ENV`: Environment mode (development/production)

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Banners Table
```sql
CREATE TABLE banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  requirements TEXT NOT NULL,
  design_data TEXT NOT NULL,
  image_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Manish Bhavar**

## Acknowledgments

- OpenAI for the GPT API
- Puppeteer team for the headless browser automation
- React and Express communities for excellent documentation
