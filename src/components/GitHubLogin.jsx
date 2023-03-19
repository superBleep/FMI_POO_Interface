import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;   
export default function GitHubLogin() {
  const [login, setLogin] = useState(false);
  const [userData, setUserData] = useState(null);
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
      async function getUserData() {
        const dataRoute = `http://localhost:4000/getUserData`;
        await fetch(dataRoute, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
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
            setUserData(data);
          }
        });
      }
      getUserData();
      
    } 
  }, [userData,login]);


  let loginWithGithub = () => {
    // login with GitHub prompt
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`
    );
  };
  return (
    <>
      {login === true &&
      <p> {userData["login"]} is logged in!</p>}
      <button className="btn btn-primary" onClick={loginWithGithub}>
        <FontAwesomeIcon icon={faGithub} />
        Login with GitHub
      </button>
    </>
  );
}
