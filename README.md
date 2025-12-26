# Vue 3 Admin Dashboard Boilerplate

A production-ready base boilerplate for building enterprise admin dashboards with Vue 3.

## 🚀 Features

- 🌓 **Dark/Light Mode** - System preference detection with manual toggle
- 🌐 **Internationalization** - English & Indonesian language support
- 👤 **Authentication** - JWT-based mock authentication system
- 📱 **Responsive Design** - Desktop sidebar, mobile drawer navigation
- 🎨 **Modern UI** - Glassmorphism effects, smooth animations
- 🔧 **Icon System** - Replaceable inline SVG icons

---

## 📦 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Vue 3 (Composition API + `<script setup>`) |
| Language | TypeScript (Strict Mode) |
| Build Tool | Vite |
| State | Pinia |
| Router | Vue Router 4 |
| HTTP | Axios |
| Styling | Tailwind CSS v4 |
| i18n | Vue I18n 9 |

---

## 🏗️ Architecture

This project uses a **Modular Feature-Based Architecture** implementing the **MVVM pattern** via Vue 3 Composition API.

### What does that mean?

Instead of grouping files by type (all components in `/components`, all views in `/views`), we group them by **feature/domain**. Each feature is self-contained with its own components, services, stores, and views.

### Why this architecture?

1. **Scalability** - Each feature module is independent and can grow without affecting others
2. **Maintainability** - Everything related to a feature is in one place
3. **Team collaboration** - Different teams can work on different modules
4. **Reusability** - Modules can be easily copied to other projects

---

## 📁 Folder Structure Explained

```
src/
├── assets/              # Static assets (images, fonts, global CSS)
│   └── styles/
│       └── main.css     # Tailwind CSS + custom theme variables
│
├── core/                # THE KERNEL - Shared code used across all modules
│   ├── api/             # HTTP client setup
│   │   ├── axios-instance.ts   # Axios with interceptors
│   │   └── mock-api.ts         # Mock API for development
│   ├── components/      # Reusable UI components
│   │   ├── base/        # BaseButton, BaseInput, BaseCard, etc.
│   │   └── icons/       # Icon system (Icon.vue + icons.ts)
│   ├── composables/     # Shared Vue composables
│   │   ├── useTheme.ts  # Dark/light mode logic
│   │   └── useLanguage.ts
│   ├── types/           # Global TypeScript interfaces
│   └── utils/           # Helper functions
│
├── i18n/                # Internationalization
│   ├── index.ts         # Vue I18n setup
│   └── locales/         # Translation files (en.json, id.json)
│
├── layout/              # Page layouts
│   ├── AuthLayout.vue   # For login/register pages
│   ├── AppLayout.vue    # Main dashboard shell
│   ├── AppSidebar.vue   # Navigation sidebar
│   └── AppNavbar.vue    # Top navigation bar
│
├── modules/             # FEATURE MODULES (Domain-Driven)
│   ├── auth/            # Authentication module
│   │   ├── components/  # Auth-specific components
│   │   ├── composables/ # useLogin.ts
│   │   ├── services/    # auth.service.ts (API calls)
│   │   ├── store/       # auth.store.ts (Pinia)
│   │   └── views/       # LoginPage.vue
│   └── dashboard/       # Dashboard module
│       └── views/       # DashboardPage.vue
│
├── router/              # Vue Router configuration
│   ├── index.ts         # Routes + navigation guards
│   └── navigation.ts    # Sidebar menu configuration
│
├── App.vue              # Root component
└── main.ts              # App initialization
```

---

## 🔑 Key Concepts for Beginners

### 1. Composition API & `<script setup>`

Instead of Options API's `data()`, `methods`, `computed`, we use:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)                    // reactive data
const double = computed(() => count.value * 2)  // computed
const increment = () => count.value++   // method
</script>
```

### 2. Pinia State Management

Pinia is Vue's official state manager. Think of it as a "global data store":

```typescript
// Define a store
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  
  function login(userData) {
    user.value = userData
  }
  
  return { user, isAuthenticated, login }
})

// Use in any component
const authStore = useAuthStore()
authStore.login({ name: 'John' })
```

### 3. Repository Pattern (Services)

Services abstract API calls. This keeps your components clean:

```typescript
// auth.service.ts
class AuthService {
  async login(email, password) {
    return await api.post('/auth/login', { email, password })
  }
}

// useLogin.ts (composable)
const { login } = useAuthStore()
const result = await authService.login(email, password)
if (result.success) login(result.data)
```

### 4. Vue Router Guards

Protect routes from unauthorized access:

```typescript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')  // Redirect to login
  } else {
    next()  // Continue
  }
})
```

---

## 🔄 How the App Works (End-to-End Flow)

1. **User visits `/`** (any protected route)
2. **Router guard** checks `authStore.isAuthenticated`
3. **Not authenticated?** → Redirect to `/login`
4. **User enters credentials** → `useLogin` composable handles form
5. **Submit** → `authService.login()` called
6. **Mock API** generates JWT token + user data
7. **Store updated** → `authStore.setAuth(token, user)`
8. **Token saved** to `localStorage` for persistence
9. **Router redirects** to `/` (dashboard)
10. **AppLayout** renders with sidebar + navbar
11. **Navbar** shows user profile from `authStore.user`
12. **Logout** → `authStore.clearAuth()` → Redirect to `/login`

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open http://localhost:5173 and login with any email/password.

---

## 🎨 Customization Guide

### Adding a New Module

1. Create folder: `src/modules/your-feature/`
2. Add structure:
   ```
   your-feature/
   ├── components/
   ├── composables/
   ├── services/
   ├── store/
   └── views/
   ```
3. Create your service, store, and views
4. Add route in `src/router/index.ts`
5. Add menu item in `src/router/navigation.ts`

### Switching Icon Library

To replace inline SVGs with a library like Lucide:

1. Install: `npm install lucide-vue-next`
2. Update `src/core/components/icons/icons.ts`:
   ```typescript
   import { Home, Settings, User } from 'lucide-vue-next'
   export const icons = { home: Home, settings: Settings, user: User }
   ```
3. Update `Icon.vue` to render components instead of HTML

### Adding a New Language

1. Create `src/i18n/locales/xx.json` (copy from en.json)
2. Add to `src/i18n/index.ts`:
   ```typescript
   import xx from './locales/xx.json'
   messages: { en, id, xx }
   ```
3. Add to `src/core/composables/useLanguage.ts`:
   ```typescript
   { code: 'xx', name: 'Language Name', flag: '🏳️' }
   ```

---

## 📄 License

MIT License - feel free to use this boilerplate for your projects!
