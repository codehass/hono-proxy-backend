import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { Hono } from 'hono'
import {
  getCookie,
  setCookie,
  deleteCookie,
  setSignedCookie
} from 'hono/cookie'

const app = new Hono()
app.use('/*', cors());

//app.get('/', (c) => c.json({"key":"value b"}));

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

  try{
    // Forward the request to external endpoint
    const response = await fetch('https://7qk9m2xvu2.us-west-2.awsapprunner.com/v1/auth/login', {
      method: 'POST',
      headers: forwardedHeaders,
      body: JSON.stringify({ username, password })
      });

    const result = await response.json();

      const token = result.access_token;

      // Set the token in a secure cookie
      setCookie(c, 'authToken', token, {
        path: '/',
        secure: true,
        httpOnly: true,
        maxAge: 3600, 
        sameSite: 'Strict',
      });

      if(response.ok){
        return c.json({ message: 'Login successful' }, 200)
      }
      return c.json({ message: 'Login failed' }, 500)
  }
  catch(error){
    return c.json({ message: 'Login failed' }, 500)
  }

})

// this path will be used to check if the cookie is valid to auto login inside the application;
app.get("/autoLogin", (c) => {
  const cookie = getCookie(c, 'authToken');
  
  // if we received no cookies then user needs to login.
  if (!cookie || cookie === null) {
    return c.json({ message: 'Login failed' }, 500);
  }

  return c.json({ message: 'Login successfully' }, 200);
});

app.get("/logout", (c) => {
  deleteCookie(c, 'authToken');
  return c.json({ message: 'Logout successfully' }, 200);
});

serve(app, (info) => {
  `Listening on http://localhost:${info.port}`;
})