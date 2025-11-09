# JB Logistics Professional Website

A modern, responsive logistics website built with React, TypeScript, and Tailwind CSS. This professional website showcases JB Logistics' comprehensive delivery services across Nigeria.

## 🚀 Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Optimized for all devices (mobile, tablet, desktop)
- **Authentication System**: User registration and login with Supabase
- **Service Pages**: Detailed pages for all logistics services
- **Real-time Tracking**: Package tracking functionality
- **Contact Forms**: Multiple contact and booking forms
- **Dashboard**: User profile and shipment management

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Authentication, Database)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Ready for Vercel, Netlify, or similar platforms

## 📦 Services Offered

1. **Local Bike Delivery** - Same-day delivery within Port Harcourt
2. **Nationwide Delivery** - Interstate shipping to all 36 states
3. **Express Delivery** - Ultra-fast 1-2 hour delivery service
4. **Special Services** - COD and emergency delivery options

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── services/        # Service-specific pages
│   └── ...              # Other components
├── contexts/            # React contexts (Auth)
├── lib/                 # Utilities and configurations
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for backend services)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/jb-logistics-website.git
cd jb-logistics-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🗄️ Database Setup

The project uses Supabase for authentication and data storage. Run the included migrations to set up the database schema:

1. Set up Supabase project
2. Run the migration files in `supabase/migrations/`
3. Configure Row Level Security (RLS) policies

## 📱 Key Pages

- **Home** (`/`) - Landing page with hero section and service overview
- **Services** (`/services`) - Main services page with all delivery options
- **About** (`/about`) - Company information and story
- **Contact** (`/services/contact`) - Contact forms and information
- **Dashboard** (`/dashboard`) - User profile and shipment management
- **Tracking** (`/services/tracking`) - Package tracking functionality

## 🎨 Design Features

- **Professional Color Scheme**: Amber/yellow primary with complementary colors
- **Smooth Animations**: CSS animations and transitions
- **Mobile-First**: Responsive design optimized for all screen sizes
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Performance**: Optimized images and lazy loading

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**JB Logistics**
- Website: [Your Website URL]
- Email: info@jblogistics.ng
- Phone: +234 (0) 802 123 4567
- Location: Port Harcourt, Rivers State, Nigeria

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for Nigerian logistics market
- Optimized for performance and user experience

---

**"On time, every time"** - JB Logistics