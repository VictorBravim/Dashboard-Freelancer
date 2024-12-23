import React, { useState, useEffect } from "react";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/services/firebaseConfig";
import ProjetosCard from "../components/ProjetosCard";
import Modal from "@/components/ModalProjetos";
import "../styles/globals.css";

interface Projeto {
  id: string;
  name: string;
  projectTypes: string[];
  value: number;
  amountPaid: number;
  imageUrl: string;
  status: string;
}

export default function Projetos() {
  const [loading, setLoading] = useState(true);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [value, setValue] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("Trabalhando");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProjetoId, setEditProjetoId] = useState<string | null>(null);
  const [visibleProjetosCount, setVisibleProjetosCount] = useState(16);
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

  useEffect(() => {
    const loadProjetos = async () => {
      const projetosQuery = query(
        collection(db, "projetos"),
        orderBy("idOrder", "asc")
      );
      const projetosSnapshot = await getDocs(projetosQuery);
      const projetosList: Projeto[] = projetosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Projeto[];
      setProjetos(projetosList);
      setLoading(false);
    };
    loadProjetos();
  }, []);  

  const handleAddProjeto = async () => {
    if (isEditMode && editProjetoId) {
      const projetoRef = doc(db, "projetos", editProjetoId);
      await updateDoc(projetoRef, { name, projectTypes, value, amountPaid, imageUrl, status });
      setProjetos((prev) =>
        prev.map((proj) =>
          proj.id === editProjetoId
            ? { ...proj, name, projectTypes, value, amountPaid, imageUrl, status }
            : proj
        )
      );
      setIsEditMode(false);
      setEditProjetoId(null);
    } else {
      const projetosQuery = query(collection(db, "projetos"), orderBy("idOrder", "desc"));
      const projetosSnapshot = await getDocs(projetosQuery);
      const lastProjeto = projetosSnapshot.docs[0];
      const newIdOrder = lastProjeto ? lastProjeto.data().idOrder + 1 : 1;
  
      const newProjeto = {
        name,
        projectTypes,
        value,
        amountPaid,
        imageUrl,
        status,
        idOrder: newIdOrder, 
      };
      const docRef = await addDoc(collection(db, "projetos"), newProjeto);
      setProjetos((prev) => [...prev, { id: docRef.id, ...newProjeto }]);
    }
    setShowModal(false);
  };  

  const handleDeleteProjeto = async (id: string) => {
    const projetoRef = doc(db, "projetos", id);
    await deleteDoc(projetoRef);
    setProjetos((prev) => prev.filter((projeto) => projeto.id !== id));
  };

  const handleEditProjeto = (projeto: Projeto) => {
    setName(projeto.name);
    setProjectTypes(projeto.projectTypes);
    setValue(projeto.value);
    setAmountPaid(projeto.amountPaid);
    setImageUrl(projeto.imageUrl);
    setStatus(projeto.status);
    setIsEditMode(true);
    setEditProjetoId(projeto.id);
    setShowModal(true);
  };

  const openAddProjetoModal = () => {
    setName("");
    setProjectTypes([]);
    setValue(0);
    setAmountPaid(0);
    setImageUrl("");
    setStatus("Trabalhando");
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleLoadMore = () => {
    setVisibleProjetosCount((prev) => prev + 16);
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
        <title>Projetos</title>
      </Head>
      <main className="flex w-full h-screen bg-[#3E5063] text-black">
        <Sidebar />
        <section className="flex-1 pl-0 p-4 space-y-4 overflow-auto">
          <div className="grid grid-cols-5 gap-4">
            <div
              onClick={openAddProjetoModal}
              className="h-48 cursor-pointer bg-[#081E33] rounded-lg p-6 flex flex-col justify-center items-center text-white"
            >
              <img
                src="/Add.png"
                alt="Adicionar Projeto"
                className="w-20 h-20"
              />
            </div>

            {projetos.slice(0, visibleProjetosCount).map((projeto) => (
              <ProjetosCard
                key={projeto.id}
                name={projeto.name}
                projectTypes={projeto.projectTypes.join(", ")}
                value={projeto.value}
                amountPaid={projeto.amountPaid}
                imageUrl={projeto.imageUrl}
                status={projeto.status}
                onEdit={() => handleEditProjeto(projeto)}
                onDelete={() => handleDeleteProjeto(projeto.id)}
              />
            ))}
          </div>

          {visibleProjetosCount < projetos.length && (
            <div className="w-full flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="py-2 px-4 bg-[#081E33] text-white rounded-lg"
              >
                Carregar mais
              </button>
            </div>
          )}
        </section>
      </main>

      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onSave={handleAddProjeto}
          name={name}
          setName={setName}
          projectTypes={projectTypes}
          setProjectTypes={setProjectTypes}
          value={value}
          setValue={setValue}
          amountPaid={amountPaid}
          setAmountPaid={setAmountPaid}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          status={status}
          setStatus={setStatus}
          isEditMode={isEditMode}
        />
      )}
    </>
  );
}