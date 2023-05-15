# Minimal Modern Node.js Server

## Usage
- `yarn` then `yarn dev` to start the server in development mode.
- `yarn build` to build the server in production mode. And `NODE_ENV=production yarn start` to start the server.

## Code Structure Explanation
- All api goes under the `/v1` route.

### Error Handling
To return an error, throw an `ServerError` with the error code (default: 400) and message. The response will be `{message: string}`.

Other errors will be treated as internal error and the response will be `{message: 'Internal Server Error'}` with error code 500.

### Asynchronous Middleware
Wrap the middleware function with `asyncMiddleware` to handle the error. The error will be passed to the next middleware.

```typescript
import asyncMiddleware from 'middleware-async'
router.get('/ping', asyncMiddleware(async (req, res) => {
	await new Promise(resolve => setTimeout(resolve, ms('1s')))
	res.status(200).json({message: 'pong'})
}))
```

### Authentication
JWT authentication is implemented in `src/middleware/auth.ts`.
Token verification is left to the developer.

To verify if the user is authenticated, call `requireAuth(req)` at the beginning of the middleware function.
```typescript
router.get('/me', (req, res) => {
	requireAuth(req)
	res.status(200).json({user: req.user})
})
```

### Data Validation

Example:

```typescript
const body = parseZodSchema(z.object({name: z.string()}).strict(), req.body)
```

### Database
This boilerplate does not include database integration.

[kysely](https://github.com/kysely-org/kysely) (or [knex](https://github.com/knex/knex)) with postgresql is recommended.

## Features
- Typescript.
- Simple server with express.
- hot-reload in development with `nodemon`.
- docker build integrated.
- yarn 2.
- source map support in production.
- async middleware function.
- parameter validation with zod.
- Convenient error handling.
