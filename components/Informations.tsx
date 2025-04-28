import { useState, useEffect } from "react";
import { InformationsType } from "../interfaces/Information";

const Informations = () => {
  const url = "http://localhost:3000/information";
  const [informations, setInformations] = useState<InformationsType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          headers: {},
        });
        const data = await response.json();
        setInformations(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return informations;
};

export default Informations;
