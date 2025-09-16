# Deployment Guide

This guide explains how to deploy your Expo React Native app to both web (Vercel) and mobile (Expo) platforms.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Expo Account**: Sign up at [expo.dev](https://expo.dev)
3. **GitHub Repository**: Your code should be in a GitHub repository

## Setup Instructions

### 1. Vercel Setup

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project" and import your GitHub repository
3. Configure the project settings:
   - **Framework Preset**: Other
   - **Build Command**: `node build-web.js`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Get your Vercel credentials:
   - Go to Vercel Dashboard → Settings → General
   - Copy your **Project ID** and **Organization ID**
   - Go to Settings → Tokens and create a new token

### 2. Expo Setup

1. Go to [expo.dev](https://expo.dev) and sign in
2. Install Expo CLI: `npm install -g @expo/cli`
3. Login to Expo: `expo login`
4. Get your Expo token:
   - Go to [expo.dev/settings/tokens](https://expo.dev/settings/tokens)
   - Create a new access token

### 3. GitHub Secrets Setup

Add the following secrets to your GitHub repository:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `VERCEL_TOKEN`: Your Vercel token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID
   - `EXPO_TOKEN`: Your Expo access token

### 4. Local Development

#### Web Development
```bash
# Start web development server
npm run web

# Build for production
npm run build
```

#### Mobile Development
```bash
# Start mobile development server
npm start

# Run on specific platforms
npm run android
npm run ios
```

## How It Works

### Web Deployment (Vercel)
- When you push to the main branch, GitHub Actions runs
- It builds your React Native app for web using the custom build script
- The built files are deployed to Vercel
- Your website will be available at your Vercel domain

### Mobile Deployment (Expo)
- When you push to the main branch, GitHub Actions runs
- It publishes your app to Expo
- Users can access the app via Expo Go or as a standalone app

## File Structure

```
├── .github/workflows/deploy.yml  # GitHub Actions workflow
├── build-web.js                  # Custom web build script
├── index.html                    # Web entry point
├── index.web.js                  # Web-specific React Native entry
├── App.tsx                       # Main React Native app
├── src/                          # App source code
├── dist/                         # Built web files (generated)
└── vercel.json                   # Vercel configuration
```

## Troubleshooting

### Web Build Issues
- Check that `node build-web.js` runs successfully locally
- Verify that the `dist` directory contains the required files
- Check Vercel build logs for any errors

### Mobile Build Issues
- Ensure you're logged into Expo CLI: `expo login`
- Check that your `app.json` is properly configured
- Verify your Expo token has the correct permissions

### GitHub Actions Issues
- Check that all required secrets are set in GitHub
- Verify the workflow file syntax is correct
- Check the Actions tab in your GitHub repository for detailed logs

## Manual Deployment

If you need to deploy manually:

### Web (Vercel)
```bash
# Build the web app
node build-web.js

# Deploy to Vercel (if you have Vercel CLI installed)
vercel --prod
```

### Mobile (Expo)
```bash
# Publish to Expo
expo publish --platform all
```

## Environment Variables

Make sure to set up environment variables in both Vercel and Expo:

- **Vercel**: Go to Project Settings → Environment Variables
- **Expo**: Use `expo publish` with environment variables or configure in `app.json`

## Support

If you encounter any issues:
1. Check the GitHub Actions logs
2. Check Vercel deployment logs
3. Check Expo build logs
4. Review this documentation
