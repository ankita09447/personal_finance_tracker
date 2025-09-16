import React from "react";
import { db, auth, provider, doc, setDoc} from "../../firebase"; // adjust path if needed
import { collection, getDocs, deleteDoc} from "firebase/firestore";

const ResetButton = () => {
  const handleReset = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      const transactionsRef = collection(db, "users", user.uid, "transactions");
      const snapshot = await getDocs(transactionsRef);

      if (snapshot.empty) {
        alert("No transactions to reset.");
        return;
      }

      const deletePromises = snapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "users", user.uid, "transactions", docSnap.id))
      );

      await Promise.all(deletePromises);
      alert("All transactions deleted ✅");
    } catch (error) {
      console.error("Error resetting transactions: ", error);
      alert("Something went wrong while resetting!");
    }
  };

  return (
    <button
      onClick={handleReset}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Reset
    </button>
  );
};

export default ResetButton;
