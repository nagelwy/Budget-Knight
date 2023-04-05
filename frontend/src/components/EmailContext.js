import { createContext, useState } from 'react';

export const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [email, setEmail] = useState('');
  
  return (
    <EmailContext.Provider value={{ email, setEmail }}>
      {children}
    </EmailContext.Provider>
  );
};

export default EmailProvider;