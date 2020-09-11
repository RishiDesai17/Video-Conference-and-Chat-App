import { useRef } from 'react';

const useWillMount = (fn: () => void, loggedIn: boolean) => {
    const currentState = useRef(false);
    if (currentState.current !== loggedIn) {
      currentState.current = loggedIn;
      fn();
    }
}

export default useWillMount;