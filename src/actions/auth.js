import { types } from "../types/types"
import { firebase, googleAuthProvider } from '../firebase/firebase-config'
import { finishLoading, startLoading } from "./ui";
import Swal from 'sweetalert2'


//log in is a asynchronous operation, so it's useful to have a dispatch function


export const startLoginEmailPassword = ( email, password ) => {
    return ( dispatch ) => {
        dispatch(startLoading());
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then( ({user}) => {
                setTimeout(() => {
                    dispatch( login(user.uid, user.displayName) );
                    dispatch(finishLoading());
                }, 1000)
            }

            ).catch( e => {
                dispatch(finishLoading());
                Swal.fire('Fail', e.message, 'error');
            })
    }
}

export const startRegisterWithEmailPassword = ( email, password, name ) => {
    return ( dispatch ) => {
        firebase.auth().createUserWithEmailAndPassword( email, password )
            .then( async ({user}) => {
                await user.updateProfile({
                    displayName:name
                });
                dispatch( login(user.uid, user.displayName))
            }).catch( e => {
                console.error( e );
                Swal.fire('Fail', e.message, 'error');
            })
    }
}

export const startGoogleLogin = () => {
    return ( dispatch ) => {
        firebase.auth().signInWithPopup( googleAuthProvider )
            .then( ({user}) => {
                dispatch( login(user.uid, user.displayName))
            })
    }
}

export const login = (uid, displayName) => ({
    type: types.login,
    payload: {
        uid,
        displayName
    }
    
});

export const startLogout = () => {
    return async (dispatch) =>{
        await firebase.auth().signOut();
        dispatch(logout());
    }
}


export const logout = () => ({
    type: types.logout   
})