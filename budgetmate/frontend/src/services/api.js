const apiUrl = process.env.REACT_APP_API_URL;

export const login = async (email, password) => {
  const response = await fetch(`${apiUrl}/api/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

export const register = async (email, password) => {
  const response = await fetch(`${apiUrl}/api/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
};
