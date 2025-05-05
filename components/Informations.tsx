import { useState, useEffect } from "react";
import { InformationsType } from "../interfaces/Information";

const API_URL = "http://localhost:3000/information";

const Informations = () => {
  const [informations, setInformations] = useState<InformationsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInformations = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {},
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des informations");
        }

        const data = await response.json();
        setInformations(data);
      } catch (error) {
        console.error("Erreur chargement informations :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInformations();
  }, []);

  return { informations, loading };
};

export default Informations;
