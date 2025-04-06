# FeedX HR 🚀

AI-powered workforce management for modern businesses


## ✨ Features
- **AI Analytics**: Predictive performance insights
- **360° Feedback**: Multi-rater assessments
- **Goal Tracking**: SMART objectives with progress alerts
- **Secure Auth**: JWT + OTP verification

## 🛠️ Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/HarryOhm33/FeedX.git
   # frontend
   cd client && npm install
   # backend
   cd server && npm install

2. **Configure Environment(Backend)**
   ```bash
   ATOM_HR_BASE_URL="https://api.atomhr.com/v1"
   JWT_SECRET="your_jwt_signing_secret_here"

   MONGO_URL="mongodb+srv://user:password@cluster.mongodb.net/otp_db?retryWrites=true&w=majority"

   EMAIL_USER="your_email@gmail.com"
   EMAIL_PASSWORD="your_app_specific_password"

   GEMINI_API_KEY="your_gemini_api_key_here"


2. **Configure Environment(frontend)**
   ```bash
   REACT_APP_API_BASE_URL="https://api.yourdomain.com/v1"
   VITE_API_KEY="YOUR_VITE_API_KEY"
