import create, { SetState } from 'zustand';
import axios from 'axios';

type State = {
    loading: boolean,
    loggedIn: boolean,
    profile: Profile,
    init: (getprofile: boolean) => void,
    login: (email: string, password: string) => void
}

type Profile = {
    name: string,
    email: string
}

const INIT_STATE = {
    loading: true,
    loggedIn: false,
    profile: {
        name: "",
        email: ""
    }
}

const useStore = create<State>(set => ({
    ...INIT_STATE,
    init: (getprofile) => init(set, getprofile),
    login: (email: string, password: string) => login(set, email, password)
}))

const init = async(set: SetState<State>, getprofile: boolean) => {
    try {
        const response = await axios.post('api/users/refresh',
            JSON.stringify({
                getprofile
            }),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        console.log(response.data)
        let modified_state: {
            loading: boolean,
            loggedIn: boolean,
            profile?: Profile
        } = {
            loading: false,
            loggedIn: true
        }
        if(getprofile) {
            modified_state.profile = response.data.profile
        }
        set(modified_state)
    }
    catch(err) {
        console.log(err)
        set({
            loading: false
        })
    }
}

const login = async(set: SetState<State>, email: string, password: string) => {
    try{
        const response = await axios.post('api/users/login', 
            JSON.stringify({
                email: email,
                password: password
            }),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        console.log(response.data)
        set({
            loggedIn: true,
            profile: response.data.profile
        })
        return true
    }
    catch(err){
        console.log(err)
        // alert
        return false
    }
}

export default useStore