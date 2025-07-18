
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import type { User } from '../utils/auth';

export default function CardUI()
{
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newCard, setNewCard] = useState('');
    const [results, setResults] = useState<string[]>([])
    const [message, setMessage] = useState('');

    // On mount, load user
    useEffect(() =>
    {
        const u = getCurrentUser();
        if (!u)
        {
            window.location.href = '/';
            return;
        }
        setUser(u);
    }, [navigate]);

    if (!user) return null;

    

    async function addCard(event: React.MouseEvent)
    {
        event.preventDefault();
        setMessage('');
        if (!user) 
				{
					setMessage('User not loaded');
					return;
        }
        try
        {
					const res = await fetch('/api/addcard', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify( { userId: user.id, card: newCard})
					});

					if (!res.ok) throw new Error(`HTTP ${res.status}`);

					const { error } = await res.json();
					if (error) throw new Error(error);
					setMessage('Card added!');
					setNewCard('');		// clear input field
        } 
				catch (err: any)
				{
					setMessage(err.message || 'Failed to add card');	
				}

    }

    async function searchCard(event: React.MouseEvent)
    {
			event.preventDefault();
			setMessage('');
			if (!user) 
			{
				setMessage('User not loaded');
				return;
			}
			try
			{
					const res = await fetch('/api/searchcards', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ userId: user.id, searchTerm }),
					});

					if (!res.ok) throw new Error(`HTTP ${res.status}`);
					const{ results: found, error } = await res.json();
					if (error) throw new Error(error);
					setResults(found);
			}
			catch(err: any)
			{
					setMessage(err.message || 'Search failed');
			}
	};


  return (
    <div id="accessUIDiv" className="space-y-4 p-4">
      <h2 className="text-xl font-semibold">Welcome, {user.firstName}</h2>

      {/* Search Section */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Card To Search For"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="input flex-1"
        />
        <button onClick={searchCard} className="button">
          Search Card
        </button>
      </div>
      {results.length > 0 && (
        <p>
          Found: <strong>{results.join(', ')}</strong>
        </p>
      )}

      {/* Add Card Section */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Card To Add"
          value={newCard}
          onChange={e => setNewCard(e.target.value)}
          className="input flex-1"
        />
        <button onClick={addCard} className="button">
          Add Card
        </button>
      </div>

      {/* Status Message */}
      {message && <p className="text-red-600">{message}</p>}
    </div>
  );
}

// return (
// 		<div id="accessUIDiv">
// 			<h2 className="text-xl font-semibold">Welcome, {user.firstName}</h2>
// 			<br />
// 			<input type="text" id="searchText" placeholder="Card To Search For" />
// 			<button type="button" id="searchCardButton" className="buttons" 
// 					onClick={searchCard}> Search Card </button><br />
// 			<span id="cardSearchResult"></span>
// 			<p id="cardList"></p><br /><br />
// 			<input type="text" id="cardText" placeholder="Card To Add" />
// 			<button type="button" id="addCardButton" className="buttons" 
// 					onClick={addCard}> Add Card </button><br />
// 			<span id="cardAddResult"></span>
// 		</div>
// 	);
// }