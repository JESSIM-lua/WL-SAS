import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import ApplicationForm from '../components/ApplicationForm';
import StatusChecker from '../components/StatusChecker';
import { Shield, FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'apply' | 'check'>('apply');
  const discordId = localStorage.getItem('discord_id');


  const [locked, setLocked] = useState(false);
      const [error, setError] = useState('');
        const [remaining, setRemaining] = useState<number>(3);

        const navigate = useNavigate();

  useEffect(() => {
  const checkAttempts = async () => {
    if (!discordId) return;

    try {
      const res = await fetch(`http://localhost:3001/api/qcm/attempts/${discordId}`);
      const data = await res.json();

      if (data.passed) {
        // ✅ Rediriger directement
        navigate('/');
        return;
      }

      
      if (data.passed) {
        localStorage.setItem('qcm_passed', 'true');
        return;
      } else {
        localStorage.setItem('qcm_passed', 'false');
      }


    

      if (data.attempts >= 3) {
        setLocked(true);
        setError('❌ Tu as atteint le nombre maximal de tentatives.');
      } else {
        setRemaining(3 - data.attempts);
      }
    } catch {
      setError("❌ Erreur lors de la vérification des tentatives.");
    }


    const passedQCM = localStorage.getItem('qcm_passed')
    if (passedQCM != 'true') {
      navigate('/qcm');
      return;
    }
  }
  checkAttempts();
  }
, [discordId, navigate]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Roleplay Community</h1>
        <p className="text-text-muted text-lg">Whitelist Application System</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'apply' | 'check')}>
        <TabsList className="w-full flex mb-6">
          <TabsTrigger 
            value="apply" 
            className={`flex-1 py-3 ${activeTab === 'apply' ? 'bg-primary text-white' : 'bg-background-light text-text'}`}
          >
            <Shield size={18} className="mr-2" />
            Apply for Whitelist
          </TabsTrigger>
          <TabsTrigger 
            value="check" 
            className={`flex-1 py-3 ${activeTab === 'check' ? 'bg-primary text-white' : 'bg-background-light text-text'}`}
          >
            <FileCheck size={18} className="mr-2" />
            Check Status
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="apply" className="mt-0">
          <ApplicationForm />
        </TabsContent>
        
        <TabsContent value="check" className="mt-0">
          <StatusChecker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;