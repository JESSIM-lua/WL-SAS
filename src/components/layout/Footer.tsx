import React from 'react';
import { Shield, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-dark py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="text-primary mr-2" size={20} />
            <span className="font-bold">RP Whitelist System</span>
          </div>
          
          <div className="text-text-muted text-sm">
            &copy; {new Date().getFullYear()} RP Community. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;