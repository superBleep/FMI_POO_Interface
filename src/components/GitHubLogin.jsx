import { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
const CLIENT_ID = "e74bc2c6cfd51906ab93" // client id for the GitHub oauth application
export default function GitHubLogin() {
    useEffect(() => {
        // stores the authentication token for api calls in the codeParam variable (insecure, should be stored server-side)
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const codeParam = urlParams.get("code")
        console.log(codeParam)
    }, [])
    let loginWithGithub = () => {
        // login with GitHub prompt
        window.location.assign(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`)
    }
    return (
        <>
        <button className='btn btn-primary' onClick={loginWithGithub}>
            <FontAwesomeIcon icon={faGithub}/>
            
            Login with GitHub
        </button>
        </>
    )
}