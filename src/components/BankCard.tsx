import React from "react";
import { AiOutlineEdit } from "react-icons/ai";

interface BankCardProps {
  bankName: string;
  logoUrl?: string;
  available: string;
  used: string;
  onEdit: () => void;
}

export function BankCard({ bankName, logoUrl, available, used, onEdit }: BankCardProps) {
  const availableNumber = parseFloat(available) || 0; 
  const usedNumber = parseFloat(used) || 0;
  const percentageUsed = availableNumber
    ? (usedNumber / availableNumber) * 100
    : 0; 

  return (
    <div
      className="w-full h-50 bg-[#081E33] rounded-lg shadow-md relative p-4 flex flex-col justify-between"
    >
      <div className="flex items-center space-x-4">
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Logo"
            className="w-12 h-12 object-cover rounded-full border-2 border-[#3E5063] mb-4"
          />
        )}
        <span className="text-lg font-semibold text-white mb-4">{bankName}</span>
      </div>

      <div className="flex flex-col">
        <div className="text-sm text-[#def1ff] mb-2">Limite Disponível</div>
        <div className="text-3xl font-bold text-white mb-2">
          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
            availableNumber - usedNumber
          )}
        </div>
        <div className="w-3/4 bg-[#3E5063] rounded-full h-2">
          <div
            className="bg-green-400 h-2 rounded-full"
            style={{ width: `${percentageUsed}%` }}
          />
        </div>
      </div>

      <button
        onClick={onEdit}
        className="absolute bottom-4 right-4 w-10 h-10 bg-[#3E5063] hover:bg-[#3E5063] text-white rounded-full flex items-center justify-center shadow-md"
      >
        <AiOutlineEdit className="text-xl" />
      </button>
    </div>
  );
}

export default BankCard;