const API_URL = "http://192.168.1.14:3000";

export const InformationService = {
  getInformationById: async (id: number) => {
    const response = await fetch(`${API_URL}/information/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Erreur lors du chargement de l'information."
      );
    }

    return await response.json();
  },
  getAllInformations: async () => {
    const response = await fetch(`${API_URL}/information`);

    console.log("Fetching all informations...");
    console.log(response.json());
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Erreur lors du chargement des informations."
      );
    }

    return await response.json();
  },
};
