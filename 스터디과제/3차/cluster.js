const http = require('http');
const cluster = require('cluster'); //클러스터 : 그림자 분신술, 코어 여러개 사용하게 해줌.
//근데 그림자 분신술과 달리 메모리 공유 못함ㅠㅠ
const { mainModule } = require('process');

const numCPUs = require('os').cpus().length; //분신 몇마리인지?

if(cluster.isMaster) { //본체일 경우
    console.log(`마스터 프로세스 아이디: ${process.pid}`); //id출력이라고.

    for(let i = 0; i < numCPUs; ++i) {
        cluster.fork(); //fork 실행한 횟수 만큼 분신 생성함. 여기선 cpu갯수만큼.
    }

    cluster.on('exit', (worker, code, signal) => {  //워커가 죽었을 때
        console.log(`${worker.process.pid}번 워커가 종료되었습니다.`); 
        console.log('code', code, 'signal', signal);
        cluster.fork();
    });
} else { //분신일 경우
    http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8'});
        res.write('<h1>Hello Node!</h1>');
        res.end('<p>Hello Server!</p>');

        setTimeout(() => { 
            process.exit(1); // 1초에 워커 하나씩 종룐
        }, 1000);
    }).listen(8080);

    console.log(`${process.pid}번 워커 실행`);
}