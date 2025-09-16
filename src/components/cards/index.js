import React from 'react'
import "./style.css";
import {Card,Row} from "antd";
import Button from '../button';

function Cards({
  showExpenseModal,
  showIncomeModal,
  income,
  expense,
  totalBalance,
  ResetButton,
  onResetBalance,
}) {
  console.log("Props to Cards:", income, expense, totalBalance,onResetBalance);

  return (
    <div>
      <Row className='my-row'>
        <Card variant={true} className='card'>
          <h2>Current Balance</h2>
          <p>₹{totalBalance}</p>
          <Button text="Reset Balance" blue={true} onClick={onResetBalance}/>
        </Card>
    
        <Card variant={true} className='card'>
          <h2>Total Income</h2>
          <p>₹{income}</p>
          <Button text="Add Income" blue={true} onClick={showIncomeModal} />
        </Card>
    
        <Card variant={true} className='card'>
          <h2>Total Expenses</h2>
          <p>₹{expense}</p>
          <Button text="Add Expense" blue={true} onClick={showExpenseModal}/>
        </Card>
      </Row>
    </div>
  )
}

export default Cards