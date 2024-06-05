export const fetchCoordinates = async (postcode, apiKey) => {
  const response = await fetch('https://geocode-microservice-ckrgg2nlsa-nw.a.run.app/fetch-coordinates', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ postcode, apiKey })
  });

  const data = await response.json();
  if (data.lat && data.lng) {
      return { lat: data.lat, lng: data.lng };
  }
  throw new Error('No coordinates found for the given postcode');
};