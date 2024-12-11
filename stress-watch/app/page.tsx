'use client';

import { useState, useRef } from "react"; // Ajouter useRef ici
import axios from "axios";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Toast } from "primereact/toast";  

export default function Home() {
  const [text, setText] = useState("");
  const [stressLevel, setStressLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const toast = useRef<Toast | null>(null);  

  const handleUpload = async () => {
    if (!text) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez entrer un texte à analyser!',
        life: 3000,  
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/analyze", { text });
      setStressLevel(response.data.stressLevel);

      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Texte analysé avec succès!',
        life: 3000,
      });
    } catch (error) {
      console.error("Erreur lors de l'analyse :", error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Une erreur est survenue lors de l\'analyse!',
        life: 3000,
      });
    }
    setLoading(false);
  };

  const colors = ["#0088FE", "#FFBB28", "#FF8042"];
  const data = stressLevel
    ? [
        { name: "Stress", value: stressLevel },
        { name: "Non Stress", value: 100 - stressLevel },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-extrabold text-white mb-6">Stress Watch</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Analyser votre texte</h2>

        <InputTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Entrez votre texte ici..."
          rows={5}
          className="w-full mb-4 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <Button
          label={loading ? "Analyse en cours..." : "Analyser"}
          onClick={handleUpload}
          className={`w-full p-3 ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold rounded-lg shadow-md`}
          disabled={loading}
        />
      </div>

      {stressLevel !== null && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-xl font-bold text-white mb-4">Résultat d analyse</h2>
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <PieChart width={400} height={400}>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      )}

      <Toast ref={toast} />
    </div>
  );
}
