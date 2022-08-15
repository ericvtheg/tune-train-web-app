import React, { useCallback } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';

export const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RAZW1haWwuY29tIiwic3ViIjoxLCJpYXQiOjE2NTg5NzI1MjEsImV4cCI6MTY1OTA1ODkyMX0.CClkEr67yxt3KKA144OFanBcyaOML_jHdhBDlOWoxvU';

const App: React.FC = function() {
  const doSmthHandler = () => {
    fetch('http://localhost:3000/songs/random', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      } })
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  const doSmthHandlerWrapper = useCallback(
    () => doSmthHandler(),
    []
  );

  return (
    <div className='App'>
      <div>
        <a href='https://vitejs.dev' target='_blank' rel='noreferrer'>
          <img src='/vite.svg' className='logo' alt='Vite logo' />
        </a>
        <a href='https://reactjs.org' target='_blank' rel='noreferrer'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        {/* <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button> */}
        <button
          onClick={doSmthHandlerWrapper}
        >
          GET SOME DATA
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
};

export default App;
