async function main() {
  const r1 = await fetch('http://localhost:3000/api/artists');
  const data1 = await r1.json();
  console.log("All artists:", data1);

  const newArtist = { name: 'Taylor Swift' };
  const r2 = await fetch('http://localhost:3000/api/artists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newArtist),
  });
  const data2 = await r2.json();
  const newArtistId = data2.id;
  console.log("New artist created:", data2);

  const r3 = await fetch(`http://localhost:3000/api/artists/${newArtistId}`);
  const data3 = await r3.json();
  console.log("New artist: found", data3);
  
  const r4 = await fetch(`http://localhost:3000/api/artists/999`, {
    method: 'GET',
  });
  const data4 = await r4.json();
  console.log("Artist not found:", data4);
}

main();