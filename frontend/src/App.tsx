import React, { useState, useEffect } from 'react';
import './App.css';
import CustomerList from './components/CustomerList';
import ConversationView from './components/ConversationView';
import SignInButton from './components/SignInButton';
import SignOutButton from './components/SignOutButton';
import { Customer, configureApiClient } from './services/api';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';

function App() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Configure API client with authentication when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      configureApiClient(instance);
    }
  }, [isAuthenticated, instance]);

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

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="App">
        <div className="login-container">
          <h1>📖 Words in Season Admin</h1>
          <p>Please sign in with your Microsoft account to access the admin interface.</p>
          <SignInButton />
        </div>
      </div>
    );
  }

  const userName = accounts[0]?.name || accounts[0]?.username || 'User';

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>📖 Words in Season Admin</h1>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <SignOutButton />
          </div>
        </div>

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
