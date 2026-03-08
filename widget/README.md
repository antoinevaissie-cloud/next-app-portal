# App Switcher Widget

A framework-agnostic embeddable widget that adds a Google Workspace-style app switcher to any web app. Uses Shadow DOM for complete style isolation.

## Quick Start

Add this single `<script>` tag to any app:

```html
<script
  src="https://portal.avai.app/widget/app-switcher.js"
  data-portal-url="https://portal.avai.app"
  data-current-app="Taskr"
  data-position="top-right">
</script>
```

That's it. A waffle button (3x3 dots) appears at the specified position. Clicking it opens a dropdown with all registered apps.

## Configuration

All configuration is via `data-` attributes on the `<script>` tag:

| Attribute | Required | Default | Description |
|-----------|----------|---------|-------------|
| `data-portal-url` | Yes | — | Base URL of the App Portal (no trailing slash) |
| `data-current-app` | No | — | Name of the current app (highlighted in the grid) |
| `data-position` | No | `top-right` | Button position: `top-left`, `top-right`, `bottom-left`, `bottom-right` |

## Integration by Framework

### Next.js (Taskr, Shortlist)

In your root `layout.tsx`:

```tsx
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://portal.avai.app/widget/app-switcher.js"
          data-portal-url="https://portal.avai.app"
          data-current-app="Taskr"
          data-position="top-right"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
```

### Vite / Plain HTML (Liquidity Tracker)

In your `index.html`, before the closing `</body>`:

```html
<script
  src="https://portal.avai.app/widget/app-switcher.js"
  data-portal-url="https://portal.avai.app"
  data-current-app="Liquidity Tracker"
  data-position="top-right">
</script>
```

### Any other framework

The widget is vanilla JS with zero dependencies. It works anywhere you can add a `<script>` tag. Just make sure:
- The script loads after the DOM is ready (place it at the end of `<body>`)
- The portal URL is accessible from the app's domain (CORS is handled by the portal)

## How It Works

1. Script creates a host `<div>` and attaches a **Shadow DOM** (styles are fully isolated)
2. Renders a fixed-position waffle button
3. On first click, fetches apps from `{portal-url}/api/widget/apps`
4. Renders a dropdown grid with app icons and names
5. Current app is highlighted; clicking another opens it in a new tab
6. Click outside or press Escape to close

## API Endpoint

The widget fetches from:

```
GET {portal-url}/api/widget/apps
```

Returns:
```json
[
  {
    "id": "abc123",
    "appName": "Taskr",
    "productionUrl": "https://taskr.avai.app",
    "iconUrl": "https://portal.avai.app/icons/taskr.svg",
    "iconColor": "#8b5cf6"
  }
]
```

This endpoint is public (no auth), cached for 5 minutes (`s-maxage=300`), and includes CORS headers.

## Building

From the project root:

```bash
npm run build:widget
```

This bundles `widget/src/widget.ts` into `public/widget/app-switcher.js` (~6KB minified). The output is served as a static file by Next.js.

## Development

```bash
cd widget
npm install        # one-time: installs esbuild
npx tsx build.ts   # rebuild
```
