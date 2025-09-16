import React,{useEffect, useState} from 'react'
import Header from '../components/header'
import Cards from '../components/cards'
import {Modal} from "antd";
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addincome';
import moment from "moment";
import { addDoc ,collection,getDocs,query,writeBatch} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import TransactionTable from '../TransactionTable';
import NoTransactions from '../NoTransactions';
import ChartComponent from '../components/Charts';
import ResetButton from '../components/resetBalance';

function Dashboard() {

  const[transaction,setTransaction]=useState([]);
  const[loading,setLoading]=useState(false);
  const [user]=useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const [income,setIncome] =useState(0);
  const [expense,setExpense] =useState(0);
  const [totalBalance,setTotalBalance] =useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };
  
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    console.log("Form values:", values);
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };
  async function addTransaction(transaction,many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      
      if(!many) toast.success("Transaction Added!");
      setTransaction(prev => [...prev, transaction]); 

      
    } catch (e) {
      console.error("Error adding document: ", e);
 
      if(!many) toast.error("Couldn't add transaction");

    }
  }

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);
  //!calculate function
  useEffect(() => {
    calculateBalance();
  }, [transaction]);

  function calculateBalance() {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transaction.forEach((transaction) => {
      const amount = parseFloat(transaction.amount);
      if (isNaN(amount)) return; // skip invalid entries
      
      if (transaction.type === "income") {
        incomeTotal += amount;
      } else if (transaction.type === "expense") {
        expensesTotal += amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  }
  



  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q); 
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransaction(transactionsArray);
      console.log("Transaction Array",transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }
  let sortedTransactions = [...transaction].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
  })
  /**************/
  const resetBalance = async () => {
    const user = auth.currentUser;
    console.log("resetBalance -> currentUser:", user?.uid);

    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      const colRef = collection(db, "users", user.uid, "transactions");

      // Delete in batches (safe if many docs; Firestore limit is 500 per batch)
      let snap = await getDocs(colRef);
      console.log("Transactions found:", snap.size);

      if (snap.empty) {
        // still reset local state so UI is consistent
        setTransaction([]);
        setIncome(0);
        setExpense(0);
        setTotalBalance(0);
        alert("No transactions to reset.");
        return;
      }

      while (!snap.empty) {
        const batch = writeBatch(db);
        snap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
        snap = await getDocs(colRef); // fetch again in case >500 docs
      }

      // Local UI reset
      setTransaction([]);
      setIncome(0);
      setExpense(0);
      setTotalBalance(0);

      alert("All transactions deleted ✅");
    } catch (err) {
      console.error("Error resetting transactions:", err);
      alert("Something went wrong while resetting!");
    }
  };
  /*************/
  return (
    <div>
      <Header/>
      {loading ?<p>loading..</p>:<>
      <Cards
        income={income}
        expense={expense}
        totalBalance={totalBalance}
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
        onResetBalance={resetBalance}
      />
      {transaction && transaction.length!==0?
      <ChartComponent sortedTransactions={sortedTransactions}  />:<NoTransactions/>}
      <AddExpenseModal
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
      />
      <AddIncomeModal
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
      <TransactionTable transaction={transaction} 
      addTransaction={addTransaction}
      fetchTransactions={fetchTransactions}
      />

      </>}
    </div>
  )
}

export default Dashboard