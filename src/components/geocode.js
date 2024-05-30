export const fetchCoordinates = async (postcode, apiKey) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&key=${apiKey}`);
    const data = await response.json();
    if (data.results && data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    }
    throw new Error('No coordinates found for the given postcode');
  };
