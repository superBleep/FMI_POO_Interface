import EmailLogin from "../components/EmailLogin";
import GitHubLogin from "../components/GitHubLogin";
import { useEffect, useState} from "react";
export default function Login({callback}) {
    const [isLogged, setLogged] = useState(false);
    useEffect(()=> {
        callback(isLogged);
    }
    , [isLogged])
    const loginCallback = (bool) => {
        setLogged(bool);
    }
    return (
        <>
            <EmailLogin />
            <GitHubLogin callback = {loginCallback}/>
        </>
    )
}