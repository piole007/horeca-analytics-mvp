"use client";
import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Connection error:", error);
          setError(`Error connecting to Supabase: ${error.message}`);
        } else {
          console.log("Connection successful:", data);
          setData("Connection to Supabase successful!");
        }
      } catch (err) {
        console.error("Error in fetching connection data:", err);
        setError(`Error connecting to Supabase: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-6xl font-bold text-center">HoReCa Analytics</h1>
      <h2 className="text-2xl font-semibold">Supabase Connection Test</h2>

      {loading ? (
        <p className="text-gray-500">Testing connection...</p>
      ) : error ? (
        <div className="p-4 text-red-700 bg-red-100 rounded-lg">
          <p className="font-semibold">Connection Error:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="p-4 text-green-700 bg-green-100 rounded-lg">
          <p>{data}</p>
        </div>
      )}
    </div>
  );
}
