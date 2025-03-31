import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState } from "../interfaces/AuthState";
import { InformationsType } from "../interfaces/Information";

const Informations = () => {
  const url = "http://localhost:3000/information";

  const [informations, setInformations] = useState<InformationsType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const storedAuthState = await AsyncStorage.getItem("auth");

      if (!storedAuthState) {
        return;
      }

      const authState = JSON.parse(storedAuthState) as AuthState;

      if (!authState?.token) {
        return;
      }

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
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
