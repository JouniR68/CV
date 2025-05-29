import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "./LoginContext";
import userIds from './User/userData'

export const doSignInWithGoogle = async () => {
    //const navigate = useNavigate();
    try {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)

        if (result.user.uid != userIds.ADMIN) {
            console.log("Invalid authentication")
            doSignOut()
        }
        else {
            console.log(result.user.displayName + " signed in.")
            return result.user.displayName;
        }

    } catch (err) {
        console.error("Error during authentication: ", err)
        return null

    }
}

export const doSignOut = () => {
    return auth.signOut();
}
