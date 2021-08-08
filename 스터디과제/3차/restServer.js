const http = require('http'); //http 모듈 입력
const fs = require('fs').promises; //http 파일 읽기 위해 fs 모듈입력
const users = {};

http.createServer(async (req, res) => {
    try {
        console.log(req.method, req.url);

        if(req.method === 'GET') { //http 요청 메서드가 get일 경우
            if(req.url === '/') { //요청 주소가 '/'일 때
                const data = await fs.readFile('./restFront.html'); //파일 불러옴
                res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8'}); //성공, 형식:html, 한글 쓰려고 utf8함 writehead (두번째 인수칸에 {}로 묶어서 형식 정의함)
                return res.end(data); 
            } else if(req.url === '/about') { //요청 주소가 /about일 때
                const data = await fs.readFile('./about.html');
                res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8'});
                return res.end(data); 
            } else if(req.url === '/users') { //요청주소가 users 일 때
                console.log(users);
                res.writeHead(200, { 'Content-Type' : 'text/plain; charset=utf-8'}); //plain : 평문
                return res.end(JSON.stringify(users));   
            }

            try { // 주소가 /, /about, /user가 아닐 경우
                const data = await fs.readFile(`.${req.url}`);
                return res.end(data);
            } catch(err) {
                console.error(err); //404error
            }
        } else if(req.method === 'POST') { //요청 메서드가 post 일 경우
            if(req.url === '/user') { //요청 주소가 /user일 때
                let body = '';

                req.on('data', (data) => {
                    body += data;
                });

                return req.on('end', () => {
                    console.log('POST 본문(Body) : ', body);
                    const { name } = JSON.parse(body); //문자열이라서  json으로 만들어줌.
                    const id = Date.now();
                    users[id] = name;

                    res.writeHead(201); //작성됨
                    res.end('등록 성공');
                });
            }
        } else if(req.method === 'PUT') { // 요청 메소드가 put일 경우
            if(req.url.startsWith('/user/')) { //주소가 /user/로 시작 하면
                const key = req.url.split('/')[2];  // '/' 기준 문자열 분할
                let body = '';

                req.on('data', (data) => {
                    body += data;
                });

                return req.on('end', () => {
                    console.log('PUT 본문(Body) : ', body);
                    users[key] = JSON.parse(body).name;
                    return res.end(JSON.stringify(users)); //문자열 화
                })
            }
        } else if(req.method === 'DELETE') { //삭제
            if(req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                delete users[key];
                return res.end(JSON.stringify(users));
            }
        }
        res.writeHead(404); //찾을 수 없음
        return res.end('NOT FOUND');
    } catch(err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type' : 'text/plain; charset=utf-8'}); // 서버 오류
        return res.end('err.message');
    }
}) 

        .listen(8080, () => {
        console.log('8080번 포트에서 서버 대기 중 입니다.');
    });