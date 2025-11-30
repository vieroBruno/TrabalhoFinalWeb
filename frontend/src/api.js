
export const API_BASE = "http://localhost/trabalhoFinalWeb/TrabalhoFinalWeb/back-end/src"; 

export const fetchAPI = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE}/${endpoint}`, options);
  return response.json();
};