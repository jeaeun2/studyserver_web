
// 쿠키? 
// -> 키-값 세트로 이루어진 저장물(?) ex) 누구=이재은
// 브라우저에서 저장해두었다가 요청할 때마다 보내 줌. 요청의 헤더에 담김

const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, {'Set-Cookie': 'mycookie=test'}); // 성공, mycookie에 test저장
    res.end('Hello Cookie');
    console.log(req.url, req.headers.cookie); //헤더에 들어감

})
    .listen(8081, () => {
        console.log('8081번 포트에서 대기중');
    });s