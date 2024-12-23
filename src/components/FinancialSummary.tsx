import React from "react";
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineLineChart } from "react-icons/ai";

type Transaction = {
  earned: string;
  owed: string;
  paid: boolean;
};

type FinancialSummaryProps = {
  transactions: Transaction[];
};

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ transactions }) => {

  const calculateTotals = () => {
    let totalEarned = 0;
    let totalOwed = 0;
  
    transactions.forEach(transaction => {
      if (!transaction.paid) {

        totalEarned += parseCurrency(transaction.earned);
        totalOwed -= parseCurrency(transaction.owed);
      } else {

        totalEarned += parseCurrency(transaction.earned);
        totalEarned -= parseCurrency(transaction.owed); 
      }
    });
  
    const netAmount = totalEarned + totalOwed; 
    return { totalEarned, totalOwed, netAmount };
  };

  const parseCurrency = (value: string): number => {
    if (!value) return 0; 
    const numericValue = parseFloat(value.replace("R$", "").replace(",", ".").trim());
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const { totalEarned, totalOwed, netAmount } = calculateTotals();

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-[#081E33] p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-green-400 text-white p-4 rounded-full">
          <AiOutlineArrowUp className="text-2xl" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Ganhos Totais</h3>
          <p className="text-2xl font-semibold text-green-400">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalEarned)}
          </p>
        </div>
      </div>

      <div className="bg-[#081E33] p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-red-400 text-white p-4 rounded-full">
          <AiOutlineArrowDown className="text-2xl" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Dívidas Totais</h3>
          <p className="text-2xl font-semibold text-red-400">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalOwed)}
          </p>
        </div>
      </div>

      <div className="bg-[#081E33] p-6 rounded-lg shadow-md flex flex-col">
        <div className="flex items-center space-x-4">
          <div className={`p-4 rounded-full ${netAmount >= 0 ? "bg-blue-400" : "bg-yellow-400"} text-white`}>
            <AiOutlineLineChart className="text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Valor Líquido</h3>
            <p
              className={`text-2xl font-semibold ${
                netAmount >= 0 ? "text-blue-400" : "text-yellow-400"
              }`}
            >
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(netAmount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;