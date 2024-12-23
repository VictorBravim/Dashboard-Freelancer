import React from "react";
import { AiOutlineEdit } from "react-icons/ai";

interface MetaCardProps {
  name: string;
  value: number;
  savedValue: number;
  imageUrl?: string;
  onEdit: () => void;
}

const MetaCard: React.FC<MetaCardProps> = ({ name, value, savedValue, imageUrl, onEdit }) => {
  const progress = Math.min((savedValue / value) * 100, 100);
  const formattedValue = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  const formattedSaved = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(savedValue);

  return (
    <div className="w-full h-48 bg-[#081E33] rounded-lg shadow-md relative p-4 flex flex-col justify-between">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          className="w-16 h-16 rounded-full object-cover mb-4"
        />
      )}

      <div>
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        <p className="text-lg text-[#def1ff]">{formattedSaved} / {formattedValue}</p>
        <div className="w-full bg-[#3E5063] rounded-full h-2 mt-2 relative">
          <div
            className="bg-green-400 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        onClick={onEdit}
        className="absolute top-2 right-2 w-8 h-8 bg-[#3E5063] text-white rounded-full flex items-center justify-center"
      >
        <AiOutlineEdit className="text-xl" />
      </button>
    </div>
  );
};

export default MetaCard;