import { useState, useEffect, useCallback } from 'react';
import ScheduleComponents from './ScheduleComponents.jsx'


  return(
    <ScheduleComponents
      categories={categories}
      scheduledTransactions={scheduledTransactions}
      setEditingTransactionId={setEditingTransactionId}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleDeleteScheduledTransaction={handleDeleteScheduledTransaction}
      formData={formData}
      setFormData={setFormData}
    />
  );
};

export default ScheduledTransactionsForm;