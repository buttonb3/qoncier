# AWS Amplify Deployment Guide

This guide explains how to deploy the Qoncier web app to AWS Amplify Hosting.

## Prerequisites

- AWS Account with Amplify access
- Git repository (GitHub, GitLab, or Bitbucket)
- Code pushed to your repository

## Deployment Steps

### 1. Connect Repository to Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository and branch

### 2. Configure Build Settings

Amplify will automatically detect the `amplify.yml` file in the root directory. The configuration includes:

- **App root directory**: `web` (specifies the Next.js app location)
- **Build commands**: `npm run build`
- **Output directory**: `out` (static export directory)

### 3. Environment Variables

Add the following environment variables in Amplify Console:

```
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_USER_POOL_ID=us-east-1_xxxxxxxxx
NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_API_GATEWAY_URL=https://api.qoncier.com
```

### 4. Build Configuration

The `amplify.yml` file is already configured with:

```yaml
version: 1
applications:
  - appRoot: web
    frontend:
      phases:
        preBuild:
          commands:
            - npm install
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: out
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
```

### 5. Deploy

1. Click "Save and deploy"
2. Amplify will:
   - Install dependencies
   - Build the Next.js app
   - Deploy to a global CDN
   - Provide a live URL

## Local Testing

Test the static export locally before deploying:

```bash
cd web
npm run build
npm run start
```

## Custom Domain

1. In Amplify Console, go to "Domain management"
2. Click "Add domain"
3. Enter your custom domain
4. Configure DNS settings as instructed

## Continuous Deployment

Amplify automatically deploys when you push to your connected branch. To deploy manually:

1. Go to Amplify Console
2. Click "Redeploy this version"

## Troubleshooting

### Build Failures

- Check that all dependencies are in `package.json`
- Verify environment variables are set correctly
- Review build logs in Amplify Console

### Static Export Issues

- Ensure `output: 'export'` is set in `next.config.js`
- Check that no server-side features are used
- Verify all routes are properly configured

### Performance

- Enable gzip compression in Amplify Console
- Configure caching headers for static assets
- Monitor performance in AWS CloudWatch

## Environment-Specific Deployments

### Development
- Connect to `develop` branch
- Use development environment variables

### Staging
- Connect to `staging` branch
- Use staging environment variables

### Production
- Connect to `main` branch
- Use production environment variables

## Security Considerations

- Never commit sensitive environment variables
- Use AWS Systems Manager Parameter Store for sensitive data
- Enable HTTPS redirect
- Configure security headers

## Monitoring

- Set up CloudWatch alarms for build failures
- Monitor application performance
- Track deployment history
- Set up notifications for deployment status
