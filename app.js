// node.js에 내장되어 있는 http라고 하는 built-in 모듈을 호출
// http 객체 안에 내장되어 있는 cerateServer 함수를 사용해서 서버 객체를 생성
const http = require("http");
const server = http.createServer();


const users = [
  {
    id: 1,
    name: "Kim Seung gi",
    email: "seungkei@gmail.com",
    password: "1q2w3e4r"
  },
  {
    id: 2,
    name: "Lee Seung gi",
    email: "leeseung@gmail.com",
    password: "123456789a"
  },
]

const posts = [
  {
    id: 1,
    title: "비전공자 개발자 시작하기",
    content: "늦은 나이에 시작한 비전공자의 개발자 도전기",
    userId: 1,
  },
  {
    id: 2,
    title: "HTTP, HTML은 도대체 뭘까?",
    content: "말로만 듣던 영어들은 어떻게 인터넷을 실행시킬까",
    userId: 1,
  }
]

// ====================== api ===========================
const httpRequestListener = (request, response) => {
  const {url, method} = request;

  // ====================== 회원가입 api  ===========================
  if(url === "/user/signup" && method === "POST") {
    let body = "";

    request.on("data", (data) => {body += data})

    request.on("end", () => {
      const user = JSON.parse(body);
      // 가자

      users.push({ // (8)
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      });

      response.writeHead(200, {"Content-Type" : "application/json"});
      response.end(JSON.stringify({message: "userCreated"}))
    });
  }
  // ====================== 회원가입 api end ===========================


  // ====================== 게시물등록 api ===========================
  if(url === "/post/registration" && method === "POST") {
    let postBody = "";

    request.on("data", (data) => {postBody += data})

    request.on("end", () => {
      const post = JSON.parse(postBody);

      posts.push({
        id: postBody.id,
        title: postBody.title,
        content: postBody.content,
        userId: postBody.userId,
      });

      response.writeHead(200, {"Content-Type" : "application/json"});
      response.end(JSON.stringify({message : "postCreated"}))
    });
  };
  // ====================== 게시물등록 api end ===========================
};


server.on("request", httpRequestListener);

const IP = '127.0.0.1';
const PORT = 8000;


server.listen(PORT, IP, function() {
  console.log(`IP : ${IP} PORT : ${PORT} 서버시작!!!🔥`)
})
