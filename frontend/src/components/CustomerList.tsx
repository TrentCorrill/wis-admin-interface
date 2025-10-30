import React, { useEffect, useState } from 'react';
import { Customer, customerAPI } from '../services/api';
import './CustomerList.css';

interface CustomerListProps {
  onSelectCustomer: (customer: Customer) => void;
  searchQuery?: string;
}

const CustomerList: React.FC<CustomerListProps> = ({ onSelectCustomer, searchQuery }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, [searchQuery]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Customer[];
      if (searchQuery && searchQuery.trim()) {
        data = await customerAPI.search(searchQuery);
      } else {
        data = await customerAPI.getAll();
      }

      setCustomers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="customer-list loading">Loading customers...</div>;
  }

  if (error) {
    return (
      <div className="customer-list error">
        <p>Error: {error}</p>
        <button onClick={loadCustomers}>Retry</button>
      </div>
    );
  }

  return (
    <div className="customer-list">
      <h2>Customers ({customers.length})</h2>

      {customers.length === 0 ? (
        <div className="no-customers">No customers found</div>
      ) : (
        <div className="customer-grid">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="customer-card"
              onClick={() => onSelectCustomer(customer)}
            >
              <div className="customer-header">
                <h3>{customer.name || 'Unknown'}</h3>
                <span className={`status ${customer.subscriptionStatus?.toLowerCase()}`}>
                  {customer.subscriptionStatus || 'Unknown'}
                </span>
              </div>

              <div className="customer-details">
                <p className="phone">📱 {customer.phone}</p>
                {customer.email && <p className="email">📧 {customer.email}</p>}
                <p className="season">📖 Season: {customer.currentSeason || 'Not set'}</p>
                <p className="messages">💬 {customer.messageCount} messages</p>
                <p className="date">Joined: {formatDate(customer.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerList;
