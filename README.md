# next-template

A Next.js 15 template for building apps with Radix UI and Tailwind CSS.

## Usage

```bash
npx create-next-app -e https://github.com/shadcn/next-template
```

## Features

- Next.js 15 App Directory
- Radix UI Primitives
- Tailwind CSS
- Icons from [Lucide](https://lucide.dev)
- Dark mode with `next-themes`
- Tailwind CSS class sorting, merging and linting.

## Cloudflare Deployment (Optional)
See: https://developers.cloudflare.com/pages/framework-guides/nextjs/ssr/get-started/


Ensure all server-rendered routes use the Edge Runtime
```js
export const runtime = "edge";
```

```bash
npm run pages:build
npm run preview
npm run deploy
```

## License

Licensed under the MIT license
