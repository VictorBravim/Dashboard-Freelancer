import React, { useState, useEffect } from "react";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConfig";
import MetaCard from "../components/MetaCard";
import Modal from "@/components/ModalMeta";
import "../styles/globals.css";

interface Meta {
  id: string;
  name: string;
  value: number;
  savedValue: number;
  imageUrl?: string;
}

export default function Metas() {
  const [loading, setLoading] = useState(true);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState(0);
  const [savedValue, setSavedValue] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editMetaId, setEditMetaId] = useState<string | null>(null);
  const [visibleMetasCount, setVisibleMetasCount] = useState(16);
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
    const loadMetas = async () => {
      const metasSnapshot = await getDocs(collection(db, "metas"));
      const metasList: Meta[] = metasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Meta[];
      setMetas(metasList);
    };

    loadMetas();
  }, []);

  const handleAddMeta = async () => {
    if (!isEditMode) {
      setName("");
      setValue(0);
      setSavedValue(0);
      setImageUrl("");
      setImageUrlInput("");
    }

    const imageToSave = imageUrl || imageUrlInput;

    if (isEditMode && editMetaId) {
      const metaRef = doc(db, "metas", editMetaId);
      await updateDoc(metaRef, { name, value, savedValue, imageUrl: imageToSave });
      setMetas(prevMetas =>
        prevMetas.map(meta =>
          meta.id === editMetaId
            ? { ...meta, name, value, savedValue, imageUrl: imageToSave }
            : meta
        )
      );
      setIsEditMode(false);
      setEditMetaId(null);
    } else {
      const newMeta = { name, value, savedValue, imageUrl: imageToSave };
      const docRef = await addDoc(collection(db, "metas"), newMeta);
      setMetas(prevMetas => [...prevMetas, { id: docRef.id, ...newMeta }]);
    }

    setShowModal(false);
  };

  const handleDeleteMeta = async (metaId: string) => {
    const metaRef = doc(db, "metas", metaId);
    await deleteDoc(metaRef);
    setMetas(prevMetas => prevMetas.filter(meta => meta.id !== metaId));
  };

  const handleLoadMore = () => {
    setVisibleMetasCount(prev => prev + 16);
  };

  const handleEditMeta = (meta: Meta) => {
    setName(meta.name);
    setValue(meta.value);
    setSavedValue(meta.savedValue);
    setImageUrl(meta.imageUrl || "");
    setImageUrlInput(meta.imageUrl || "");
    setIsEditMode(true);
    setEditMetaId(meta.id);
    setShowModal(true);
  };

  const openAddMetaModal = () => {
    setName("");
    setValue(0);
    setSavedValue(0);
    setImageUrl("");
    setImageUrlInput("");
    setIsEditMode(false);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#3E5063]">
        <p className="text-white"></p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Metas</title>
      </Head>
      <main className="flex w-full h-screen bg-[#3E5063] text-black">
        <Sidebar />
        <section className="flex-1 pl-0 p-4 space-y-4 overflow-auto">
          <div className="grid grid-cols-5 gap-4">
            <div
              onClick={openAddMetaModal}
              className="h-48 cursor-pointer bg-[#081E33] rounded-lg p-6 flex flex-col justify-center items-center text-white"
            >
              <img
                src="/Add.png"
                alt="Adicionar Meta"
                className="w-20 h-20"
              />
            </div>

            {metas.slice(0, visibleMetasCount).map((meta) => (
              <MetaCard
                key={meta.id}
                name={meta.name}
                value={meta.value}
                savedValue={meta.savedValue}
                imageUrl={meta.imageUrl}
                onEdit={() => handleEditMeta(meta)}
              />
            ))}
          </div>

          {visibleMetasCount < metas.length && (
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
          onSave={handleAddMeta}
          onDelete={() => {
            if (editMetaId) {
              handleDeleteMeta(editMetaId);
              setShowModal(false);
            }
          }}
          name={name}
          setName={setName}
          value={value}
          setValue={setValue}
          savedValue={savedValue}
          setSavedValue={setSavedValue}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          imageUrlInput={imageUrlInput}
          setImageUrlInput={setImageUrlInput}
          isEditMode={isEditMode}
        />
      )}
    </>
  );
}