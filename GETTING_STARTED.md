# Getting Started - Studiplify Dev Environment

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000 in your browser

### 3. Test the Application

**Landing Page** - http://localhost:3000
- See the hero section with features
- Click "Get Started" or "Start Free Trial"
- Test responsive design (resize browser)

**Login Page** - http://localhost:3000/auth/login
- Enter email: test@example.com
- Password: Test123!@#
- Try invalid inputs to see validation
- Click password eye icon to toggle visibility
- Check "Remember me" checkbox
- Try login (will fail without real database)
- See error toast notifications

**Sign Up Page** - http://localhost:3000/auth/signup
- Enter full name (min 2 characters)
- Enter email (must be valid format)
- Enter password (watch strength meter change):
  - Weak: Less than 8 chars, no special chars
  - Fair: 8+ chars, missing requirements
  - Good: 8+ chars, most requirements
  - Strong: 12+ chars, all requirements
- Confirm password (will show error if not matching)
- Accept terms to enable submit
- Try signup (will fail without real database)

---

## 🧪 What to Test

### Form Validation
- [ ] Try submitting empty form → See validation errors
- [ ] Enter invalid email → See error
- [ ] Enter short password → See error
- [ ] Passwords don't match → See error on confirm field
- [ ] Fix errors → See error disappear in real-time

### Password Strength Meter
- [ ] Type "pass" → Weak
- [ ] Type "pass1" → Fair
- [ ] Type "Pass1!" → Good
- [ ] Type "Pass1!@#strong" → Strong

### UX Features
- [ ] Click password eye icon → Password visibility toggles
- [ ] Tab through form → Proper tab order
- [ ] Press Enter on form → Should submit
- [ ] Click on success checkmark → See validation feedback
- [ ] Watch animations → Smooth fade-in/slide-in effects

### Responsive Design
- [ ] Desktop (1024px+) → Full layout
- [ ] Tablet (768px) → Adjusted layout
- [ ] Mobile (375px) → Stack vertically
- [ ] Resize browser → Smooth transitions

### Dark Mode
- [ ] All pages use dark theme
- [ ] Colors are clearly visible
- [ ] Contrast is good
- [ ] No harsh on eyes

### Animations
- [ ] Page load → Fade in effect
- [ ] Form fields → Slide up animation
- [ ] Cards → Glow effect on hover
- [ ] Buttons → Scale effect on click
- [ ] Toast notifications → Slide in from right

---

## 📝 File Locations Reference

### Pages
| Page | Path |
|------|------|
| Landing | `/` (app/page.tsx) |
| Login | `/auth/login` (app/auth/login/page.tsx) |
| Sign Up | `/auth/signup` (app/auth/signup/page.tsx) |

### Components
| Component | Path |
|-----------|------|
| LoginForm | components/Auth/LoginForm.tsx |
| SignUpForm | components/Auth/SignUpForm.tsx |
| FormInput | components/Common/FormInput.tsx |
| Toast | components/Common/Toast.tsx |
| PasswordStrengthMeter | components/Auth/PasswordStrengthMeter.tsx |

### Utilities
| Utility | Path |
|---------|------|
| Validation | utils/validation.ts |
| Supabase Client | lib/supabase-client.ts |
| Types | types/index.ts |

### Styles
| Style | Path |
|-------|------|
| Global CSS | styles/globals.css |
| Tailwind Config | tailwind.config.js |

---

## 🔑 Key Features to Test

### Authentication Flow
1. ✅ Email validation
2. ✅ Password strength feedback
3. ✅ Password confirmation matching
4. ✅ Password visibility toggle
5. ✅ Remember me checkbox
6. ✅ Terms acceptance required
7. ✅ Form error display
8. ✅ Loading spinner on submit
9. ✅ Rate limiting (5 attempts/15 min)
10. ✅ Responsive design

### UI Components
1. ✅ FormInput with icons
2. ✅ Toast notifications
3. ✅ Password strength meter
4. ✅ Loading spinner
5. ✅ Error messages
6. ✅ Success checkmarks
7. ✅ Animated transitions
8. ✅ Hover effects

### Design System
1. ✅ Dark mode colors
2. ✅ Glass morphism effects
3. ✅ Tailwind utilities
4. ✅ Custom animations
5. ✅ Material icons
6. ✅ Responsive breakpoints

---

## 🐛 Debugging

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Check for any errors
4. Go to Network tab to see API calls

### React DevTools
1. Install React DevTools browser extension
2. Inspect component hierarchy
3. Check props and state
4. Profile performance

### Tailwind IntelliSense
1. Install Tailwind CSS IntelliSense extension
2. Get autocomplete for Tailwind classes
3. Hover for documentation

---

## 📊 Currently Implemented

### ✅ Completed
- Landing page with features and CTA
- Login page with all improvements
- Sign up page with password strength meter
- Form validation system
- Toast notification system
- Framer Motion animations
- Supabase client setup
- TypeScript configuration
- Tailwind design system

### ⏳ Not Yet Implemented
- Database integration
- Email verification
- Password reset
- Onboarding flow
- Dashboard layout
- Study plans feature
- Tasks kanban board
- Analytics page
- Focus timer
- Settings page

### 🚧 In Progress
- Backend API routes
- Email integration with Resend

---

## 💡 Tips for Development

### Adding New Pages
```typescript
// app/new-page/page.tsx
'use client';

import { motion } from 'framer-motion';

export default function NewPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* Your content */}
    </motion.main>
  );
}
```

### Adding New Components
```typescript
// components/New/Component.tsx
'use client';

interface ComponentProps {
  title: string;
  children?: React.ReactNode;
}

export default function Component({ title, children }: ComponentProps) {
  return (
    <div className="glass-card p-lg rounded-lg">
      <h3 className="font-display text-h3">{title}</h3>
      {children}
    </div>
  );
}
```

### Using Tailwind Classes
```typescript
// Color classes
className="text-primary" // Main color
className="bg-surface-container" // Background
className="border-outline-variant" // Border

// Spacing
className="p-lg" // Padding
className="gap-md" // Gap
className="mb-sm" // Margin

// Typography
className="font-display text-h2" // Display font
className="font-body-md" // Body font
className="font-label-sm" // Label font

// Animation
className="animate-fade-in" // Fade in
className="hover:shadow-glow-lg" // Hover glow
```

---

## 📞 Environment Setup

### Required Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://studiplify.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_RESEND_KEY=YOUR_RESEND_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

All configured in `.env.local` ✅

---

## 🎯 Next Phase Tasks

### Phase 2A: Email Verification
- [ ] Build verify-email page
- [ ] Implement email verification with Resend
- [ ] Add resend email button
- [ ] Handle verification link

### Phase 2B: Password Reset
- [ ] Build reset-password page
- [ ] Implement password reset flow
- [ ] Send reset email
- [ ] Verify and update password

### Phase 2C: Onboarding
- [ ] Build onboarding multi-step form
- [ ] Academic info step
- [ ] Study preferences step
- [ ] Goals step
- [ ] Progress indicator

### Phase 3: Dashboard
- [ ] Dashboard layout with sidebar
- [ ] Navigation components
- [ ] Welcome widgets
- [ ] Progress cards
- [ ] Study plan preview
- [ ] Task summary

---

## 🚀 Production Deployment

When ready to deploy:

### Build for Production
```bash
npm run build
```

### Test Production Build
```bash
npm start
```

### Deploy to Vercel
```bash
vercel deploy
```

### Set Environment Variables on Vercel
1. Go to Vercel dashboard
2. Select project
3. Go to Settings → Environment Variables
4. Add all variables from .env.local

---

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Supabase](https://supabase.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Material Icons](https://fonts.google.com/icons)

---

## ✨ What's Next?

After testing Phase 1, proceed with:

1. **Phase 2:** Onboarding flow + Email verification
2. **Phase 3:** Dashboard layout + Core widgets
3. **Phase 4:** Study plans + Task management
4. **Phase 5:** Analytics + Focus timer
5. **Phase 6:** Settings + Profile management
6. **Phase 7:** Polish + Animations
7. **Phase 8:** Testing + QA
8. **Phase 9:** Deployment

---

**Ready to start? Run `npm install && npm run dev`** 🎉

Visit http://localhost:3000 and explore the application!
