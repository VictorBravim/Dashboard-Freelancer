'use client';
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import FinancialSummary from "../components/FinancialSummary";
import BankCardView from "@/components/BankCardAdd";
import TransactionsTableView from "@/components/TransactionsTableAdd";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Transaction } from "../types/types";
import "../styles/globals.css";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/"); 
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleTransactionsChange = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#3E5063]">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <main className="flex w-full h-screen bg-[#3E5063] text-black">
        <Sidebar />
        <section className="flex-1 pl-0 p-4 space-y-4">
          <div className="gap-6">
            <FinancialSummary transactions={transactions} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-3">
              <TransactionsTableView onTransactionsChange={handleTransactionsChange} />
            </div>
            <div className="flex flex-col space-y-4">
              <BankCardView />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}