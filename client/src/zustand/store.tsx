import create, { SetState } from 'zustand';
import axios from 'axios';

type State = {
    loading: boolean,
    loggedIn: boolean,
    profile: Profile,
    access_token: string,
    init: (getprofile: boolean) => void,
    login: (email: string, password: string) => void,
    get_access_token: () => string
}

type Profile = {
    name: string,
    email: string
}

const INIT_STATE = {
    loading: true,
    loggedIn: false,
    access_token: "",
    profile: {
        name: "",
        email: ""
    }
}

const useStore = create<State>((set, get) => ({
    ...INIT_STATE,
    init: (getprofile) => init(set, getprofile),
    login: (email: string, password: string) => login(set, email, password),
    get_access_token: () => get().access_token
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
            access_token: string,
            profile?: Profile
        } = {
            loading: false,
            loggedIn: true,
            access_token: response.data.access_token
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
        const { access_token, profile } = response.data
        set({
            loggedIn: true,
            access_token: access_token,
            profile: profile
        })
    }
    catch(err){
        console.log(err)
    }
}

export default useStore