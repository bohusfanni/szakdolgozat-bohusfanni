import React, {useEffect} from "react";
import {getAuth, onAuthStateChanged, Email } from "firebase/auth";

const auth = getAuth()

export function SignIn() {
    const [email, setEmail] = React.useState<Email>

    useEffect(() => {
        const unsubscribeFromAuthStateChanged = onAuthStateChanged(auth, (email) => {
            if(email){
                //signed in
                setUsername(email)
            }
            else{
                //signed out
                setUsername(undefined)
            }
        })

        return unsubscribeFromAuthStateChanged
    }, [])

    return {email}
}