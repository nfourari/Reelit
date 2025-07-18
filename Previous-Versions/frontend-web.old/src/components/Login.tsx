
import React, { useState } from 'react';
import  { useNavigate } from 'react-router-dom'; 


// export default function LoginPage() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError]       = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const result = await post<{ token: string }>('login', { username, password });
//       // e.g. store token, redirect, etc.
//       console.log('Logged in, got token:', result.token);
//     } catch (err: any) {
//       setError(err.message || 'Login failed');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         value={username}
//         onChange={e => setUsername(e.target.value)}
//         placeholder="Username"
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={e => setPassword(e.target.value)}
//         placeholder="Password"
//       />
//       <button type="submit">Log in</button>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </form>
//   );
// }







export default function Login() 
{
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();


  async function doLogin(e: React.FormEvent) 
  {
		e.preventDefault();
		console.log('🛠️ doLogin fired', { username, password });
		// const url = buildPath('api/login');

		try 
		{
			const res = await fetch('/api/login', {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({login: username, password})
			});

			const data = await res.json();

			if (!res.ok) {
        		setError(data.error || `HTTP ${res.status}`);
				return;
    		}

			console.log('Login response →', data);

			
			// no error, so store user data and navigate
			console.log('Login successful, storing user data');
			setError('');
			localStorage.setItem('user', JSON.stringify(data));
			navigate('/shuzzy');
		} 

		catch(err)
		{
			if (err instanceof Error)
				setError(err.message);
			else
				setError('An unexpected error occurred');

			console.error('Login error:', err);
		}
	}

	return ( 
			<form onSubmit = {doLogin} className = "login-form">

				<input 
					name = "login"
					type = "text"
					placeholder = "Username"
					value = {username}
					onChange = {e => setUsername(e.target.value)}
					className = "input"
				/>

				<input
					type = "password"
					placeholder = "Password"
					value = {password} 
					onChange = {e => setPassword(e.target.value)}
					className = "input"
				/>
				<div>
					<button type = "submit" className= "button">Log In</button>
				</div>
				{error && <p className="text-red-600">{error} </p>}

			</form>
		);
}

