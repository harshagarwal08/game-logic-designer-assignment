# Tailwind CSS Cache Clearing Instructions

If Tailwind CSS is not loading after refresh, try these steps:

## 1. Clear Browser Cache
- **Chrome/Edge**: Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- **Firefox**: Press `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- **Safari**: Press `Cmd+Option+R` (Mac)

## 2. Hard Refresh
- Open Developer Tools (`F12`)
- Right-click the refresh button
- Select "Empty Cache and Hard Reload"

## 3. Clear Application Storage
- Open Developer Tools (`F12`)
- Go to Application tab
- Click "Clear storage" or "Storage"
- Clear all data for localhost:3000

## 4. Disable Cache (Development)
- Open Developer Tools (`F12`)
- Go to Network tab
- Check "Disable cache" checkbox
- Keep DevTools open while developing

## 5. Incognito/Private Mode
- Open the site in incognito/private browsing mode
- This bypasses all cached data

## 6. Server-Side Cache Clear
The following commands have been run:
- `rm -rf .next` (cleared Next.js build cache)
- `rm -rf node_modules/.cache` (cleared npm cache)
- `npm install` (reinstalled dependencies)
- `npm run build` (rebuilt the project)

If the issue persists, try restarting the development server:
```bash
npm run dev
```
