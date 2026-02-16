//Simulating the API calls 
async function getAllArtists() {
  const response = await fetch('http://localhost:3000/api/artists');
  const data1 = await response.json();
  return data1;
}

async function createArtist(name) {
  const response = await fetch('http://localhost:3000/api/artists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  const data = await response.json();
  return data;
}

async function getArtistById(id) {
  const response = await fetch(`http://localhost:3000/api/artists/${id}`);
  const data = await response.json();
  return data;
}

async function updateArtist(id, name) {
  const response = await fetch(`http://localhost:3000/api/artists/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  const data = await response.json();
  return data;
}

async function deleteArtist(id) {
  const response = await fetch(`http://localhost:3000/api/artists/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  return data;
}


async function main() {
  const artists = await getAllArtists();
  console.log("All artists:", artists);

  const newArtist = await createArtist('Taylor Swift');
  console.log("New artist created:", newArtist);

  const artist = await getArtistById(newArtist.id);
  console.log("New artist: found", artist);

  const updatedArtist = await updateArtist(newArtist.id, 'Taylor Swifter');
  console.log("Artist updated:", updatedArtist);

  const deletedArtist = await deleteArtist(newArtist.id);
  console.log("Artist deleted:", deletedArtist);
}

main();