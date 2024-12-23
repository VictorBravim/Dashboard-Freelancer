import React, { useState, useEffect } from "react";
import { ModalBankCard } from "../components/ModalBankCard";
import BankCard from "@/components/BankCard";
import { getCards, addCard, updateCard } from "@/services/firestoreService";

export interface BankCardType {
  id: string;
  name: string;
  logoUrl?: string;
  available: string;
  used: string;
}

export default function BankCardAdd() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bankCards, setBankCards] = useState<BankCardType[]>([]);
  const [newCard, setNewCard] = useState<{ id?: string; name: string; logoUrl?: string; available: string; used: string }>({
    name: "",
    logoUrl: "",
    available: "",
    used: "",
  });
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const cards = await getCards();
        setBankCards(cards); 
      } catch (error) {
        console.error("Erro ao carregar cartões:", error);
      }
    };
    fetchCards();
  }, []);

  const handleAddBankCard = async () => {
    try {
      if (editingCardIndex !== null) {
        const updatedCards = [...bankCards];
        updatedCards[editingCardIndex] = newCard as BankCardType;
        await updateCard(bankCards[editingCardIndex].id, newCard as BankCardType);
        setBankCards(updatedCards);
        setEditingCardIndex(null);
      } else {
        const addedCard = await addCard(newCard as BankCardType);
        setBankCards((prev) => [...prev, { id: addedCard.id, ...newCard }]); 
      }

      setIsModalOpen(false);
      setNewCard({ name: "", available: "", used: "" });
    } catch (error) {
      console.error("Erro ao salvar o cartão:", error);
    }
  };

  const handleEditCard = (index: number) => {
    setNewCard(bankCards[index]);
    setEditingCardIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="w-full flex flex-col space-y-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full h-40 text-white bg-[#081E33] rounded-lg shadow-lg flex justify-center items-center"
        >
          <img src="/Add.png" alt="Add Card" className="w-20 h-auto" />
        </button>
        {bankCards.map((card) => (
          <BankCard
            key={card.id} 
            bankName={card.name}
            logoUrl={card.logoUrl}
            available={card.available}
            used={card.used}
            onEdit={() => handleEditCard(bankCards.findIndex((item) => item.id === card.id))} 
          />
        ))}
      </div>

      {isModalOpen && (
        <ModalBankCard
          onClose={() => {
            setIsModalOpen(false);
            setEditingCardIndex(null);
          }}
          onSave={handleAddBankCard}
          newCard={newCard}
          setNewCard={setNewCard}
        />
      )}
    </div>
  );
}