const express = require('express'); //express 모듈불러옴
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv'); //프로세스 관리하는애 라고함.
const session = require('express-session');

dotenv.config();
const app = express(); // 모듈을 app에 넣음.

app.set('port', process.env.PORT || 8080); //PORT설정. env에 들어있는애를 먼저 넣고, 없으면 8000으로 설정함.

//미들웨어 사용 
app.use(morgan('dev')); // 추가적인 로그 볼수 있게 해줌. dev는 개발자 용
app.use('/', express.static(path.join(__dirname, 'public'))); //public폴더에 있는 정적파일 사용하겠음,(css,html등)
app.use(express.json());
app.use(express.urlencoded({extended : false})); //주소형식
app.use(cookieParser(process.env.COOKIE_SECRET)); //비밀키를 쿠키에 붙임.
app.use(session({ //세션 관리용, 사용자별로 유지
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET ,
    cookie : {
        httpOnly : true,
        secure : false,
    },
    name : 'session-cookie',
}));

const multer = require('multer'); //데이터를 여러부분으로 나눠보낼 때 사용 (멀티파트)
const fs = require('fs');

try {
    fs.readdirSync('uploads');
} catch (err) {
    console.error('uploads 폴더가 없어서 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage : multer.diskStorage({
        destination(req, file, done) {      //어디에?
            done(null, 'uploads/');         //업로드 폴더에!
        },
        filename(req, file, done) {         // 어떤 이름으로?
            const ext = path.extname(file.originalname); //확장자
            done(null, path.basename(file.originalname, ext) + Date.now() + ext); //이름+시간+확장자
        },
    }),
    limits : { fileSize : 5 * 1024 * 1024 }, //파일크기 제한
});

app.get('/upload', (req, res) => { // '/upload' 주소일 경우, 현재 디렉토리에 있는 html을 보냄
    res.sendFile(path.join(__dirname, 'multipart.html'));
});

app.post('/upload', 
    upload.fields([{name : 'image1'}, {name : 'image2'}]),
    (req, res) => {
        console.log(req.files, req.body);
        res.send('ok');
    },
);

app.use((req, res, next) => { // next : 다음 미들웨어로 감  
    console.log('모든 요청에 다 실행 됩니다.'); // use: 주소를 안넣으면 모든 요청에서 실행됨.
    next();
});

app.get('/', (req, res, next) => { //get 요청에서만 실행,
    console.log('GET / 요청에서만 실행됩니다.');
    next();
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.');
});

app.use((err, req, res, next) => { //에러
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port') + '번 포트에서 대기중');
})