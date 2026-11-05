const http = require('http');

let users = [];

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'الخادم يعمل!' }));
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const data = body ? JSON.parse(body) : {};

      if (req.url === '/signup' && req.method === 'POST') {
        const exists = users.find(u => u.email === data.email);
        if (exists) {
          res.writeHead(400);
          res.end(JSON.stringify({ message: 'الايميل مسجل من قبل' }));
          return;
        }
        users.push({ name: data.name, email: data.email, password: data.password });
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'تم انشاء الحساب بنجاح', user: { name: data.name, email: data.email } }));
        return;
      }

      if (req.url === '/login' && req.method === 'POST') {
        const user = users.find(u => u.email === data.email && u.password === data.password);
        if (!user) {
          res.writeHead(400);
          res.end(JSON.stringify({ message: 'الايميل او كلمة المرور غلط' }));
          return;
        }
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'تم تسجيل الدخول', user: { name: user.name, email: user.email } }));
        return;
      }

      res.writeHead(404);
      res.end(JSON.stringify({ message: 'غير موجود' }));

    } catch (e) {
      res.writeHead(400);
      res.end(JSON.stringify({ message: 'خطأ في البيانات' }));
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("الخادم يعمل على المنفذ " + PORT);
});
