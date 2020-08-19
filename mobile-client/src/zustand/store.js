import create from 'zustand';

const [useStore] = create(set => ({
    inMeet: false,
    isLoggedIn: false,
    roomID: null,
    host: null,
    setMeetState: ({ inMeet, roomID, host }) => set(state => ({ inMeet, roomID, host })),
    setLoginState: (boolean) => set(state => ({ isLoggedIn: boolean }))
}))

export default useStore