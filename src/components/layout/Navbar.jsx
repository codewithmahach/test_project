import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaWallet, FaEthereum } from 'react-icons/fa';
import { useWallet, DEFAULT_WALLET } from '../../context/WalletContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { account, isConnected, ethBalance, connectWallet, disconnectWallet } = useWallet();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'Portfolio / Ledger', href: '/portfolio' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg width="30" height="35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="20" r="10" stroke="#0682ff" />
                <circle cx="15" cy="20" r="6" stroke="#0682ff" strokeWidth="3" />
              </svg>
              <span className="text-2xl font-bold text-primary-600 mt-1.5 ml-1">RentVerse</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-secondary-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}

            {isConnected && account ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-secondary-100 text-secondary-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
                  <FaEthereum className="mr-1 text-primary-600 text-sm" />
                  <span>{ethBalance} ETH</span>
                </div>
                <Link
                  to="/portfolio"
                  className="flex items-center bg-primary-50 hover:bg-primary-100 border border-primary-200 text-primary-700 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  {account.slice(0, 6)}...{account.slice(-4)}
                </Link>
                <button
                  onClick={disconnectWallet}
                  className="text-xs text-secondary-400 hover:text-red-600 transition-colors"
                  title="Disconnect Wallet"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => connectWallet(DEFAULT_WALLET)}
                className="btn text-sm flex items-center"
              >
                <FaWallet className="mr-2 text-xs" />
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="text-secondary-600 hover:text-primary-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t py-3">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-2">
                {isConnected && account ? (
                  <div className="px-3 py-2 bg-secondary-50 rounded-lg space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-secondary-500">Connected Wallet</span>
                      <span className="text-primary-600 font-mono">{account.slice(0, 6)}...{account.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-secondary-500">ETH Balance</span>
                      <span className="text-secondary-800">{ethBalance} ETH</span>
                    </div>
                    <button
                      onClick={() => {
                        disconnectWallet();
                        setIsOpen(false);
                      }}
                      className="w-full text-center text-xs text-red-600 hover:underline pt-1"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full btn flex items-center justify-center"
                    onClick={() => {
                      connectWallet(DEFAULT_WALLET);
                      setIsOpen(false);
                    }}
                  >
                    <FaWallet className="mr-2" />
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;