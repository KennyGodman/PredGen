export async function switchGenLayerNetwork() {
  if (typeof window === 'undefined' || !window.ethereum) return false;
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x107d' }], // 4221 in hex (Bradbury Testnet)
    });
    return true;
  } catch (error) {
    // Chain not added error code
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x107d',
              chainName: 'GenLayer Testnet Bradbury',
              nativeCurrency: {
                name: 'GEN',
                symbol: 'GEN',
                decimals: 18,
              },
              rpcUrls: ['https://rpc-bradbury.genlayer.com'],
              blockExplorerUrls: ['https://explorer-bradbury.genlayer.com'],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Error adding GenLayer chain:', addError);
        return false;
      }
    }
    console.error('Error switching to GenLayer chain:', error);
    return false;
  }
}

export async function getGenBalance(address) {
  try {
    const response = await fetch("https://rpc-bradbury.genlayer.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1,
      }),
    });
    const data = await response.json();
    if (data.result) {
      const wei = BigInt(data.result);
      const balance = Number(wei) / 1e18;
      return parseFloat(balance.toFixed(2));
    }
  } catch (error) {
    console.error("Error fetching live GEN balance:", error);
  }
  // Safe default mockup balance if RPC query fails/unconnected
  return 10000;
}

export async function getContractState(contractAddress) {
  try {
    const response = await fetch("https://rpc-bradbury.genlayer.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "gen_getContractState",
        params: [contractAddress],
        id: 2,
      }),
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching contract state:", error);
  }
  return null;
}

export async function sendResolveTransaction(contractAddress, userAddress) {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error("No ethereum wallet injected.");
  }
  try {
    // Submit a request to invoke the resolve transaction on the GenVM ledger.
    const response = await fetch("https://rpc-bradbury.genlayer.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "gen_sendTransaction",
        params: [{
          from: userAddress,
          to: contractAddress,
          data: {
            method: "resolve",
            args: []
          }
        }],
        id: 3,
      }),
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || "Failed to submit resolve transaction.");
    }
    return data.result; // Returns the transaction hash
  } catch (error) {
    console.error("Error sending resolve transaction:", error);
    throw error;
  }
}

export function getDeterministicTxHash(id) {
  let hash = 0;
  const str = String(id || 'default');
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  let hex = '';
  // Generate 64 hex characters deterministically
  for (let i = 0; i < 64; i++) {
    const val = Math.abs((hash + i * 2654435761) % 16);
    hex += val.toString(16);
  }
  return '0x' + hex;
}
