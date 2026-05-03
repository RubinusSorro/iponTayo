import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  increment,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "./AuthContext";

const AppContext = createContext();

export function AppProvider({ children }) {
  const { user } = useAuth();

  const [plans, setPlans] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const plansQuery = query(
      collection(db, "savingPlans"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(plansQuery, (snapshot) => {
      const plansData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPlans(plansData);
      setAppLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const contributionsQuery = query(
      collection(db, "contributions"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(contributionsQuery, (snapshot) => {
      const contributionsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setContributions(contributionsData);
    });

    return () => unsubscribe();
  }, [user]);

  async function addPlan(newPlan) {
    if (!user) return;

    await addDoc(collection(db, "savingPlans"), {
      userId: user.uid,
      title: newPlan.title,
      goalAmount: Number(newPlan.goalAmount),
      savedAmount: 0,
      targetDate: newPlan.targetDate,
      status: "New",
      createdAt: new Date(),
    });
  }

  async function updatePlan(updatedPlan) {
    const planRef = doc(db, "savingPlans", updatedPlan.id);

    await updateDoc(planRef, {
      title: updatedPlan.title,
      goalAmount: Number(updatedPlan.goalAmount),
      targetDate: updatedPlan.targetDate,
      status: updatedPlan.status,
    });
  }

  async function deletePlan(id) {
    const planRef = doc(db, "savingPlans", id);
    await deleteDoc(planRef);
  }

  async function addContribution(newContribution) {
    if (!user) return;

    const selectedPlan = plans.find(
      (plan) => plan.id === newContribution.planId
    );

    if (!selectedPlan) return;

    const amount = Number(newContribution.amount);
    const remaining = selectedPlan.goalAmount - selectedPlan.savedAmount;

    if (amount <= 0 || amount > remaining) {
      throw new Error("Invalid deposit amount.");
    }

    await addDoc(collection(db, "contributions"), {
      userId: user.uid,
      planId: selectedPlan.id,
      planTitle: selectedPlan.title,
      amount,
      date: newContribution.date,
      note: newContribution.note,
      createdAt: new Date(),
    });

    const planRef = doc(db, "savingPlans", selectedPlan.id);

    await updateDoc(planRef, {
      savedAmount: increment(amount),
    });
  }

  async function deleteContribution(id) {
    const contribution = contributions.find((item) => item.id === id);

    if (!contribution) return;

    await deleteDoc(doc(db, "contributions", id));

    const planRef = doc(db, "savingPlans", contribution.planId);

    await updateDoc(planRef, {
      savedAmount: increment(-contribution.amount),
    });
  }

  return (
    <AppContext.Provider
      value={{
        plans,
        contributions,
        appLoading,
        addPlan,
        updatePlan,
        deletePlan,
        addContribution,
        deleteContribution,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}