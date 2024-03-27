# Middleware not working in production with Next.js 14 and custom server

Architecture have been inspired from Payload custom server example. For more information,
see [Payload custom server example](https://github.com/payloadcms/payload/tree/main/examples/custom-server#how-it-works)


## Development

To spin up the project locally, follow these steps:

1. First clone the repo
2. Then `cd YOUR_PROJECT_REPO && cp .env.example .env`
3. Generate a new payload secret key using `pnpm run generate:secret`
4. Next, open `.env` and add your Payload secret key and any other environment variables you need
5. Next `pnpm i && pnpm run dev`
6. Now `open http://localhost:3000/admin` to access the admin panel
7. Create your first admin user using the form on the page
8. Access frontend at `http://localhost:3000`

That's it! Changes made in `./src` will be reflected in your app.

### mongodb
Without Docker, you need a MongoDB database running locally.

On a Mac, with Brew, it can be installed and started with:

```
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

## Production

To run the website in production, you need to build and serve the Admin panel and the Frontend. To do so, follow these
steps:

First, invoke the build script by running `pnpm run build`.
This creates a ./build directory with a production-ready admin bundle and Next.js bundle.

Serve the admin panel and the frontend by running `pnpm run serve`.

**Troubleshooting**
Next.js middleware are not working properly with a custom server in production bundle. This seems to be relative to
Next.js 14.
