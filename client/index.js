const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

async function main() {
  // Get name from command line arguments
  const name = process.argv[2];

  if (!name) {
    console.error('Please provide a name as a command line argument.');
    return;
  }

  // Prove to the server we're on the nice list
  const merkleTree = new MerkleTree(niceList);
  const root = merkleTree.getRoot();

  // find the proof that the provided name is on the list
  const index = niceList.findIndex(n => n === name);
  const proof = merkleTree.getProof(index);

  try {
    const { data: gift } = await axios.post(`${serverUrl}/gift`, {
      proof,
      name
    });

    console.log({ gift });
  } catch (error) {
    console.error('Error requesting gift:', error.message);
  }
}

main();