'use client'
import axios from 'axios'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { professions } from "../../../lib/profession-data";
import { toast, ToastContainer } from "react-toastify";
import React, { useState, useEffect } from 'react'

interface PortfolioFile {
  id: string;
  fileType: string;
  fileUrl: string;
  userId: string;
  createdAt: string;
}

interface OrderHistory {
  id: string;
  specialistName: string;
  specialistPhone: string;
  service: string;
  address: string;
  date: string;
  time: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  description: string;
  price?: number;
  isRated?: boolean;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  profession: string;
  region: string;
  district: string;  
}

function Page() {
  const router = useRouter()
  const { id } = useParams()

  const [master, setMaster] = useState<User | null>(null)
  const [masterfiles, setMasterFiles] = useState<PortfolioFile[]>([])
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrderForModal, setSelectedOrderForModal] =
    useState<OrderHistory | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [portfolioFiles, setPortfolioFiles] = useState<PortfolioFile[]>([]);

  const [modalAddress, setModalAddress] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  useEffect(() => {
    axios
    .get(`https://fixoo-backend.onrender.com/api/v1/master/by/${id}`)
    .then((res) => {setMaster(res.data.data); setMasterFiles(res.data.data.files)})
    .catch(err => console.log(err));
  }, [])
  
   console.log(masterfiles)
  const orderSpecialist = () => {
    if (!master) return;

    const newOrder: OrderHistory = {
      id: master.id,
      specialistName: `${master.firstName} ${master.lastName}`,
      specialistPhone: master.phone,
      service: professions.find((p) => p.value === master.profession)?.label || "",
      address: "",
      date: "",
      time: "",
      status: "pending",
      description: "",
    };

    setSelectedOrderForModal(newOrder);
    setModalAddress("");
    setModalDescription("");
    setIsOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrderForModal(null);
  };

  const submitOrder = async () => {
    if (!selectedOrderForModal) return;

    try {
      const payload = {
        masterId: selectedOrderForModal.id,
        address: modalAddress,
        description: modalDescription,
      };

      const response = await axios.post(
        "https://fixoo-backend.onrender.com/api/v1/orders",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const createdOrder: OrderHistory = response.data.data;
      setOrderHistory((prev) => [...prev, createdOrder]);
      toast.success("Buyurtma muvaffaqiyatli berildi", { autoClose: 3000 });
      closeOrderModal();
    } catch (error) {
      toast.error("Buyurtma yuborishda xatolik yuz berdi");
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await axios.get(
          "https://fixoo-backend.onrender.com/api/v1/my/files",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const savedFiles = response.data.data;
        if (savedFiles) {
          setPortfolioFiles(savedFiles);
        }
      } catch (err) {
        console.error("Fayllarni olishda xatolik:", err);
      }
    }

    fetchFiles();
  }, []);

  if (!master) return <div className="text-center p-10">Yuklanyapti...</div>;

  return (
    <div className='max-w-[1200px] w-full mx-auto'>
      <div className="text-center p-4">
        <button
          onClick={() => router.back()}
          className="text-gray-600 flex hover:text-teal-600 text-md transition duration-150">
          ← Orqaga qaytish
        </button>
      </div>

      <section>
        <div className='grid grid-cols-2 gap-3'>

          <div className='rounded-2xl flex flex-col items-start justify-start gap-5 p-4 shadow-[0px_0px_6px_5px_rgba(0,_0,_0,_0.1)]'>
            <h1 className='text-2xl font-bold'>{master.lastName} {master.firstName}</h1>
            <h2 className='text-md'>Region : {master.region}</h2>
            <h2 className='text-md'>Manzil: {master.district}</h2>
            <h2 className='text-md'>Kasb: {master.profession}</h2>
            <button
              onClick={orderSpecialist}
              className=" bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Buyurtma
            </button>
          </div>

          <div className='p-4 rounded-2xl shadow-[0px_0px_6px_5px_rgba(0,_0,_0,_0.1)]'>
            <h1 className='text-2xl font-bold'>Portfolio</h1>

            {masterfiles.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {masterfiles.map((file) => {
                  const fileUrl = `https://fixoo-backend.onrender.com/${file.fileType}/${file.fileUrl}`;
                  const isImage = file.fileType === "image";
                  const isVideo = file.fileType === "video";
                  const isPDF = file.fileType === "pdf";
                  console.log('2', file.fileType, '1', file.fileUrl)

                  return (
                    <div key={file.id} className="relative rounded-lg p-4">
                      {isImage ? (
                        <Image
                          src={fileUrl}
                          alt="Image"
                          width={600}
                          height={600}  
                          className="w-full h-58 rounded object-cover"
                        />
                      ) : isVideo ? (
                        <video controls className="w-full h-58 rounded object-cover" src={fileUrl} />
                      ) : (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-58 bg-teal-100 rounded flex items-center justify-center text-teal-700"
                        >
                          Faylni ochish
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Hozircha portfolio fayllari yo'q
              </div>
            )}
          </div>

        </div>
      </section>

      {/* MODAL */}
      {isOrderModalOpen && selectedOrderForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Buyurtma berish</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manzil
              </label>
              <input
                type="text"
                value={modalAddress}
                onChange={(e) => setModalAddress(e.target.value)}
                placeholder="Manzil kiriting"
                className="w-full bg-gray-50 rounded-md p-2 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tavsif
              </label>
              <textarea
                value={modalDescription}
                onChange={(e) => setModalDescription(e.target.value)}
                placeholder="Qisqacha ish bo'yicha tavsif kiriting"
                className="w-full h-40 bg-gray-50 rounded-md p-2 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-200 shadow-md focus:shadow-lg"
              />
            </div>

            <div className="flex items-start justify-end gap-3">
              <button
                onClick={closeOrderModal}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Bekor qilish
              </button>
              <button
                onClick={submitOrder}
                className="px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-700 text-white"
              >
                Buyurtma berish
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Page;
