const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>  //문자열을 객체로 바꿔준데 cookie=test > {cookie:'test'}
    cookie
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, [k, v]) => { 
            acc[k.trim()] = decodeURIComponent(v);
            return acc; 
        }, {});

http.createServer(async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);  //쿠키 가져옴

    if (req.url.startsWith('/login')) {  // 주소가 /login인 경우
        const { query } = url.parse(req.url); 
        const { name } = qs.parse(query);
      
        const expires = new Date();


        expires.setMinutes(expires.getMinutes() + 5); //쿠키를 5분후에 만료시킴

        res.writeHead(302, { //리다이렉션
            Location: '/',
            'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`, //쿠키 설정해줌, 한글쓰려고encode...뭐시기씀 
          });

        res.end();
    } else if(cookies.name) {  //사용자 쿠키가 있으면 ㅎㅇ 출력
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`${cookies.name}님 안녕하세요`); 
    } else {
        try { //없으면 파일 불러옴
            const data = await fs.readFile('./cookie2.html');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        } catch(err) {
            console.log(err);
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(err.message);
        }
    }
})
    .listen(8080, () => {
        console.log('8080번 포트에서 대기중')
    });