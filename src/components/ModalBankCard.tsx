import React from "react";

interface ModalBankCardProps {
  onClose: () => void;
  onSave: () => void;
  newCard: { name: string; logoUrl?: string; available: string; used: string };
  setNewCard: React.Dispatch<React.SetStateAction<{ name: string; logoUrl?: string; available: string; used: string }>>;
}

export function ModalBankCard({
  onClose,
  onSave,
  newCard,
  setNewCard,
}: ModalBankCardProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCard((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#081E33] bg-opacity-80 flex justify-center items-center">
      <div className="bg-[#3E5063] p-6 rounded-lg shadow-lg w-96 text-white">
        <h3 className="text-xl font-semibold mb-4">Adicionar Cartão</h3>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">
            Nome do Cartão
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            value={newCard.name}
            onChange={(e) =>
              setNewCard((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        <div className="mb-4">
          <label htmlFor="logo" className="block text-sm font-medium">
            Logo do Banco
          </label>
          <input
            type="file"
            id="logo"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            onChange={handleImageChange}
          />
          {newCard.logoUrl && <img src={newCard.logoUrl} alt="Logo" className="mt-2 w-16 h-16 object-cover rounded" />}
        </div>

        <div className="mb-4">
          <label htmlFor="available" className="block text-sm font-medium">
            Limite Total
          </label>
          <input
            type="text"
            id="available"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            value={newCard.available}
            onChange={(e) =>
              setNewCard((prev) => ({ ...prev, available: e.target.value }))
            }
          />
        </div>

        <div className="mb-4">
          <label htmlFor="used" className="block text-sm font-medium">
            Limite Usado (Opcional)
          </label>
          <input
            type="text"
            id="used"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            value={newCard.used || "0"}
            onChange={(e) =>
              setNewCard((prev) => ({ ...prev, used: e.target.value || "0" }))
            }
          />
        </div>

        <div className="w-full bg-[#3E5063] rounded-full h-2 mb-4">
          <div
            className="bg-green-400 h-2 rounded-full"
            style={{
              width: `${(parseFloat(newCard.used || "0") / parseFloat(newCard.available || "1")) * 100}%`,
            }}
          />
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
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}