export async function getAccessToken(code: string) {
  const response = await fetch('https://backend.vedanalytics.in/getAccessToken');
  const data = await response.json();
  return data;
}

export async function getUserData(access_token: string) {
  const response = await fetch('https://backend.vedanalytics.in/api/getUserData', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const data = await response.json();
  return data;
}
