import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

interface ModalMetaProps {
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  savedValue: number;
  setSavedValue: React.Dispatch<React.SetStateAction<number>>;
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  imageUrlInput: string;
  setImageUrlInput: React.Dispatch<React.SetStateAction<string>>;
  isEditMode: boolean;
}

const ModalMeta = ({
  onClose,
  onSave,
  onDelete,
  name,
  setName,
  value,
  setValue,
  savedValue,
  setSavedValue,
  imageUrl,
  setImageUrl,
  imageUrlInput,
  setImageUrlInput,
  isEditMode,
}: ModalMetaProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setImageUrlInput("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(e.target.value);
    setImageUrl(e.target.value);
  };

  return (
    <div className="fixed inset-0 bg-[#081E33] bg-opacity-80 flex justify-center items-center">
      <div className="bg-[#3E5063] p-6 rounded-lg shadow-lg w-96 text-white">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mb-4">{isEditMode ? "Editar Meta" : "Adicionar Meta"}</h3>
          {isEditMode && (
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-700"
            >
              <AiOutlineDelete className="text-2xl" />
            </button>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">Nome da Meta</label>
          <input
            type="text"
            id="name"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="value" className="block text-sm font-medium">Valor da Meta</label>
          <input
            type="number"
            id="value"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="savedValue" className="block text-sm font-medium">Valor Guardado</label>
          <input
            type="number"
            id="savedValue"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            value={savedValue}
            onChange={(e) => setSavedValue(Number(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-sm font-medium">URL da Imagem</label>
          <input
            type="url"
            id="imageUrl"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            value={imageUrlInput}
            onChange={handleUrlChange}
            placeholder="Insira o URL da imagem"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium">Ou, faça upload de uma imagem</label>
          <input
            type="file"
            id="image"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            onChange={handleImageChange}
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Imagem da Meta"
              className="mt-2 w-20 h-20 object-cover rounded-full"
            />
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#3E5063] hover:bg-[#081E33] text-white rounded-md w-40"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md w-40"
          >
            {isEditMode ? "Salvar Alterações" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalMeta;