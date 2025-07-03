import React from 'react';
import PageTitle from '../components/PageTitle';
import Register from '../components/Register';

const RegisterPage: React.FC = () =>
	{
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 pt-10">
      	<div className="w-full max-w-lg">
					<PageTitle title="Create an Acccount" />
					<Register />
				</div>
			</div>
		);
			
	}

export default RegisterPage;