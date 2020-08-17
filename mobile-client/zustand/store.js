import React from 'react';
import create from 'zustand'

const [useStore] = create(set => ({
    inMeet: false,
    changeInMeet: () => set(state => ({ inMeet: !state.inMeet })),
}))

export default useStore