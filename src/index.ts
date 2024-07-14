import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.json({"key":"value b"}));

app.post('/login', async (c) => {

  const { headers, username, password } = await c.req.json();
   const forwardedHeaders = new Headers();
   forwardedHeaders.append('Content-Type', 'application/json');
  for (const key in headers) {
    forwardedHeaders.append(key, headers[key]);
  }

  if (!forwardedHeaders.has('x-tenantid')) {
      forwardedHeaders.append('x-tenantid', 'SchryverPruebas');
    }

    // Forward the request to external endpoint
  const response = await fetch('https://7qk9m2xvu2.us-west-2.awsapprunner.com/v1/auth/login', {
    method: 'POST',
    headers: forwardedHeaders,
    body: JSON.stringify({ username, password })
  });

  const result = await response.json();

  return c.json(result);

})


serve(app, (info) => {
  `Listening on http://localhost:${info.port}`;
})