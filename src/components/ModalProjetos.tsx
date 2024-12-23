import React from "react";

interface ModalProjetosProps {
  onClose: () => void;
  onSave: () => void;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  projectTypes: string[];
  setProjectTypes: React.Dispatch<React.SetStateAction<string[]>>;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  amountPaid: number;
  setAmountPaid: React.Dispatch<React.SetStateAction<number>>;
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  isEditMode: boolean;
}

const ModalProjetos = ({
  onClose,
  onSave,
  name,
  setName,
  projectTypes,
  setProjectTypes,
  value,
  setValue,
  amountPaid,
  setAmountPaid,
  imageUrl,
  setImageUrl,
  status,
  setStatus,
  isEditMode,
}: ModalProjetosProps) => {
  const handleTypeChange = (type: string) => {
    setProjectTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type]
    );
  };

  return (
    <div className="fixed inset-0 bg-[#081E33] bg-opacity-80 flex justify-center items-center">
      <div className="bg-[#3E5063] p-6 rounded-lg shadow-lg w-96 text-white">
        <h3 className="text-xl font-semibold mb-4">
          {isEditMode ? "Editar Projeto" : "Adicionar Projeto"}
        </h3>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">
            Nome do Projeto
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Tipo do Projeto</label>
          <div className="space-y-2">
            {["Design", "Desenvolvimento", "Ajuste"].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={projectTypes.includes(type)}
                  onChange={() => handleTypeChange(type)}
                  className="h-4 w-4"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="value" className="block text-sm font-medium">
            Valor
          </label>
          <input
            type="number"
            id="value"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="amountPaid" className="block text-sm font-medium">
            Valor Pago
          </label>
          <input
            type="number"
            id="amountPaid"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            value={amountPaid}
            onChange={(e) => setAmountPaid(parseFloat(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-sm font-medium">
            URL da Imagem
          </label>
          <input
            type="text"
            id="imageUrl"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
          >
            <option value="Trabalhando">Trabalhando</option>
            <option value="Pausado">Pausado</option>
            <option value="Finalizado">Finalizado</option>
          </select>
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

export default ModalProjetos;