
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';


export interface UserProfile
{
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  totalCatches: number,
  createdAt: string;
  updatedAt: string;          
}


export interface ApiError
{
  message: string;
  status: number;
}


export class UserServiceError extends Error
{
  status: number;

  constructor(message: string, status: number)
  {
    super(message);
    this.status = status;
    this.name = 'UserServiceError';
  }
}


/**
 * Get user profile from backend
 * Requires valid JWT token in localStorage
 */
export async function getUserProfile(): Promise<UserProfile>
{
  const userToken = localStorage.getItem('token');

  if (!userToken)
  {
    throw new UserServiceError('No authentication token found', 401)
  }

  try
  {
    const response = await fetch('/api/users/profile', 
      {
        method: 'GET',
        headers: 
        {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }

      }
    );

    if (!response.ok)
    {
      const errorData = await response.json().catch( () => ({}) );
      throw new UserServiceError
      (
        errorData.message || `HTTP ${response.status}: Failed to fetch profile`,
        response.status
      );
    }
    
    const userData: UserProfile = await response.json();
    return userData;

  } 
  catch (error)
  {
    if (error instanceof UserServiceError)
      throw error;

    // Network or other errors
    throw new UserServiceError
    (
      'Unable to connect to server. Please check your internet connection.',
      0
    );
  }
}


/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean
{
  return !!localStorage.getItem('token');
}


/**
 * Clear authentication token
 */
export function clearAuth(): void
{
  localStorage.removeItem('token');
}