import React, { useEffect } from 'react';
import Navigator from "./src/navigation/Navigator";

const App = () => {
  useEffect(() => {
    initTest()
  }, [])

  const initTest = async() => {
    const response = await fetch("http://192.168.43.53:3001/test")
    const res = await response.text()
    console.log(res)
  }

  return (
    <>
      <Navigator />
    </>
  );
};

export default App;
