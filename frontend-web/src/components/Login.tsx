// frontend/src/pages/LoginPage.tsx
import { useState } from 'react';
import { post } from '../utils/api';  // <-- our helper

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await post<{ token: string }>('login', { username, password });
      // e.g. store token, redirect, etc.
      console.log('Logged in, got token:', result.token);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Log in</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}


// function Login()
// {


//   function doLogin(event:any) : void
//   {
//     event.preventDefault();

//     alert('doIt()');
//   }

//     return(
//       <div id="loginDiv">
//         <span id="inner-title">PLEASE LOG IN</span><br />
//         <input type="text" id="loginName" placeholder="Username" /><br />
//         <input type="password" id="loginPassword" placeholder="Password" /><br />
//         <input type="submit" id="loginButton" className="buttons" value = "Do It"
//           onClick={doLogin} />
//         <span id="loginResult"></span>
//      </div>
//     );
// };

// export default Login;
