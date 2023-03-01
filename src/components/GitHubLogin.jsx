import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;   
export default function GitHubLogin() {
  const [accessToken, setToken] = useState("");
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    console.log(codeParam);

    if (codeParam && (localStorage.getItem("accesToken") === null)) {
      async function getAccessToken() {
        const tokenRoute = `http://localhost:4000/getAccessToken?code=${codeParam}`; 
        await fetch(tokenRoute, { 
          method: "GET"
        }).then((response) => {
          return response.json();
        }).then((data) => {
          console.log(data);
          if (data.access_token) {
            localStorage.setItem("accessToken", data.access_token);
          }
        });
      }
      getAccessToken();
    }
  }, []);

  let loginWithGithub = () => {
    // login with GitHub prompt
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`
    );
  };
  return (
    <>
      <button className="btn btn-primary" onClick={loginWithGithub}>
        <FontAwesomeIcon icon={faGithub} />
        Login with GitHub
      </button>
    </>
  );
}
