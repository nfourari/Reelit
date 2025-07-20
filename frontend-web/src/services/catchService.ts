// Service to help call backend /api/catches

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface CatchPayload
{
  species: string;
  weight: number;
  length: number;
  location: string;
  comment?: string;
}

export async function addCatchHelper(catchData: CatchPayload, jwtToken: string): Promise<any>
{
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('JTW Token passed to API:', jwtToken);
  console.log('Catch Data:', catchData);

  const response = await fetch('/api/catches',
    {
      method: 'POST',
      headers:
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }, 
      body: JSON.stringify(catchData)
    });

    if (!response.ok)
    {
      const dataError = await response.json();
      throw new Error(dataError.message || 'ERROR: Failed to add catch');
    }

    return response.json();
}