import { useState } from "react";
import { Eye, EyeOff, Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function AddressCard({ address, onDelete }: { address: { publicKey: string; privateKey: string }; onDelete: () => void }) {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Keys copied successfully",
        description: "Make sure you write the key phrase somewhere safe.",
      });
    });
  };

  return (
    <div className="my-2 p-4 bg-black border border-gray-700 rounded-lg shadow-lg w-full flex flex-col space-y-4">
      {/* Public Key */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-gray-400 font-semibold text-base">{`Public Key:`}</p>
          <p className="text-white text-sm break-all">{address.publicKey}</p>
        </div>
        <button
          onClick={() => handleCopy(address.publicKey)}
          className="text-gray-400 hover:text-gray-200 transition flex items-center space-x-1"
          aria-label="Copy Public Key"
        >
          <Copy className="h-5 w-5" />
          <span className="text-xs">Copy</span>
        </button>
      </div>

      {/* Private Key with Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-gray-400 font-semibold text-base">{`Private Key:`}</p>
          <div className="flex items-center space-x-2">
            <p className={`text-white text-sm break-all ${showPrivateKey ? "" : "blur-md"}`}>
              {address.privateKey}
            </p>
            <button
              onClick={() => setShowPrivateKey(!showPrivateKey)}
              className="text-gray-400 hover:text-gray-200 transition"
              aria-label={showPrivateKey ? "Hide Private Key" : "Show Private Key"}
            >
              {showPrivateKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <button
          onClick={() => handleCopy(address.privateKey)}
          className="text-gray-400 hover:text-gray-200 transition flex items-center space-x-1"
          aria-label="Copy Private Key"
        >
          <Copy className="h-5 w-5" />
          <span className="text-xs">Copy</span>
        </button>
      </div>

      {/* Delete Button */}
      <div className="flex justify-end">
        <button
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded transition duration-300 flex items-center"
          aria-label="Delete Address"
        >
          <Trash2 className="h-5 w-5 mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
}

export default AddressCard;
