import DataDisplay from "@/components/DataDisplay";
import { Button } from "@/components/ui/button";
import WalletGenerator from "@/components/WalletGenerator";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6 text-4xl flex flex-col lg:flex-row lg:space-x-4 lg:mx-[300px] md:mx-[50px] ">
    {/* Create Wallet Button */}
    <div>
    <Button
      variant="secondary"
      size="lg"
      className="w-full md:w-auto text-xl font-semibold shadow-md hover:shadow-lg transition duration-300 mt-2 "
    >
      <Link href="/generate" className="w-full text-center">
        Manage Wallet
      </Link>
    </Button>
    <Button
      variant="outline"
      size="lg"
      className="w-full md:w-auto text-xl font-semibold shadow-md hover:shadow-lg transition duration-300 mt-2 lg:ml-2 md:ml-2"
    >
      <Link href="/balance" className="w-full text-center">
        Solscan
      </Link>
    </Button>
    </div>
    <div>
      <DataDisplay/>
    </div>
   
    
    
  </div>

  );
}
