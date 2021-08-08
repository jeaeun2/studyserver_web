const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

const session = {};  //세션은 서버에 사용자 정보를 저장함.
//재시작시 초기화 되어 실제론 변수에 넣지x

http.createServer(async (req, res) => {
    const cookies = parseCookies(req.headers.cookie); //가져옴

    if (req.url.startsWith('/login')) {
        const { query } = url.parse(req.url);
        const { name } = qs.parse(query);
        const expires = new Date(); 

        expires.setMinutes(expires.getMinutes() + 5); //5분후 만료

        const uniqueInt = Date.now();

        session[uniqueInt] = {
            name,
            expires,
        };

        res.writeHead(302, {
            Location: '/',
            'Set-Cookie': `session=${uniqueInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,  // 앞선 쿠키2와 달리 쿠키를 보낼 때 uniqueint를 보냄
        });
        res.end();

    } else if (cookies.session && session[cookies.session].expires > new Date()) { 
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`${session[cookies.session].name}님 안녕하세요`);  //세션 남아있으면 ㅎㅇ 출력
    } else {
        try {
          const data = await fs.readFile('./cookie2.html'); //없으면 불러옴
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(err.message);
        }
    }
})
    .listen(8080, () => {
        console.log('8080번 포트에서 서버 대기 중입니다!');
    });