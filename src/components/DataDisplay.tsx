"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

function DataDisplay() {
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSolBalance = async (forceRefresh = false) => {
    const storedAddresses = localStorage.getItem("addresses");
    
    // Ensure the storedAddresses is available and can be parsed
    if (!storedAddresses) {
      setError("No addresses found in local storage.");
      setSolBalance(0);
      setLoading(false);
      return;
    }

    try {
      const parsedAddresses = JSON.parse(storedAddresses);

      // Ensure the parsedAddresses contains valid data
      if (!Array.isArray(parsedAddresses) || !parsedAddresses[0]?.publicKey) {
        setError("Invalid address data in local storage.");
        setSolBalance(0);
        setLoading(false);
        return;
      }

      const publicKey = parsedAddresses[0].publicKey;

      // Check if cached balance exists and is valid
      const cachedBalance = localStorage.getItem(`balance_${publicKey}`);
      if (cachedBalance && !forceRefresh) {
        setSolBalance(parseFloat(cachedBalance));
        setLoading(false);
        return;
      }

      const rpcUrl = process.env.NEXT_PUBLIC_RPC_REQUEST; // Mainnet RPC URL

      const body = JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [publicKey],
      });

      setLoading(true);
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        setError("Error fetching balance from the server.");
        setLoading(false);
      } else {
        // The balance is returned in lamports, so divide by 10^9 to get SOL
        const balanceInSol = data.result.value / 10 ** 9;
        setSolBalance(balanceInSol);

        // Cache the fetched balance
        localStorage.setItem(`balance_${publicKey}`, balanceInSol.toString());
        setLoading(false);
      }
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(`Error: ${err.message}`);
          } else {
            setError("An unexpected error occurred.");
          }
          setLoading(false);
    }
  }

  // Fetch balance on initial render
  useEffect(() => {
    fetchSolBalance();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black border rounded-lg shadow-lg mt-2">
  <div className="text-lg font-semibold text-gray-700">
    {loading && <div className="animate-pulse">Fetching balance...</div>}
    {error && <div className="text-red-600">{error}</div>}
    {!loading && !error && (
      <div className="text-2xl font-bold text-blue-600">
        {solBalance?.toFixed(4)} SOL
      </div>
    )}
  </div>
  <Button
    onClick={() => fetchSolBalance(true)} className="mt-2" variant="outline">
    Refresh Balance
  </Button>
</div>

  );
}

export default DataDisplay;
