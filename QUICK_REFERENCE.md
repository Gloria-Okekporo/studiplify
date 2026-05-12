# Studiplify - Quick Reference & Implementation Guide

## 🚀 QUICK START COMMANDS

### Initialize Next.js Project
```bash
npx create-next-app@latest studiplify --typescript --tailwind --eslint
cd studiplify
```

### Install Dependencies
```bash
npm install @supabase/supabase-js framer-motion resend @tanstack/react-query zustand
npm install -D @types/node tailwindcss postcss autoprefixer
```

### Environment Variables (.env.local)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SECRET_KEY=your_secret_key_here

# Resend
NEXT_PUBLIC_RESEND_KEY=re_Y3oAJ66r_M9dCcpatmk27wkRS37yhUFPt

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Start Development Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📁 FOLDER STRUCTURE

```
studiplify/
├── app/
│   ├── layout.tsx (Root layout)
│   ├── page.tsx (Landing page /)
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── verify-email/page.tsx
│   │   └── reset-password/page.tsx
│   ├── onboarding/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── study-plan/page.tsx
│   │   ├── tasks/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── focus/page.tsx
│   │   ├── notifications/page.tsx
│   │   ├── reports/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── auth/route.ts
│       ├── tasks/route.ts
│       ├── plans/route.ts
│       └── analytics/route.ts
│
├── components/
│   ├── Auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignUpForm.tsx
│   │   ├── PasswordStrengthMeter.tsx
│   │   └── OAuthButtons.tsx
│   ├── Dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   ├── Widgets/
│   │   │   ├── WelcomeCard.tsx
│   │   │   ├── ProgressCards.tsx
│   │   │   ├── StudyPlanPreview.tsx
│   │   │   └── ProductivityChart.tsx
│   │   └── Layout.tsx
│   ├── Tasks/
│   │   ├── KanbanBoard.tsx
│   │   ├── TaskCard.tsx
│   │   └── TaskModal.tsx
│   ├── Common/
│   │   ├── Toast/Toast.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── FormInput.tsx
│   │   ├── Button.tsx
│   │   └── Modal.tsx
│   └── Animations/
│       ├── FadeIn.tsx
│       ├── SlideIn.tsx
│       └── StaggerContainer.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useFormValidation.ts
│   ├── useToast.ts
│   ├── usePasswordStrength.ts
│   ├── useRateLimit.ts
│   └── useLocalStorage.ts
│
├── lib/
│   ├── supabase-client.ts
│   ├── supabase-server.ts
│   └── validation-rules.ts
│
├── utils/
│   ├── validation.ts (Email, password, etc.)
│   ├── csrf.ts
│   ├── rateLimit.ts
│   ├── constants.ts
│   ├── animations.ts
│   └── helpers.ts
│
├── types/
│   ├── auth.ts
│   ├── database.ts
│   ├── api.ts
│   └── index.ts
│
├── styles/
│   ├── globals.css
│   ├── animations.css
│   └── variables.css
│
├── public/
│   ├── images/
│   └── icons/
│
├── tailwind.config.js (Custom design system)
├── tsconfig.json
├── next.config.js
├── package.json
└── .env.local (NOT in git)
```

---

## 🎨 TAILWIND CONFIG TEMPLATE

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          container: '#EEF2FF',
          light: '#818CF8',
          dark: '#3730A3',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          container: '#F3E8FF',
        },
        tertiary: {
          DEFAULT: '#06B6D4',
          container: '#CFFAFE',
        },
        background: '#0F172A',
        surface: {
          DEFAULT: '#1E293B',
          container: '#334155',
          'container-low': '#1E293B',
          variant: '#475569',
        },
        error: '#EF5350',
        success: '#43A047',
        warning: '#FB8C00',
      },
      fontFamily: {
        'body-md': ['Manrope', 'sans-serif'],
        'display': ['Space Grotesk', 'sans-serif'],
      },
      fontSize: {
        'h1': ['2.5rem', { lineHeight: '1.2' }],
        'h2': ['2rem', { lineHeight: '1.3' }],
        'h3': ['1.5rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body-md': ['1rem', { lineHeight: '1.5' }],
        'label-sm': ['0.875rem', { lineHeight: '1.25' }],
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        'margin': '1.5rem',
      },
      backgroundImage: {
        'mesh': 'radial-gradient(at 40% 20%, #4F46E5 0px, transparent 50%), radial-gradient(at 130% 70%, #7C3AED 0px, transparent 50%)',
      },
      backdropBlur: {
        'xl': '20px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
```

---

## 🔐 SUPABASE SCHEMA SQL

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  study_level TEXT,
  preferred_hours INTEGER DEFAULT 2,
  study_style TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Study Plans
CREATE TABLE study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  weekly_hours INTEGER DEFAULT 10,
  subjects TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  study_plan_id UUID REFERENCES study_plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority TEXT DEFAULT 'medium', -- low, medium, high
  status TEXT DEFAULT 'todo', -- todo, in_progress, completed
  due_date TIMESTAMP,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Focus Sessions
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id),
  duration_minutes INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  distractions_count INTEGER DEFAULT 0,
  notes TEXT,
  session_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Productivity Logs
CREATE TABLE productivity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_study_minutes INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  subjects TEXT[] DEFAULT '{}',
  focus_score INTEGER, -- 0-100
  mood TEXT, -- excellent, good, okay, poor
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- reminder, achievement, insight
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE productivity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow users to only see their own data)
CREATE POLICY "Users can see their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can see their own plans" ON study_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can see their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Similar policies for other tables...
```

---

## 📝 COMPONENT TEMPLATES

### Login Form Component
```typescript
// components/Auth/LoginForm.tsx
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import FormInput from '@/components/Common/FormInput';
import { useToast } from '@/hooks/useToast';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();

  const validateForm = () => {
    const newErrors: any = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Login successful!', 'success');
    } catch (error) {
      showToast('Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-md">
      <FormInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        placeholder="alex@studiplify.ai"
      />
      <FormInput
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        placeholder="••••••••"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary-container to-secondary-container py-sm rounded-lg font-label-sm text-label-sm text-white disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

### Toast Notification Component
```typescript
// components/Common/Toast.tsx
import { motion, AnimatePresence } from 'framer-motion';

export interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

export function Toast({ id, message, type, duration = 3000 }: ToastProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`glass-card p-md rounded-xl flex items-center gap-md ${
        type === 'success' ? 'border-l-4 border-success' :
        type === 'error' ? 'border-l-4 border-error' :
        'border-l-4 border-primary'
      }`}
    >
      <span className="material-symbols-outlined">
        {type === 'success' ? 'check_circle' : 
         type === 'error' ? 'error' : 'info'}
      </span>
      <p className="font-body-md">{message}</p>
    </motion.div>
  );
}
```

### Form Input Component with Validation
```typescript
// components/Common/FormInput.tsx
interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  icon?: string;
  showToggle?: boolean;
  onToggle?: () => void;
}

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  icon,
  showToggle,
  onToggle,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-xs">
      <label className="font-label-sm text-label-sm text-on-surface-variant block ml-1">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            {icon}
          </span>
        )}
        <input
          type={showPassword && type === 'password' ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-surface-container border rounded-lg py-sm px-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
            error ? 'border-error' : 'border-outline-variant focus:border-primary'
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
        />
        {showToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-sm top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        )}
        {!error && value && (
          <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-success">
            check_circle
          </span>
        )}
      </div>
      {error && (
        <p className="font-label-sm text-label-sm text-error ml-1" id={`${label}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
```

---

## 🔗 API ROUTES STRUCTURE

### POST /api/auth/signup
```typescript
// app/api/auth/signup/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { email, password, fullName } = await request.json();
  
  // Validate input
  // Create user in Supabase
  // Send verification email with Resend
  // Return response
}
```

### POST /api/auth/login
```typescript
// app/api/auth/login/route.ts
export async function POST(request: Request) {
  const { email, password, rememberMe } = await request.json();
  
  // Authenticate with Supabase
  // Create session
  // If rememberMe, set long-lived cookie
  // Return session token
}
```

### POST /api/tasks
```typescript
// app/api/tasks/route.ts
export async function POST(request: Request) {
  const { title, description, priority, dueDate } = await request.json();
  
  // Get user from auth
  // Insert task into database
  // Return created task
}
```

---

## ✨ ANIMATION PATTERNS

### Page Transition
```typescript
import { motion } from 'framer-motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### Stagger List Animation
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {/* item content */}
    </motion.div>
  ))}
</motion.div>
```

---

## 🧪 TESTING CHECKLIST

### Authentication
- [ ] Signup with valid email and password
- [ ] Signup with weak password (rejected)
- [ ] Signup with duplicate email (rejected)
- [ ] Password confirmation mismatch (rejected)
- [ ] Email verification email sent
- [ ] Email verification link works
- [ ] Login with correct credentials
- [ ] Login with wrong password (rejected)
- [ ] Remember me works
- [ ] Session persists
- [ ] Logout clears session

### Form Validation
- [ ] Real-time validation on input
- [ ] Error messages display
- [ ] Success checkmarks appear
- [ ] Form submit disabled with errors
- [ ] Error cleared on input change

### Accessibility
- [ ] Tab navigation works
- [ ] Enter key submits form
- [ ] ARIA labels announced
- [ ] Error messages linked to inputs
- [ ] Focus visible always
- [ ] Screen reader compatible

### Performance
- [ ] Forms load in <2s
- [ ] Images optimized
- [ ] No layout shift
- [ ] Animations at 60fps
- [ ] Bundle size < 300KB

---

## 📚 RESOURCES & DOCUMENTATION

- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/
- TypeScript: https://www.typescriptlang.org/docs
- Material Icons: https://fonts.google.com/icons
- Resend: https://resend.com/docs

---

## 🎯 NEXT IMMEDIATE ACTIONS

1. ✅ Review this quick reference guide
2. ✅ Review plan.md for complete checklist
3. ✅ Review Criblist.txt for UI improvements
4. ⏳ Initialize Next.js project
5. ⏳ Copy Tailwind config from this guide
6. ⏳ Set up Supabase and run SQL schema
7. ⏳ Create folder structure
8. ⏳ Build Auth components
9. ⏳ Integrate API routes
10. ⏳ Deploy and test

---

**Last Updated:** May 8, 2026  
**Version:** 1.0 - Complete Implementation Guide
