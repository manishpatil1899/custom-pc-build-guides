# Online Custom PC Build Guides Website

A comprehensive web application for PC enthusiasts to build, configure, and share custom PC builds with real-time compatibility checking and detailed build guides.

## 🚀 Features

- **Interactive PC Configurator**: Step-by-step component selection with real-time compatibility checking
- **Build Guides**: Comprehensive guides for different use cases (gaming, workstation, budget builds)
- **Compatibility Checker**: Automatic validation of component combinations
- **Build Sharing**: Save and share custom PC builds with the community
- **Price Tracking**: Compare prices across multiple retailers (planned feature)
- **User Profiles**: Save favorite builds and track build history

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with TypeScript and App Router
- **Tailwind CSS** for styling
- **React Components** for interactive UI
- **Responsive Design** for mobile compatibility

### Backend
- **Node.js** with Express.js
- **Prisma ORM** for database management
- **PostgreSQL** database
- **JWT Authentication** for user management

custom-pc-build-guides/
├── frontend/ # Next.js frontend application
├── backend/ # Express.js backend API
├── docs/ # Documentation
└── docker-compose.yml # Docker setup for development

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git for version control

### Installation

1. **Clone the repository**
git clone https://github.com/yourusername/custom-pc-build-guides.git
cd custom-pc-build-guides

text

2. **Setup Backend**
cd backend
npm install
cp .env.example .env # Configure your database URL
npx prisma migrate dev
npx prisma db seed
npm run dev

text

3. **Setup Frontend**
cd ../frontend
npm install
cp .env.local.example .env.local # Configure API URL
npm run dev

text

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 API Documentation

See [API.md](./docs/API.md) for detailed API endpoint documentation.

## 🚀 Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for deployment instructions using Vercel, Railway, or other platforms.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions or support, please open an issue on GitHub.