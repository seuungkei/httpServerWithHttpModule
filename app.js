// node.js에 내장되어 있는 http라고 하는 built-in 모듈을 호출
// http 객체 안에 내장되어 있는 cerateServer 함수를 사용해서 서버 객체를 생성
const { appendFile } = require("fs");
const http = require("http");
const server = http.createServer();

// =============== 유저 정보 ================
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

// =============== 게시글 목록 ================
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

// =============== 게시글 목록 조회하기 함수 ================
function getPostsList(users, posts) {
  const info = [];

  users.forEach((element) => {
    const obj = {};
    obj["userID"] = element.id;
    obj["userName"] = element.name

    for(let i in posts) {
      if(element.id === posts[i].id) {
        obj["postingId"] = posts[i].id;
        obj["postingTitle"] = posts[i].title;
        obj["postingContent"] = posts[i].content;
      };
    };
    info.push(obj)
  });
  return info
};


// =============== 게시글 목록 조회하기 함수 ================



const httpRequestListener = (request, response) => {
  const {url, method} = request;

  // =============== 유저와 게시글 목록 조회하기 ================
  if (method === "GET") {
    if (url === "/posts") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ data: posts }));
    } else if (url === "/postings") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ data: getPostsList(users, posts) }));
    }
  } 
// =============== 유저 회원가입 ================
  if(method === "POST") {
    if(url === "/user/signup"){
      let body = "";
      request.on("data", (data) => {body += data})
      request.on("end", () => {

        const user = JSON.parse(body);
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

    // =============== 게시물 등록하기 ================
    if(url === "/posts") {
      let postBody = "";
      request.on("data", (data) => {postBody += data})
      request.on("end", () => {
      
        const post = JSON.parse(postBody);
        const user = users.find((user) => user.id === post.userId)

        
        if(user) {
          posts.push({
            id: post.id,
            title: post.title,
            content: post.content,
            userId: post.userId,
          })

      response.writeHead(200, {"Content-Type" : "application/json"});
      response.end(JSON.stringify({message : "postCreated"}))
        } else {
          response.writeHead(404, {"Content-Type" : "application/json"});
          response.end(JSON.stringify({message : "user post does not exist!"}))
        };
    });
    };
  };

  // =============== 게시글 부분 수정하기 ================
  if(method === "PATCH") {
    const urlArr = url.split("/");
    const postId = Number(urlArr[urlArr.length-1]);

      let body = "";

      request.on("data", (data) => {body += data})
      request.on("end", () => {
        
        const update = JSON.parse(body)

        for(let post of posts) {
          if(postId === post.id) {
            for(let key in update) {
              post[key] = update[key]
            }
          }
        }
        response.writeHead(200, {"Content-Type" : "application/json"});
        response.end(JSON.stringify({message : "postCreated"}))
      });
    };
  };


server.on("request", httpRequestListener);

const IP = '127.0.0.1';
const PORT = 8000;


server.listen(PORT, IP, function() {
  console.log(`IP : ${IP} PORT : ${PORT} 서버시작!!!🔥`)
})



