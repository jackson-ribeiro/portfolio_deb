This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Desenvolvimento local

O ambiente local usa um banco Postgres próprio (docker-compose) e a pasta
`portfolio-dev/` do Cloudinary. A produção (Vercel + Neon, pasta `portfolio/`)
nunca é alterada: ela só é lida para gerar a cópia local.

1. `cp .env.example .env` e preencha os valores (os da Vercel, exceto
   `DATABASE_URL`, `NEXTAUTH_URL` e `CLOUDINARY_FOLDER`).
2. `npm install`
3. `npm run sync:prod`: sobe o banco local e copia o banco e as mídias da produção.
4. `npm run dev` e abra [http://localhost:3000](http://localhost:3000).

O `npm run dev` já sobe o banco antes do site.
Rode `npm run sync:prod` de novo sempre que quiser os dados atuais da produção.
Ele substitui todo o banco local. Para desligar o banco: `npm run db:down`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
