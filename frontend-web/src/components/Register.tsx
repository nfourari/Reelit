import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register()
{
    const navigate = useNavigate();

    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
		const [isLoading, setIsLoading] = useState(false);
  	const [isSuccess, setIsSuccess] = useState(false);



    async function doRegister(e: React.FormEvent)
    {
        e.preventDefault();
        setError('');
				setIsLoading(true);

        try
        {
            const response = await fetch(
							'/api/register', 
							{
								method: 'POST',
								headers: {'Content-Type': 'application/json'},
								body: JSON.stringify(
									{
										login,
										email,
										firstName,
										lastName,
										password,
									})
							});

					const data = await response.json();

					if (!response.ok)
					{
						throw new Error(data.error ||  `HTTP ${response.status}`);
					}

					// Success!
					setIsSuccess(true);

					// Wait 1.5s so user sees a success message
					setTimeout(() => navigate('/'), 2000);

					// Registration successful, go to login page
					// navigate ('/');
				}
				catch (err: any)
				{
					setError(err.message || 'Registration failed');
				}
				finally
				{
					setIsLoading(false);
				}
		}

		// If success, show full-screen success message
		if (isSuccess)
		{
			return (
				<p className="text-green-600 text-xl">
					🎉 Account created! Redirecting to log in…
				</p>
			);
		}

		return (
					<div className="bg-gray-800 text-white rounded-lg shadow-lg max-w-md w-full p-8">

					<form onSubmit={doRegister} className="space-y-5">

						<div className="flex flex-col">
							<label htmlFor="usernname" className="mb-1 font-medium">Username</label>
							<input
								type="text" value={login} onChange={e => setLogin(e.target.value)}
								placeholder="Username"
								className="bg-gray-700 placeholder-gray-400 text-white rounded px-3 py-2 
													 focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>
	
						<div className="flex flex-col">	
							<label htmlFor="email" className="mb-1 font-medium">Email</label>
							<input
									type="email"
									value={email}
									onChange={e => setEmail(e.target.value)}
									placeholder="you@example.com"
									className="bg-gray-700 placeholder-gray-400 text-white rounded px-3 py-2
														focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col">
								<label htmlFor="firstName" className="mb-1 font-medium">First Name</label>
								<input 
									type="text"
									value={firstName}
									onChange={e => setFirstName(e.target.value)}
									placeholder="First Name"
									className="bg-gray-700 placeholder-gray-400 text-white rounded px-3 py-2
														focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>
							<div className="flex flex-col">	
								<label htmlFor="lastName" className="block mb-1">Last Name</label>
								<input
									type="text"
									value={lastName}
									onChange={e => setLastName(e.target.value)}
									placeholder="Last Name"
									className="bg-gray-700 placeholder-gray-400 text-white rounded px-3 py-2
														focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>
						</div>

						<div className="flex flex-col">
							<label htmlFor="password" className="mb-1 font-medium">Password</label>
							<input
								type="password"
								value={password}
								onChange={e => setPassword(e.target.value)}
								placeholder="Password"
								className="bg-gray-700 placeholder-gray-400 text-white rounded px-3 py-8
														focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>

						<button type="submit" disabled={isLoading} className="w-full bg-blue-500 hover:bg-blue-600 text-white
																																	font-semibold py-2 rounded focus:outline-none focus:ring-2 
																																	focus:ring-blue-400 disabled:opacity-50">
							{isLoading ? 'Creating account…' : 'Register'}
						</button>
						
						{error && <p className="text-red-400 text-center mt-2">{error}</p>}
						
					</form>

					
					<p className="mt-6 text-sm text-center text-gray-400">Already have an account?{' '}
						<Link to="/" className="text-blue-600 hover:underline">Log in</Link>
					</p>
				</div>
		);
}
