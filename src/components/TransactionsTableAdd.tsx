import React, { useState, useEffect } from "react";
import { Modal } from "../components/Modal";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { addTransaction, updateTransaction, getTransactions, deleteTransaction } from "@/services/firestoreService";

export type Transaction = {
  id?: string;
  year: number;
  month: string;
  earned: string;
  owed: string;
  transactionType: string;
  paid: boolean;
};

type NewTransactionState = {
  month: string;
  earned: string;
  owed: string;
  transactionType: string;
  year?: number;
};

const monthsList = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

type TransactionsTableAddProps = {
  onTransactionsChange: (transactions: Transaction[]) => void;
};

export default function TransactionsTableAdd({ onTransactionsChange }: TransactionsTableAddProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<NewTransactionState>({
    month: "", earned: "", owed: "", transactionType: "Pagamento"
  });
  const [expandedMonths, setExpandedMonths] = useState<{ [month: string]: boolean }>({});
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const allTransactions = await getTransactions();
        setTransactions(allTransactions);
        onTransactionsChange(allTransactions);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
      }
    };
    fetchTransactions();
  }, []);

  const handleAddTransaction = async () => {
    try {
      const transaction: Transaction = {
        year: selectedYear,
        month: newTransaction.month,
        earned: parseCurrency(newTransaction.earned).toFixed(2),
        owed: parseCurrency(newTransaction.owed).toFixed(2),
        transactionType: newTransaction.transactionType,
        paid: false, 
      };

      const existingTransaction = transactions.find(
        (t) => t.month === transaction.month && t.year === transaction.year && t.transactionType === transaction.transactionType
      );

      if (existingTransaction?.id) {
        await updateTransaction(existingTransaction.id, transaction);
      } else {
        await addTransaction(transaction);
      }

      const updatedTransactions = await getTransactions();
      setTransactions(updatedTransactions);
      onTransactionsChange(updatedTransactions);

      setIsModalOpen(false);
      setNewTransaction({ month: "", earned: "", owed: "", transactionType: "Pagamento" });
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
    }
  };

  const handleYearChange = (direction: "prev" | "next") => {
    const newYear = direction === "next" ? selectedYear + 1 : selectedYear - 1;
    setSelectedYear(newYear);
  };

  const toggleMonthDropdown = (month: string) => {
    setExpandedMonths((prev) => ({ ...prev, [month]: !prev[month] }));
  };

  const parseCurrency = (value: string) => {
    if (!value || value.trim() === "") return 0;
    const numericValue = parseFloat(value.replace("R$", "").replace(",", "."));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const formatCurrency = (value: string) => {
    const numericValue = parseCurrency(value);
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(numericValue);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      month: transaction.month,
      earned: transaction.earned,
      owed: transaction.owed,
      transactionType: transaction.transactionType,
      year: transaction.year
    });
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = async () => {
    if (editingTransaction && editingTransaction.id) {
      try {
        await deleteTransaction(editingTransaction.id);
        const updatedTransactions = await getTransactions();
        setTransactions(updatedTransactions);
        onTransactionsChange(updatedTransactions);
        setIsModalOpen(false);
        setEditingTransaction(null);
      } catch (error) {
        console.error("Erro ao excluir transação:", error);
      }
    }
  };

  return (
    <div className="p-6 bg-[#081E33] text-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => handleYearChange("prev")}
          className="px-4 py-2 bg-[#3E5063] hover:bg-[#3E5063] text-white rounded-md"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-2xl font-bold">{selectedYear}</h2>
        <button
          onClick={() => handleYearChange("next")}
          className="px-4 py-2 bg-[#3E5063] hover:bg-[#3E5063] text-white rounded-md"
        >
          <FaArrowRight />
        </button>
      </div>

      <div className="overflow-y-auto rounded-lg custom-scrollbar" style={{ maxHeight: "820px" }}>
        <table className="w-full bg-[#081E33] shadow-md rounded-lg text-white">
          <thead>
            <tr className="bg-[#3E5063] text-left">
              <th className="p-4 w-1/4">Mês</th>
              <th className="p-4 w-1/4">Ganhos</th>
              <th className="p-4 w-1/4">Dívidas</th>
              <th className="p-4 w-1/4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {monthsList.map((month, index) => {
              const currentTransactions = transactions.filter(
                (t) => t.month === month && t.year === selectedYear
              );
              const isExpanded = expandedMonths[month] || false;

              return (
                <React.Fragment key={index}>
                  <tr className="border-t border-[#3E5063] hover:bg-[#3E5063]" onClick={() => toggleMonthDropdown(month)}>
                    <td className="p-4 py-6 flex items-center cursor-pointer w-1/4">
                      {month}
                    </td>
                    <td className="p-4 text-green-400 w-1/4">
                      {currentTransactions.length > 0
                        ? formatCurrency(currentTransactions.reduce((sum, t) => sum + parseCurrency(t.earned), 0).toString())
                        : "R$ 0,00"}
                    </td>
                    <td className="p-4 text-red-400 w-1/4">
                      {currentTransactions.length > 0
                        ? formatCurrency(currentTransactions.reduce((sum, t) => sum + parseCurrency(t.owed), 0).toString())
                        : "R$ 0,00"}
                    </td>
                    <td className="p-4 w-1/4">
                      <div className="flex justify-start space-x-2">
                        <button
                          onClick={() => {
                            setNewTransaction({
                              year: selectedYear,
                              month,
                              earned: "",
                              owed: "",
                              transactionType: "Pagamento"
                            });
                            setIsModalOpen(true);
                          }}
                          className="px-4 py-2 bg-[#3E5063] text-white rounded-md"
                        >
                          Adicionar
                        </button>
                      </div>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-[#3E5063]">
                      <td colSpan={4}>
                        <table className="w-full text-white">
                          <tbody>
                            {currentTransactions.map((t) => (
                              <tr key={t.id} className="border-t border-[#081E33]">
                                <td className="p-4 w-1/4">{t.transactionType}</td>
                                <td className="p-4 w-1/4">{formatCurrency(t.earned)}</td>
                                <td className="p-4 w-1/4">{formatCurrency(t.owed)}</td>
                                <td className="p-4 flex space-x-2 w-1/4">
                                  <button
                                    onClick={() => handleEditTransaction(t)}
                                    className="px-4 py-2 bg-[#081E33] hover:bg-[#3E5063] text-white rounded-md"
                                  >
                                    Editar
                                  </button>
                                  <label className="flex items-center space-x-6 cursor-pointer">
                                    <div
                                      className={`relative inline-block w-10 h-6 transition-all duration-300 rounded-full ${t.paid ? "bg-green-400" : "bg-gray-400"
                                        }`}
                                      onClick={async () => {
                                        const updatedTransaction = { ...t, paid: !t.paid };
                                        await updateTransaction(t.id!, updatedTransaction); 
                                        const updatedTransactions = await getTransactions(); 
                                        setTransactions(updatedTransactions);
                                        onTransactionsChange(updatedTransactions);
                                      }}
                                    >
                                      <span
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${t.paid ? "translate-x-4" : ""
                                          }`}
                                      ></span>
                                    </div>
                                    <span className="text-sm">{t.paid ? "Pago" : ""}</span>
                                  </label>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddTransaction}
          onDelete={editingTransaction ? handleDeleteTransaction : undefined}
          newTransaction={newTransaction}
          setNewTransaction={setNewTransaction}
        />
      )}
    </div>
  );
}