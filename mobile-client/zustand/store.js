import create from 'zustand';

const [useStore] = create(set => ({
    inMeet: false,
    isLoggedIn: false,
    setMeetState: (boolean) => set(state => ({ inMeet: boolean })),
    setLoginState: (boolean) => set(state => ({ isLoggedIn: boolean }))
}))

export default useStore