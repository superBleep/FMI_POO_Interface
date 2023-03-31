import { useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Button } from "react-bootstrap";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;   
export default function GitHubLogin({callback}) {
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    if (codeParam && (localStorage.getItem("accessToken") === null )) {
      async function getAccessToken() {
        const tokenRoute = `http://localhost:4000/getAccessToken?code=${codeParam}`; 
        await fetch(tokenRoute, { 
          method: "GET"
        })
          .then((response) => response.json())
          .then((data) => {
          if (data.access_token) {
            localStorage.setItem("accessToken", data.access_token);
          }
        });
      }
      getAccessToken();
    }
    else if (localStorage.getItem("accessToken")) {
      callback(true);
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
      <Button onClick={loginWithGithub} variant="primary"><FontAwesomeIcon icon={faGithub} />
        Login with GitHub
      </Button>
    </>
  );
}
