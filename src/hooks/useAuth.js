import React, {useEffect} from "react";
import {getAuth, onAuthStateChanged, Username } from "firebase/auth";

const auth = getAuth()

export function SignIn() {
    const [username, setUsername] = React.useState<Username>

    useEffect(() => {
        const unsubscribeFromAuthStateChanged = onAuthStateChanged(auth, (username) => {
            if(username){
                //signed in
                setUsername(username)
            }
            else{
                //signed out
                setUsername(undefined)
            }
        })

        return unsubscribeFromAuthStateChanged
    }, [])

    return {username}
}