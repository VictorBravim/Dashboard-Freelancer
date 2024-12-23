import React from "react";

interface ModalProps {
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
  newTransaction: { month: string; earned: string; owed: string; transactionType: string };
  setNewTransaction: React.Dispatch<React.SetStateAction<{ month: string; earned: string; owed: string; transactionType: string }>>;
}

export function Modal({
  onClose,
  onSave,
  onDelete,
  newTransaction,
  setNewTransaction,
}: ModalProps) {
  return (
    <div className="fixed inset-0 bg-[#081E33] bg-opacity-80 flex justify-center items-center">
      <div className="relative bg-[#3E5063] p-6 rounded-lg shadow-lg w-96 text-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl hover:text-red-500"
        >
          &times;
        </button>

        <h3 className="text-xl font-semibold mb-4">Adicionar / Editar Transação</h3>

        <div className="mb-4">
          <label htmlFor="month" className="block text-sm font-medium">
            Mês
          </label>
          <input
            type="text"
            id="month"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            value={newTransaction.month}
            disabled
          />
        </div>

        <div className="mb-4">
          <label htmlFor="transactionType" className="block text-sm font-medium">
            Tipo de Transação
          </label>
          <input
            type="text"
            id="transactionType"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            value={newTransaction.transactionType}
            onChange={(e) =>
              setNewTransaction((prev) => ({ ...prev, transactionType: e.target.value }))
            }
          />
        </div>

        <div className="mb-4">
          <label htmlFor="earned" className="block text-sm font-medium">
            Ganhos
          </label>
          <input
            type="text"
            id="earned"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            value={newTransaction.earned}
            onChange={(e) =>
              setNewTransaction((prev) => ({ ...prev, earned: e.target.value }))
            }
          />
        </div>

        <div className="mb-4">
          <label htmlFor="owed" className="block text-sm font-medium">
            Dívidas
          </label>
          <input
            type="text"
            id="owed"
            className="w-full p-2 mt-1 border border-gray-600 rounded-md bg-[#3E5063] text-white"
            value={newTransaction.owed}
            onChange={(e) =>
              setNewTransaction((prev) => ({ ...prev, owed: e.target.value }))
            }
          />
        </div>

        <div className="flex justify-between mt-4">
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md w-40"
            >
              Excluir
            </button>
          )}
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