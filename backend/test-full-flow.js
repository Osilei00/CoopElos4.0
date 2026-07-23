const http = require('http');

// Step 1: Login and get cookie
const loginData = JSON.stringify({
  email: 'admin@coopelos.com.br',
  password: 'coopelos2026'
});

const loginOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const loginReq = http.request(loginOptions, (loginRes) => {
  let body = '';
  loginRes.on('data', (chunk) => body += chunk);
  loginRes.on('end', () => {
    console.log('=== LOGIN ===');
    console.log('Status:', loginRes.statusCode);
    console.log('Body:', body);
    
    const cookies = loginRes.headers['set-cookie'];
    console.log('Set-Cookie:', cookies);
    
    const loginResult = JSON.parse(body);
    
    // Step 2: Call session endpoint via proxy (simulating what the frontend does)
    const sessionData = JSON.stringify(loginResult);
    const sessionCookie = `coopelos-session=${JSON.stringify({
      userId: loginResult.userId,
      cooperativeId: loginResult.cooperativeId,
      role: loginResult.role,
      name: loginResult.name,
      email: loginResult.email,
      isLoggedIn: true
    })}`;
    
    // Test the backend session endpoint directly with X-User-Id header
    const sessionOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/session',
      method: 'GET',
      headers: {
        'X-User-Id': loginResult.userId,
        'X-Cooperative-Id': loginResult.cooperativeId
      }
    };
    
    const sessionReq = http.request(sessionOptions, (sessionRes) => {
      let sessionBody = '';
      sessionRes.on('data', (chunk) => sessionBody += chunk);
      sessionRes.on('end', () => {
        console.log('\n=== SESSION (backend direct) ===');
        console.log('Status:', sessionRes.statusCode);
        console.log('Body:', sessionBody);
        
        // Step 3: Test the Next.js session endpoint
        const nextSessionOptions = {
          hostname: 'localhost',
          port: 3000,
          path: '/api/auth/session',
          method: 'GET',
          headers: {
            'Cookie': sessionCookie
          }
        };
        
        const nextReq = http.request(nextSessionOptions, (nextRes) => {
          let nextBody = '';
          nextRes.on('data', (chunk) => nextBody += chunk);
          nextRes.on('end', () => {
            console.log('\n=== SESSION (Next.js /api/auth/session) ===');
            console.log('Status:', nextRes.statusCode);
            console.log('Body:', nextBody);
            
            // Step 4: Test the proxy endpoint
            const proxyOptions = {
              hostname: 'localhost',
              port: 3000,
              path: '/api/proxy/auth/session',
              method: 'GET',
              headers: {
                'Cookie': sessionCookie
              }
            };
            
            const proxyReq = http.request(proxyOptions, (proxyRes) => {
              let proxyBody = '';
              proxyRes.on('data', (chunk) => proxyBody += chunk);
              proxyRes.on('end', () => {
                console.log('\n=== SESSION (proxy /api/proxy/auth/session) ===');
                console.log('Status:', proxyRes.statusCode);
                console.log('Body:', proxyBody);
              });
            });
            
            proxyReq.on('error', (e) => console.error('Proxy Error:', e.message));
            proxyReq.end();
          });
        });
        
        nextReq.on('error', (e) => console.error('Next Error:', e.message));
        nextReq.end();
      });
    });
    
    sessionReq.on('error', (e) => console.error('Session Error:', e.message));
    sessionReq.end();
  });
});

loginReq.on('error', (e) => console.error('Login Error:', e.message));
loginReq.write(loginData);
loginReq.end();
