import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;   
export default function GitHubLogin() {
  const [login, setLogin] = useState(false);
  const [accessToken, setToken] = useState(null)
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    console.log(codeParam);

    if (codeParam && (accessToken === null )) {
      async function getAccessToken() {
        const tokenRoute = `http://localhost:4000/getAccessToken?code=${codeParam}`; 
        await fetch(tokenRoute, { 
          method: "GET"
        })
          .then((response) => response.json())
          .then((data) => {
          if (data.access_token) {
            setToken(data.access_token);  
          }
        });
      }
      getAccessToken();
    }
    else if (accessToken) {
      async function getUserData() {
        const dataRoute = `http://localhost:4000/getUserData`;
        await fetch(dataRoute, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        })
        .then((response) => response.json()) 
        .then((data) => {
          // daca contul de github nu este in baza de date, loginul a esuat
          const allowedUsers = ['test1','test2', 'alex-toma0']
          if (!allowedUsers.includes(data.login)) {
            window.alert("Contul nu este in baza de date! Loginul a esuat!");
          }
          else {
            setLogin(true);
          }
        });
      }
      getUserData();
      
    } 
  }, [accessToken,login]);


  let loginWithGithub = () => {
    // login with GitHub prompt
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`
    );
  };
  return (
    <>
      {login === true &&
      <p>user is logged in!</p>}
      <button className="btn btn-primary w-100" onClick={loginWithGithub}>
        <FontAwesomeIcon icon={faGithub} />
        &nbsp; Login with GitHub
      </button>
    </>
  );
}
