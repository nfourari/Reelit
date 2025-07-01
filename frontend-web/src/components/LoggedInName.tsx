function LoggedInName()
{
<<<<<<< Updated upstream
=======
  function doLogout(event:any) : void
  {
    event.preventDefault();
  
    localStorage.removeItem('user_data');
    window.location.href = '/'; // Redirect to home page
    // navigate('/'); // Alternatively, use navigate if you have it set up
  };
>>>>>>> Stashed changes

    //var user={}

    function doLogout(event:any) : void
    {
	    event.preventDefault();
		
        alert('doLogout');
    };    

    return(
      <div id="loggedInDiv">
        <span id="userName">Logged In As John Doe </span><br />
        <button type="button" id="logoutButton" className="buttons" 
           onClick={doLogout}> Log Out </button>
      </div>
    );
};

export default LoggedInName;
