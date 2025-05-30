import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs: React.FC<{
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}> = ({ children, value, onValueChange }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`tabs-list flex rounded-md overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<{
  value: string;
  children: ReactNode;
  className?: string;
}> = ({ value, children, className = '' }) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  
  const isActive = context.value === value;
  
  return (
    <button
      className={`tabs-trigger flex items-center justify-center font-medium transition-colors duration-200 ${className}`}
      onClick={() => context.onValueChange(value)}
      data-state={isActive ? 'active' : 'inactive'}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{
  value: string;
  children: ReactNode;
  className?: string;
}> = ({ value, children, className = '' }) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }
  
  if (context.value !== value) {
    return null;
  }
  
  return (
    <div className={`tabs-content animate-fade-in ${className}`}>
      {children}
    </div>
  );
};