# Linkora Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

🚀 **Linkora Dashboard** is the admin and analytics interface for the Linkora platform.  
It is built with **Next.js**, **Tailwind CSS**, **TypeScript**, **Firebase Auth**, and **ShadCN UI**, with **Lucide icons** for visuals.  
Tools like **VS Code**, **Copilot**, and **AI models (Claude Sonnet 4 & ChatGPT)** were used to fix bugs and optimize development.

**🌐 Live Demo**: [https://linkora-ui-dashboard.vercel.app](https://linkora-ui-dashboard.vercel.app)

---

## 🎯 Features

- 🔐 Secure authentication via **Firebase Auth**
- 🎨 Interactive, responsive UI with **ShadCN UI components**  
- ✨ Beautiful icons via **Lucide React**  
- 📊 Data visualization & analytics using **Recharts**  
- 📝 Forms management via **React Hook Form**  
- 🎭 Optimized animations and UI using **Tailwind CSS** and **Tailwind Merge**  
- 🔢 OTP inputs, date pickers, carousels, and resizable panels  
- 🤖 Bug fixes and AI-assisted improvements with **Claude Sonnet 4** and **ChatGPT**

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend Framework** | Next.js 14 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS, Tailwind Animations |
| **UI Components** | ShadCN UI, Radix UI packages |
| **Icons** | Lucide React |
| **Forms & Validation** | React Hook Form, Zod |
| **Charts** | Recharts |
| **State & Themes** | Next-Themes, Vaul |
| **Notifications** | Sonner |
| **Backend & Auth** | Firebase Auth, Firebase Admin SDK |
| **Development Tools** | VS Code, Postman, ESLint, GitHub Copilot |

---

## 📂 Project Structure

```
my-v0-project/
├── public/                 # Static assets (images, logos, icons)
├── src/
│   ├── app/               # Next.js app router
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities & helpers
│   ├── styles/            # Global CSS & Tailwind setup
│   ├── types/             # TypeScript types
│   └── pages/             # Next.js pages
├── .env.local             # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/ATgayan/linkora-ui-dashboard.git
cd linkora-ui-dashboard
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBQ255kzjhaeC2S7hlcj8Tb72yV-ybdyRM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=linkora-48d67.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=linkora-48d67
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=linkora-48d67.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=34841223271
NEXT_PUBLIC_FIREBASE_APP_ID=1:34841223271:web:77e5db106ca176336834c2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-RT7FLNN8R1

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
# Production API URL: https://linkora-egb3hmhrhhf9ebes.southeastasia-01.azurewebsites.net/api/v1

# Stream API Configuration
NEXT_PUBLIC_STREAM_API_KEY=d92fr86phfc6
```

> 🔒 **Security Note**: These are development environment variables. In production, ensure all sensitive keys are properly secured and rotated regularly.

### 4️⃣ Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the dashboard locally.

### 5️⃣ Build for Production

```bash
npm run build
npm start
```

---

## 🖼️ Screenshots

| Dashboard | Manage Users | Report |
|-----------|-------------|--------|
| ![Dashboard](https://github.com/user-attachments/assets/13710762-ae10-4785-9717-118b66c6969a) | ![Manage Users](https://github.com/user-attachments/assets/f22b192c-fde5-4e43-8bcf-48334e597b91) | ![Report](https://github.com/user-attachments/assets/3ae22911-9ae6-4fd8-9942-b54b725f4fb9) |

---

## 🚀 Deployment

- **Current Deployment**: [Vercel](https://linkora-ui-dashboard.vercel.app)
- **Environment Setup**: Set environment variables in Vercel Project Settings
- **Alternative Platforms**: Azure App Service, Render, Fly.io (follow similar env setup)

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ATgayan/linkora-ui-dashboard)

---

## 🛡️ Security Features

- ✅ Firebase Authentication integration
- ✅ Protected routes and middleware
- ✅ Environment variable protection
- ✅ TypeScript for type safety
- ✅ ESLint for code quality

---

## 🎨 UI Components

- **Form Elements**: Input fields, dropdowns, checkboxes
- **Data Display**: Tables, cards, charts (Recharts)
- **Navigation**: Breadcrumbs, pagination, tabs
- **Feedback**: Notifications (Sonner), loading states
- **Interactive**: Modals, drawers, tooltips

---

## 🤖 AI-Assisted Development

This project leverages AI tools for enhanced development:

- **Claude Sonnet 4**: Bug fixing, code optimization, architecture decisions
- **ChatGPT**: Feature implementation, documentation, problem-solving
- **GitHub Copilot**: Code completion and suggestions

---

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Tablet and desktop optimization  
- ✅ Dark/light theme support
- ✅ Accessibility best practices

---

## 🧪 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript checks |

---

## 👥 Team & Contributors

| Name | Role | GitHub | Contact |
|------|------|--------|---------|
| **Thushitha Gayan** | Full-Stack Developer | [@ATgayan](https://github.com/ATgayan) | Full-stack architecture & development lead |
| **Hasith Randitha** | Frontend Developer | [@randitha04](https://github.com/randitha04) | Frontend architecture & UI development |
| **Imalka Dilakshan** | Backend Developer | [@ImalkaDilakshan99](https://github.com/ImalkaDilakshan99) | API development & server integration |
| **Daniru Dayarathna** | UI Designer | [@danirudayarathna](https://github.com/danirudayarathna) | Design system & user experience |
| **Devindi Chathurika** | Project Manager | [@Devindichathurika03](https://github.com/Devindichathurika03) | Project coordination & team management |

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

---

## 📚 References & Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [ShadCN UI](https://ui.shadcn.com/)
- [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- [Radix UI Components](https://www.radix-ui.com/)
- [Claude AI](https://claude.ai/)
- [ChatGPT](https://chat.openai.com/)

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ by the Linkora Team**
