# ✨ PromptVibe

Transform your rough website ideas into polished, detailed prompts with AI-powered refinement.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)

## 🚀 Features

- **AI-Powered Prompt Refinement** - Transform rough ideas into detailed, actionable prompts
- **Real-time Streaming** - Watch your refined prompt generate in real-time with SSE
- **Markdown Rendering** - Beautiful formatted output with syntax highlighting
- **History Panel** - Access your recent refinements with expand/collapse views
- **Anonymous Sessions** - No sign-up required, visitor-based history tracking
- **Dark Mode UI** - Stunning neon green accents with glassmorphism effects

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + Typography Plugin |
| **UI Components** | shadcn/ui + Framer Motion |
| **Database** | MongoDB + Mongoose |
| **AI** | OpenAI GPT-4o-mini |
| **Markdown** | react-markdown |

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/promptvibe.git
   cd promptvibe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your actual values.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key for GPT-4o-mini |
| `MONGODB_URI` | MongoDB connection string |

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── refine/route.ts    # AI refinement endpoint (streaming)
│   │   └── history/route.ts   # User history endpoint
│   ├── globals.css            # Global styles + Tailwind config
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page component
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── HeroSection.tsx        # Landing hero section
│   ├── PromptInput.tsx        # User input form
│   ├── RefinedResult.tsx      # AI output with markdown
│   └── RecentRefinements.tsx  # History slide-over panel
└── lib/
    ├── models/                # Mongoose models
    ├── mongodb.ts             # Database connection
    └── visitor.ts             # Visitor ID utilities
```

## 🎨 Design

- **Color Palette**: Dark theme with neon emerald (#00ff88) accents
- **Effects**: Glassmorphism cards, blur backgrounds, glow effects
- **Animations**: Smooth transitions with Framer Motion
- **Typography**: Geist font family with prose styling

## 📜 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📄 License

MIT License - feel free to use this project for your own purposes.
