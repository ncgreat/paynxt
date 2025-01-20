export const loginUserAPI = async (email, password) => {
    const response = await fetch('http://localhost:3080/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  };
  
  export const registerGoogleAccountAPI = async (userData) => {
    const response = await fetch('http://localhost:3080/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  };
  