

const apiUrl = process.env.REACT_APP_API_URL;

export const login = async (username, password) => {
  const response = await fetch(`${apiUrl}/api/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

