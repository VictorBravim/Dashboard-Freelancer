import { collection, addDoc, updateDoc, doc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Transaction } from "@/components/TransactionsTableAdd";
import { BankCardType } from "@/components/BankCardAdd";

export const addTransaction = async (transaction: Omit<Transaction, "id">) => {
  const ref = collection(db, "transactions");
  await addDoc(ref, transaction);
};

export const updateTransaction = async (id: string, transaction: Omit<Transaction, "id">) => {
  const ref = doc(db, "transactions", id);
  await updateDoc(ref, transaction);
};

export const deleteTransaction = async (id: string) => {
  const ref = doc(db, "transactions", id);
  await deleteDoc(ref);
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const ref = collection(db, "transactions");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Transaction, "id">),
  }));
};

const bankCardsCollection = collection(db, "bankCards");

export const getCards = async (): Promise<BankCardType[]> => {
  const querySnapshot = await getDocs(bankCardsCollection);
  const cards: BankCardType[] = [];
  querySnapshot.forEach((doc) => {
    const cardData = doc.data();
    cards.push({
      id: doc.id,
      name: cardData.name,
      logoUrl: cardData.logoUrl || "", 
      available: cardData.available,
      used: cardData.used,
    });
  });
  return cards;
};

export const addCard = async (card: { name: string; logoUrl?: string; available: string; used: string }) => {
  try {
    const docRef = await addDoc(bankCardsCollection, card);
    console.log("Cartão adicionado com ID: ", docRef.id);
    return { id: docRef.id, ...card };
  } catch (e) {
    console.error("Erro ao adicionar o cartão: ", e);
    throw e;
  }
};

export const updateCard = async (id: string, card: { name: string; available: string; used: string }) => {
  try {
    const cardDoc = doc(db, "bankCards", id);
    await updateDoc(cardDoc, card);
    console.log("Cartão atualizado com ID: ", id);
  } catch (e) {
    console.error("Erro ao atualizar o cartão: ", e);
  }
};