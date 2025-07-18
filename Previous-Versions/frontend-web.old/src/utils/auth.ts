export interface User 
{
    id: string;
    firstName: string;
    lastName: string;
    username: string;
}

export function getCurrentUser(): User | null
{
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try
    {
        return JSON.parse(raw) as User;
    }
    catch
    {
        localStorage.removeItem('user');
        return null;
    }
}