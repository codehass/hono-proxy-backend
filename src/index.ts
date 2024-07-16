import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { Context, Hono } from 'hono'
import {
  getCookie,
  setCookie,
  deleteCookie,
} from 'hono/cookie'
import { decode } from 'hono/jwt'

const port = 3000;
const app = new Hono()
app.use( '/*', cors({
    origin: 'https://master.dbzjdeaojpr79.amplifyapp.com',
    maxAge: 600,
    credentials: true,
  }));

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

  try {
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

    if (response.ok) {
      return c.json({ message: 'Login successful' }, 200)
    }
    return c.json({ message: 'Login failed' }, 500)
  }
  catch (error) {
    return c.json({ message: 'Login failed' }, 500)
  }
});

// Endpoint to check if the cookie is valid to auto login inside the application
app.get("/autoLogin", async (c) => {
  const cookie = await getCookie(c, 'authToken');

  // If no cookie received, the user needs to login.
  if (!cookie || cookie === null) {
    return c.json({ message: 'Login failed' }, 500);
  }

  return c.json({ message: 'Login successfully' }, 200);
});

// Endpoint to logout and delete the cookie
app.get("/logout", (c) => {
  deleteCookie(c, 'authToken');
  return c.json({ message: 'Logout successfully' }, 200);
});

// Protected endpoint to display the content of the JWT token
app.get('/token_info', async (c) => {
  try {
    const token = await getCookie(c, 'authToken');
    
    if (!token) {
      return c.json({ message: 'Please login' }, 401);
    }

    const decodedToken = decode(token);
    return c.json({ data: decodedToken.payload }, 200);
  } catch (error) {
    console.error('Error fetching token info:', error);
    return c.json({ message: 'Internal Server Error' }, 500);
  }
});


serve(app, () => {
  console.log(`Listening on http://localhost:${port}`);
});