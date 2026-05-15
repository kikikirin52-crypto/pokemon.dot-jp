const axios = require('axios');

async function testPokemon(name) {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    console.log(`${name}: OK`);
  } catch (error) {
    console.log(`${name}: ERROR - ${error.response?.status} ${error.message}`);
  }
}

async function main() {
  await testPokemon('aegislash-shield');
  await testPokemon('mimikyu-disguised');
  await testPokemon('pikachu');
}

main();