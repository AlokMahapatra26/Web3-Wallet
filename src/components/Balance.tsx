"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

function Balance() {
  const [cryptoData, setCryptoData] = useState(0); // Fixed typo in state name
  const [address, setAddress] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const { toast } = useToast();

  async function scan() {
    try {
      if (!address) {
        toast({
          title: "Invalid Address",
          description: "Please enter a valid wallet address.",
        });
        return;
      }

      const rpcUrl = process.env.NEXT_PUBLIC_RPC_REQUEST;

      const response = await fetch(
        rpcUrl ,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getBalance",
            params: [address],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const sol = Number(data.result?.value || 0) / 1_000_000_000; // Convert lamports to SOL
      setCryptoData(sol);

      // Toast based on the SOL balance
      if (sol === 0) {
        toast({
          title: "You are broke af",
          description: "0 SOL in your address he he !!",
        });
      } else {
        toast({
          title: "Balance Retrieved",
          description: `Your balance is ${sol} SOL.`,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch the balance. Please try again later.",
      });
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setAddress(value);
    setButtonDisabled(!value.trim()); // Disable button if address is empty
  }

  return (
    <>
      <Input
        placeholder="Enter your solana wallet address"
        value={address}
        onChange={onChange}
        className="p-6"
      />
      <Button onClick={scan} disabled={buttonDisabled}>
        Scan
      </Button>
      <div className="mt-2  text-center   rounded-lg shadow-md">
  <span className="text-lg font-semibold text-gray-400">SOL Balance:</span>
  <span className=" ml-2 text-xl font-bold text-blue-500">
    {cryptoData || "0.00"}
  </span>
</div>

    </>
  );
}

export default Balance;
