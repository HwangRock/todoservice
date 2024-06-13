import { API_BASE_URL } from "../app-config";

export function call(api, method, request) {
  let options = {
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    url: API_BASE_URL + api,
    method: method,
  };
  if (request) {
    options.body = JSON.stringify(request);
  }
  return fetch(options.url, options)
    .then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        return json;
      })
    )
    .catch((error) => {
      console.log(error.status);
      if (error.status === 403) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    });
}
// 로그인을 위한 API 서비스 메소드 signin
export function signin(userDTO) {
    return call("/auth/signin", "POST", userDTO)
      .then((response) => {
        if (response.token) {
          // local 스토리지에 토큰 저장
          localStorage.setItem("ACCESS_TOKEN", response.token);
          // token이 존재하는 경우 todo 화면으로 리다이렉트
          window.location.href = "/";
        }
      });
  }
  
  // 회원 가입 요청
  export function signup(userDTO) {
    return call("/auth/signup", "POST", userDTO)
      .then((response) => {
        if (response.id) {
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.log("Oops!");
        console.log(error.status);
        console.log("Oops!");
        if (error.status === 403) {
          window.location.href = "/auth/signup";
        }
        return Promise.reject(error);
      });
  }
  
  // 로그아웃
  export function signout() {
    // local 스토리지에 토큰 삭제
    localStorage.setItem("ACCESS_TOKEN", null);
    window.location.href = "/";
  }
  