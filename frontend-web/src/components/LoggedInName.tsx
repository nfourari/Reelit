// Displays current user's name and provides a logout button.

// import React from 'react';
// import { useNavigate } from 'react-router-dom';

export default function LoggedInName()
{
  function doLogout(event:any) : void
  {
    event.preventDefault();
  
    localStorage.removeItem('user_data');
    window.location.href = '/'; // Redirect to home page
    // navigate('/'); // Alternatively, use navigate if you have it set up
  };

    return(
      <div id="loggedInDiv">
        <span id="userName">Logged In As John Doe </span><br />
        <button type="button" id="logoutButton" className="buttons" 
           onClick={doLogout}> Log Out </button>
      </div>
    );
};

