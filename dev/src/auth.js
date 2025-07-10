import { CLIENT_ID, SECRET, tokenUrl, baseUrl } from './constants.js';

async function getAccessToken() {
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${SECRET}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials'
    })
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du token');
  }

  const data = await response.json();
  return data.access_token;
}

async function wow(endpoint) {
  const accessToken = await getAccessToken();
  const response = await fetch(baseUrl + endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Erreur lors de l\'appel API');
  }

  return await response.json();
}

export {
  getAccessToken,
  wow
}