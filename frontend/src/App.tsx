import React, { useState } from 'react';
import './App.css';
import CustomerList from './components/CustomerList';
import ConversationView from './components/ConversationView';
import { Customer } from './services/api';

function App() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleBack = () => {
    setSelectedCustomer(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📖 Words in Season Admin</h1>

        {!selectedCustomer && (
          <div className="search-bar">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit">Search</button>
              {searchQuery && (
                <button type="button" onClick={handleClearSearch} className="clear-btn">
                  Clear
                </button>
              )}
            </form>
          </div>
        )}
      </header>

      <main className="App-main">
        {selectedCustomer ? (
          <ConversationView customer={selectedCustomer} onBack={handleBack} />
        ) : (
          <CustomerList onSelectCustomer={handleSelectCustomer} searchQuery={searchQuery} />
        )}
      </main>
    </div>
  );
}

export default App;
