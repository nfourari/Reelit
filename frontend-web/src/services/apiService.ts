export const authApi = 
{
  login: async (email: string, password: string) => 
  {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  },

  signup: async (userData: 
  {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }
    return data;
  }
};

export const handleApiError = (error: any): string => 
{
  return error.message || 'An unexpected error occurred. Failed to create account.';
};