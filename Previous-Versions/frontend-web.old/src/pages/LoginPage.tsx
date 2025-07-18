import PageTitle from '../components/PageTitle.tsx';
import Login from '../components/Login.tsx';
import { Link } from 'react-router-dom';

const LoginPage = () =>
{

    return(
      <div>
        <PageTitle title="Shuzzy - Fishing Simplified" />
        <Login />

        <p className="mt-4 text-sm text-center">
          Don't have an account?{' '}
          <Link 
            to="/register" className="text-blue-600 hover:underline">Create an account
          </Link>
        </p>
      </div>
    );
};

export default LoginPage;
