# Qoncier Monorepo

> AI-powered personal health assistant - One codebase for web, iOS, and Android

Qoncier is a comprehensive health management platform that provides personalized AI-driven health guidance, symptom tracking, medication management, and wellness insights across multiple platforms.

## 🏗️ Architecture

This monorepo contains three main packages:

- **`/mobile`** - React Native app (iOS + Android) using Expo
- **`/web`** - Next.js web app with React Native Web for code sharing
- **`/shared`** - Shared UI components, API clients, and utilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- For mobile development: Expo CLI and mobile development tools
- For web development: Modern web browser

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd qoncier
   yarn install
   ```

2. **Build shared package:**
   ```bash
   yarn workspace @qoncier/shared build
   ```

### Development

#### Web App
```bash
# Start the web development server
yarn dev:web

# Open http://localhost:3000 in your browser
```

#### Mobile App
```bash
# Start the mobile development server
yarn dev:mobile

# Then choose your platform:
yarn mobile:ios     # Run on iOS simulator
yarn mobile:android # Run on Android emulator
```

### Building for Production

```bash
# Build web app for production
yarn build:web

# Build mobile apps (requires Expo CLI)
yarn build:mobile
```

## 📁 Project Structure

```
qoncier/
├── mobile/                 # React Native mobile app
│   ├── src/
│   │   ├── screens/       # App screens
│   │   └── services/      # Auth and API services
│   ├── App.tsx            # Main app component
│   └── app.json           # Expo configuration
├── web/                   # Next.js web app
│   ├── pages/             # Next.js pages
│   ├── src/services/      # Auth and API services
│   └── next.config.js     # Next.js configuration
├── shared/                # Shared code
│   ├── src/
│   │   ├── components/    # Shared UI components
│   │   ├── api/          # API client and endpoints
│   │   ├── theme/        # Design system and theme
│   │   └── utils/        # Utility functions
│   └── dist/             # Built shared package
├── package.json           # Root workspace configuration
├── tsconfig.json          # Shared TypeScript config
└── README.md             # This file
```

## 🎨 Shared Components

The `/shared` package provides reusable components across all platforms:

### Available Components

- **Button** - Styled button with multiple variants and sizes
- **Card** - Container component with elevation and padding options
- **Input** - Form input with validation and styling
- **Theme** - Complete design system with colors, typography, and spacing

### Usage

```tsx
import { Button, Card, Input, theme } from '@qoncier/shared';

// Use shared components
<Button title="Click me" onPress={handlePress} variant="primary" />
<Card variant="elevated" padding="lg">
  <Input label="Email" value={email} onChangeText={setEmail} />
</Card>
```

## 🔐 Authentication

Both mobile and web apps use AWS Cognito for authentication:

### Configuration

Set up your environment variables:

**Web (.env.local):**
```env
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_USER_POOL_ID=us-east-1_xxxxxxxxx
NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_API_GATEWAY_URL=https://api.qoncier.com
```

**Mobile (app.json extra section):**
```json
{
  "expo": {
    "extra": {
      "awsRegion": "us-east-1",
      "userPoolId": "us-east-1_xxxxxxxxx",
      "userPoolWebClientId": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
      "apiGatewayUrl": "https://api.qoncier.com"
    }
  }
}
```

### API Integration

The shared API client handles authenticated requests to AWS API Gateway:

```tsx
import { healthApi } from '@qoncier/shared';

// Get user profile
const profile = await healthApi.getProfile();

// Log symptoms
await healthApi.logSymptom({
  symptom: 'headache',
  severity: 5,
  timestamp: new Date()
});
```

## 🛠️ Development Workflow

### Adding New Shared Components

1. **Create component in `/shared/src/components/`:**
   ```tsx
   // shared/src/components/NewComponent/NewComponent.tsx
   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';
   
   export interface NewComponentProps {
     title: string;
   }
   
   export const NewComponent: React.FC<NewComponentProps> = ({ title }) => {
     return (
       <View style={styles.container}>
         <Text>{title}</Text>
       </View>
     );
   };
   ```

2. **Export from components index:**
   ```tsx
   // shared/src/components/index.ts
   export { NewComponent, type NewComponentProps } from './NewComponent/NewComponent';
   ```

3. **Build shared package:**
   ```bash
   yarn workspace @qoncier/shared build
   ```

4. **Use in apps:**
   ```tsx
   import { NewComponent } from '@qoncier/shared';
   ```

### Code Quality

The monorepo includes consistent tooling across all packages:

```bash
# Lint all packages
yarn lint

# Fix linting issues
yarn lint:fix

# Type check all packages
yarn type-check

# Run tests
yarn test
```

### Styling Guidelines

- Use the shared theme for consistent styling
- Follow React Native Web compatibility guidelines
- Use StyleSheet for performance
- Leverage shared spacing, colors, and typography

## 📱 Platform-Specific Considerations

### Mobile (React Native)
- Uses Expo for rapid development
- Native navigation with React Navigation
- Secure storage with Expo SecureStore
- Platform-specific optimizations

### Web (Next.js + React Native Web)
- Server-side rendering support
- SEO optimization
- Progressive Web App capabilities
- Responsive design with shared components

## 🔧 Scripts Reference

### Root Level
- `yarn dev:web` - Start web development server
- `yarn dev:mobile` - Start mobile development server
- `yarn build:web` - Build web app for production
- `yarn build:mobile` - Build mobile apps
- `yarn lint` - Lint all packages
- `yarn test` - Run tests across all packages
- `yarn clean` - Clean all node_modules and build artifacts

### Mobile Specific
- `yarn mobile:ios` - Run on iOS simulator
- `yarn mobile:android` - Run on Android emulator

## 🚀 Deployment

### Web Deployment
```bash
# Build for production
yarn build:web

# Deploy to your preferred platform (Vercel, Netlify, etc.)
```

### Mobile Deployment
```bash
# Build for app stores
yarn build:mobile

# Use Expo's deployment tools
expo build:ios
expo build:android
```

## 🤝 Contributing

1. Create feature branches from `main`
2. Make changes in the appropriate package(s)
3. Update shared components if needed
4. Test on both web and mobile platforms
5. Submit pull request with clear description

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Shared package not found:**
```bash
yarn workspace @qoncier/shared build
```

**Metro bundler issues:**
```bash
yarn workspace @qoncier/mobile clean
yarn install
```

**Web build issues:**
```bash
yarn workspace @qoncier/web clean
yarn install
```

**TypeScript errors:**
```bash
yarn type-check
```

### Getting Help

- Check the [Expo documentation](https://docs.expo.dev/) for mobile issues
- Check the [Next.js documentation](https://nextjs.org/docs) for web issues
- Review the [React Native Web documentation](https://necolas.github.io/react-native-web/) for cross-platform compatibility

---

Built with ❤️ for better health management across all platforms.
