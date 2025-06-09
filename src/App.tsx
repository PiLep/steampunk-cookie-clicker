import React, { useState, useEffect, useRef } from 'react';
import { Cookie, Store, Gauge, Cog, Wind, Wrench, Factory, Zap, MousePointer } from 'lucide-react';

interface Upgrade {
  id: string;
  name: string;
  cost: number;
  cps: number;
  owned: number;
  icon: React.ReactNode;
}

interface CookiePopup {
  id: number;
  value: number;
  x: number;
  y: number;
}

interface Cursor {
  id: number;
  x: number;
  y: number;
  scale: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const prevValue = useRef(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (prevValue.current !== value) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span 
      className={`inline-block transition-transform duration-300 ${
        isAnimating ? 'scale-110 text-amber-300' : 'scale-100'
      }`}
    >
      {value.toFixed(1)}
    </span>
  );
}

function App() {
  const [cookies, setCookies] = useState(() => {
    const saved = localStorage.getItem('cookies');
    return saved ? parseFloat(saved) : 0;
  });
  
  const [upgrades, setUpgrades] = useState<Upgrade[]>(() => {
    const saved = localStorage.getItem('upgrades');
    const defaultUpgrades = [
      { id: 'gear', name: 'Brass Gear', cost: 15, cps: 0.1, owned: 0, icon: <Cog className="w-6 h-6" /> },
      { id: 'engine', name: 'Steam Engine', cost: 100, cps: 1, owned: 0, icon: <Wind className="w-6 h-6" /> },
      { id: 'factory', name: 'Automaton Factory', cost: 500, cps: 5, owned: 0, icon: <Factory className="w-6 h-6" /> },
      { id: 'reactor', name: 'Steam Reactor', cost: 2000, cps: 20, owned: 0, icon: <Zap className="w-6 h-6" /> },
    ];
    
    if (saved) {
      const savedUpgrades = JSON.parse(saved);
      return defaultUpgrades.map(upgrade => ({
        ...upgrade,
        cost: savedUpgrades.find((u: Upgrade) => u.id === upgrade.id)?.cost ?? upgrade.cost,
        owned: savedUpgrades.find((u: Upgrade) => u.id === upgrade.id)?.owned ?? 0
      }));
    }
    return defaultUpgrades;
  });

  const [clickSize, setClickSize] = useState(1);
  const [isClicking, setIsClicking] = useState(false);
  const [popups, setPopups] = useState<CookiePopup[]>([]);
  const [steamParticles, setSteamParticles] = useState<{ id: number; x: number }[]>([]);
  const [cursors, setCursors] = useState<Cursor[]>([]);

  // Function to generate a random position around the cookie
  const getRandomCookiePosition = () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 80 + Math.random() * 20; // Random radius between 80-100px
    return {
      x: Math.cos(angle) * radius + 50, // Center + offset
      y: Math.sin(angle) * radius + 50, // Center + offset
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const cpsTotal = upgrades.reduce((acc, upgrade) => 
        acc + (upgrade.cps * upgrade.owned), 0);
      setCookies(prev => prev + cpsTotal);
      
      // Add steam particles periodically if we have any steam engines
      if (upgrades.find(u => u.id === 'engine')?.owned ?? 0 > 0) {
        setSteamParticles(prev => [
          ...prev,
          { id: Math.random(), x: Math.random() * 100 }
        ].slice(-5));
      }

      // Animate cursors
      const totalCursors = upgrades.reduce((acc, upgrade) => acc + upgrade.owned, 0);
      setCursors(prev => {
        const newCursors: Cursor[] = [];
        for (let i = 0; i < totalCursors; i++) {
          const pos = getRandomCookiePosition();
          newCursors.push({
            id: i,
            x: pos.x,
            y: pos.y,
            scale: Math.random() * 0.3 + 0.7, // Random scale between 0.7 and 1
          });
        }
        return newCursors;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [upgrades]);

  useEffect(() => {
    localStorage.setItem('cookies', cookies.toString());
    // Save only the necessary upgrade data without React elements
    const upgradeData = upgrades.map(({ id, name, cost, cps, owned }) => ({
      id,
      name,
      cost,
      cps,
      owned
    }));
    localStorage.setItem('upgrades', JSON.stringify(upgradeData));
  }, [cookies, upgrades]);

  const handleCookieClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCookies(prev => prev + clickSize);
    setIsClicking(true);
    
    // Add popup
    setPopups(prev => [
      ...prev,
      { id: Math.random(), value: clickSize, x, y }
    ]);

    setTimeout(() => {
      setPopups(prev => prev.slice(1));
      setIsClicking(false);
    }, 1000);
  };

  const buyUpgrade = (upgradeId: string) => {
    setUpgrades(prevUpgrades => {
      return prevUpgrades.map(upgrade => {
        if (upgrade.id === upgradeId && cookies >= upgrade.cost) {
          setCookies(prev => prev - upgrade.cost);
          return {
            ...upgrade,
            owned: upgrade.owned + 1,
            cost: Math.floor(upgrade.cost * 1.15)
          };
        }
        return upgrade;
      });
    });
  };

  const calculateCPS = () => {
    return upgrades.reduce((acc, upgrade) => 
      acc + (upgrade.cps * upgrade.owned *400000), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-stone-900 p-8 overflow-hidden">
      <div className="max-w-4xl mx-auto relative">
        {/* Background Decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {steamParticles.map(particle => (
            <div
              key={particle.id}
              className="absolute bottom-0 text-amber-500/20 animate-float"
              style={{ left: `${particle.x}%` }}
            >
              <Wind className="w-8 h-8" />
            </div>
          ))}
        </div>
        
        {/* Decorative cogs */}
        <div className="absolute -top-4 -left-4 text-amber-700/20 animate-spin-slow">
          <Cog className="w-24 h-24" />
        </div>
        <div className="absolute -bottom-4 -right-4 text-amber-700/20 animate-spin-reverse-slow">
          <Cog className="w-16 h-16" />
        </div>
        <div className="absolute top-1/2 -left-8 text-amber-700/10 animate-spin-slower">
          <Cog className="w-32 h-32" />
        </div>
        <div className="absolute top-1/3 -right-12 text-amber-700/10 animate-spin-reverse-slower">
          <Cog className="w-40 h-40" />
        </div>

        <div className="text-center mb-8 relative">
          <div className="absolute inset-x-0 top-0 flex justify-center">
            <Wrench className="w-8 h-8 text-amber-500/40 animate-wrench" />
          </div>
          <h1 className="text-4xl font-bold text-amber-500 mb-4 font-serif tracking-wider pt-8">
            Steampunk Cookie Factory
          </h1>
          <div className="inline-block bg-zinc-800/80 border border-amber-700/50 rounded-lg px-6 py-3 backdrop-blur-sm relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent animate-shine"></div>
            <div className="flex justify-center items-center gap-4 text-amber-400">
              <Cookie className="w-6 h-6" />
              <span className="text-2xl font-mono">
                <AnimatedNumber value={cookies} /> cookies
              </span>
            </div>
            <div className="flex justify-center items-center gap-2 text-amber-500/80 mt-2">
              <Gauge className="w-4 h-4 animate-pulse" />
              <span className="font-mono">
                <AnimatedNumber value={calculateCPS()} /> cookies per second
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <button
            onClick={handleCookieClick}
            className={`transform transition-transform ${
              isClicking ? 'scale-95' : 'scale-100 hover:scale-105'
            } relative group`}
          >
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl group-hover:bg-amber-500/30 transition-colors"></div>
            <Cookie 
              className="w-40 h-40 text-amber-400 cursor-pointer drop-shadow-[0_0_15px_rgba(217,119,6,0.3)] group-hover:text-amber-300 transition-colors relative"
            />
            {/* Automated Cursors */}
            {cursors.map(cursor => (
              <div
                key={cursor.id}
                className="absolute pointer-events-none text-amber-400/60 transition-all duration-1000"
                style={{
                  left: `${cursor.x}%`,
                  top: `${cursor.y}%`,
                  transform: `scale(${cursor.scale})`,
                }}
              >
                <MousePointer className="w-4 h-4" />
              </div>
            ))}
            {popups.map(popup => (
              <div
                key={popup.id}
                className="absolute pointer-events-none text-amber-400 font-mono animate-float-up"
                style={{ left: popup.x, top: popup.y }}
              >
                +{popup.value}
              </div>
            ))}
          </button>
        </div>

        <div className="bg-zinc-800/90 rounded-lg border border-amber-900/50 shadow-xl p-6 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-6">
              <Store className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-amber-500 font-serif">Mechanical Upgrades</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upgrades.map(upgrade => (
                <button
                  key={upgrade.id}
                  onClick={() => buyUpgrade(upgrade.id)}
                  disabled={cookies < upgrade.cost}
                  className={`p-4 rounded-lg border transition-all relative group ${
                    cookies >= upgrade.cost
                      ? 'border-amber-700/50 hover:border-amber-600 hover:bg-amber-900/20 cursor-pointer'
                      : 'border-zinc-700/50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 rounded-lg"></div>
                  <div className="flex justify-between items-center relative">
                    <div className="flex items-center gap-3">
                      <div className="text-amber-500">
                        {upgrade.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-amber-400 font-serif">{upgrade.name}</h3>
                        <p className="text-sm text-amber-500/80">
                          +{upgrade.cps} cookies/sec
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-amber-400 font-mono">
                        <AnimatedNumber value={upgrade.cost} /> cookies
                      </p>
                      <p className="text-sm text-amber-500/60 font-mono">
                        Owned: {upgrade.owned}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;