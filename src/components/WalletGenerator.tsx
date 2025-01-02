"use client";
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import AddressCard from "./AddressCard";

function WalletGenerator() {
  const [mnemonic, setMnemonic] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState<
    { publicKey: string; privateKey: string }[]
  >([]);
  const [alert, setAlert] = useState(false);
  const { toast } = useToast();

  const showAlert = () => {
    setAlert(true); // Show alert
    setTimeout(() => {
      setAlert(false); // Hide alert after 2 seconds
    }, 2000); // 2000 ms = 2 seconds
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(mnemonic)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Make sure you write the key phrase somewhere safe.",
        });
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  const handleClear = () => {
    setMnemonic(""); // Clears the mnemonic value
    setCurrentIndex(0); // Optionally clear currentIndex
    setAddresses([]); // Optionally clear addresses

    // Clear the data from localStorage
    localStorage.removeItem("mnemonic");
    localStorage.removeItem("currentIndex");
    localStorage.removeItem("addresses");
  };

  const handleDelete = (index: number) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);

    // Update localStorage with the new addresses after deletion
    if (updatedAddresses.length > 0) {
      localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
    } else {
      // If no addresses left, remove it from localStorage
      localStorage.removeItem("addresses");
    }
  };

  // LOCAL STORAGE CODE
  // Load data from localStorage
  useEffect(() => {
    const storedMnemonic = localStorage.getItem("mnemonic");
    const storedIndex = localStorage.getItem("currentIndex");
    const storedAddresses = localStorage.getItem("addresses");

    if (storedMnemonic) {
      setMnemonic(storedMnemonic);
    }
    if (storedIndex) {
      setCurrentIndex(Number(storedIndex));
    }
    if (storedAddresses) {
      setAddresses(JSON.parse(storedAddresses));
    }
  }, []);

  // Store data in localStorage whenever the state changes
  useEffect(() => {
    if (mnemonic) {
      localStorage.setItem("mnemonic", mnemonic);
    }
  }, [mnemonic]);

  useEffect(() => {
    if (currentIndex !== 0) {
      localStorage.setItem("currentIndex", String(currentIndex));
    }
  }, [currentIndex]);

  useEffect(() => {
    if (addresses.length > 0) {
      localStorage.setItem("addresses", JSON.stringify(addresses));
    } else {
      // If there are no addresses, remove it from localStorage
      localStorage.removeItem("addresses");
    }
  }, [addresses]);

  async function GenerateMnemonic() {
    const mnemonic = await generateMnemonic();
    setMnemonic(mnemonic);
  }

  async function GenerateKeys() {
    if (mnemonic !== "") {
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;

      const keypair = Keypair.fromSecretKey(secret);
      const privateKey = Buffer.from(keypair.secretKey).toString("hex"); // Convert Uint8Array to hex string
      const publicKey = keypair.publicKey.toBase58();

      setCurrentIndex(currentIndex + 1);
      setAddresses([
        ...addresses,
        { publicKey: publicKey, privateKey: privateKey },
      ]);
    } else {
      showAlert();
    }
  }

  return (
    <div className="p-4">
      <div>
        <Textarea value={mnemonic} readOnly />
        <div className="mt-4 flex space-x-4">
          <Button onClick={handleCopy}>Copy</Button>
          <Button onClick={handleClear} variant="destructive">
            Clear
          </Button>
        </div>
      </div>

      <Button onClick={GenerateMnemonic} className="my-4" disabled={currentIndex}>
        Generate Seed Phrase
      </Button>
      <Button onClick={GenerateKeys} className="mx-4">
        Generate Keys
      </Button>

      {addresses.map((data, index) => (
        <AddressCard
          address={data}
          key={index}
          onDelete={() => handleDelete(index)}
        />
      ))}

      {alert && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Please create a seed phrase first !!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default WalletGenerator;
