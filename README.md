# Marketing Banner Generator 🎨

An AI-powered web application that generates professional social media banners for various platforms including Instagram, LinkedIn, Twitter, and Facebook.

## 🚀 Features

- **AI Design Suggestions**: Get intelligent design recommendations based on your content, platform, and target audience
- **Multi-Platform Support**: Perfect banner sizes for Instagram, LinkedIn, Twitter, Facebook
- **Simple Editor**: Easy-to-use interface to customize colors, fonts, and layouts
- **User Authentication**: Secure login and registration system
- **Banner Management**: Save, organize, edit, and download your banners
- **Fast Generation**: Create professional banners in under 5 seconds

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- SQLite database
- OpenAI API for AI suggestions
- Canvas API for image generation
- JWT authentication

**Frontend:**
- React.js
- React Router for navigation
- Axios for API calls
- React Toastify for notifications

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BitRoot Part-2
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment setup**
   - Create new .env in project Copy below `.env` file:
```
   # Environment Variables folder
NODE_ENV=development
PORT=5000

# Database
DB_PATH=./database.sqlite

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI API Key (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY= your key

# Unsplash API Key (get from https://unsplash.com/developers)
UNSPLASH_ACCESS_KEY= your access key

# App Settings
FRONTEND_URL=http://localhost:3000
```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Backend will run on http://localhost:5000

2. **Start the frontend (in a new terminal):**
   ```bash
   cd client
   npm start
   ```
   Frontend will run on http://localhost:3000

### Production Mode

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

## 📱 Platform Specifications

The application supports these social media platforms with optimal dimensions:

- **Instagram Post**: 1080x1080px
- **Instagram Story**: 1080x1920px  
- **LinkedIn Post**: 1200x627px
- **Twitter/X Post**: 1200x675px
- **Facebook Post**: 1200x630px

## 🎯 How It Works

1. **Tell us what you need**: Describe your banner purpose, choose platform, and specify target audience
2. **AI creates designs**: Our AI analyzes requirements and generates multiple professional design options
3. **Customize & download**: Edit colors, text, and elements to match your brand, then download in high quality

## 📁 Project Structure

```
/
├── server.js              # Main server file
├── database.js            # Database setup and queries
├── package.json           # Backend dependencies
├── .env                   # Environment variables
├── middleware/
│   └── auth.js           # Authentication middleware
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── banners.js        # Banner CRUD routes
│   └── ai.js             # AI service routes
├── services/
│   ├── aiService.js      # OpenAI integration
│   └── bannerGenerator.js # Canvas-based banner generation
├── public/
│   └── banners/          # Generated banner images
└── client/               # React frontend
    ├── package.json      # Frontend dependencies
    ├── public/
    └── src/
        ├── components/   # Reusable components
        ├── contexts/     # React contexts
        ├── pages/        # Page components
        ├── services/     # API services
        └── App.js        # Main app component
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Banners
- `GET /api/banners` - Get user's banners
- `POST /api/banners` - Create new banner
- `GET /api/banners/:id` - Get specific banner
- `PUT /api/banners/:id` - Update banner
- `DELETE /api/banners/:id` - Delete banner
- `GET /api/banners/specs/platforms` - Get platform specifications

### AI Services
- `POST /api/ai/design-suggestions` - Generate design suggestions
- `POST /api/ai/optimize-text` - Optimize text for platform

## 🎨 Features in Detail

### AI Design Generation
- Analyzes user requirements (purpose, platform, audience)
- Generates multiple design variations
- Suggests appropriate color schemes and fonts
- Provides layout recommendations

### Banner Editor
- Color palette customization
- Text editing and formatting
- Real-time preview
- Design template selection

### User Management
- Secure authentication with JWT
- Personal banner library
- Design history and organization

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
DB_PATH=./database.sqlite
JWT_SECRET=secure-production-jwt-secret
OPENAI_API_KEY=your-openai-api-key
```

### Quick Deploy Commands
```bash
# Build frontend
npm run build

# Start production server
npm start
```

##Demo Video
https://github.com/user-attachments/assets/8de4cab4-33e5-4a43-8e56-319f3051fb25

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👥 Devloped By

**Manish Bhavar:** mbhavar2121@gmail.com

## 🆘 Support

For support or questions:
1. Check the documentation
2. Create an issue on GitHub
3. Contact the development team

---

**Happy Banner Creating!** 🎨✨
