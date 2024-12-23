import React from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

interface ProjetosCardProps {
  name: string;
  projectTypes: string;
  value: number;
  amountPaid: number; 
  imageUrl: string;
  status: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ProjetosCard: React.FC<ProjetosCardProps> = ({
  name,
  projectTypes,
  value,
  amountPaid,
  imageUrl,
  status,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full h-48 bg-[#081E33] rounded-lg shadow-md relative p-4 flex flex-col justify-between">

      <div className="flex items-center mb-4">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
        )}
        <div>
          <h3 className="text-xl font-semibold text-white">{name}</h3>
        </div>
      </div>
      <p className="text-md font-semibold text-[#def1ff]">{projectTypes}</p>

      <div className="flex justify-between">
        <div className="text-md text-white flex justify-between gap-6">
          <p className="text-md text-green-400">$ {value.toFixed(2)}</p>
          $ {(amountPaid ?? 0).toFixed(2)}
        </div>

      <div className="flex justify-end items-end">

        <p
          className={`text-md ${status === "Finished" ? "text-green-400" : "text-yellow-400"
            }`}
        >
          {status}
        </p>

        <div className="absolute top-2 right-2 flex flex-col space-y-2">
          <button
            onClick={onEdit}
            className="w-8 h-8 bg-[#3E5063] text-white rounded-full flex items-center justify-center"
          >
            <AiOutlineEdit className="text-xl" />
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
          >
            <AiOutlineDelete className="text-xl" />
          </button>
        </div>
       </div>
      </div>
    </div>
  );
};

export default ProjetosCard;