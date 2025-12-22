import React, { useState, useEffect } from 'react';
import { MessageCircle, Cigarette, Wine, Heart, Eye, Skull } from 'lucide-react';
import './App.css'

const LastTimeSince = () => {
  const timestamps = {
    textedHer: new Date('2025-12-08 23:47:00').getTime(),
    smokedJoint: new Date('2025-12-06 22:38:00').getTime(),
    smokedCigarette: new Date('2025-12-22 18:38:00').getTime(),
    drankAlcohol: new Date('2025-12-06 23:48:00').getTime(),
    // talkedNiceToFather: new Date('2024-12-16 18:45:00').getTime(),
    sawHer: new Date('2025-12-22 17:47:00').getTime()
  };

  const [elapsed, setElapsed] = useState({});
  const [currentQuote, setCurrentQuote] = useState(0);



  const activities = [
    { 
      key: 'textedHer', 
      label: 'i texted her', 
      icon: MessageCircle, 
      color: '#dc2626'
    },
    { 
      key: 'sawHer', 
      label: 'i saw her', 
      icon: Eye, 
      color: '#f43f5e'
    },
    { 
      key: 'smokedJoint', 
      label: 'i smoked joint', 
      icon: Cigarette, 
      color: '#10b981'
    },
    { 
      key: 'smokedCigarette', 
      label: 'i smoked cigarette', 
      icon: Cigarette, 
      color: '#6b7280'
    },
    { 
      key: 'drankAlcohol', 
      label: 'i drank alcohol', 
      icon: Wine, 
      color: '#9333ea'
    },
    // { 
    //   key: 'talkedNiceToFather', 
    //   label: 'i talked nice to father', 
    //   icon: Heart, 
    //   color: '#3b82f6'
    // },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newElapsed = {};
      Object.keys(timestamps).forEach(key => {
        if (timestamps[key]) {
          const diff = Date.now() - timestamps[key];
          newElapsed[key] = diff;
        }
      });
      setElapsed(newElapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, []);



  const formatTime = (ms) => {
    if (!ms) return 'forever';
    
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="app-container">
      <div className="background-vignette" />
      
      <div className="animated-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="grain-overlay" />

      <div className="content-wrapper">
        <div className="skull-container">
          <div className="skull-wrapper">
            <Skull className="skull-icon" />
            <div className="skull-ping">
              <Skull className="skull-icon" />
            </div>
          </div>
        </div>

        <div className="header">
          <h1 className="title">
            <div className="title-line-1">LAST TIME</div>
            <div className="title-line-2">SINCE</div>
          </h1>
          
          <div className="divider-container">
            <div className="divider" />
          </div>
        </div>

        <div className="cards-grid">
          {activities.map((activity) => {
            const Icon = activity.icon;
            const timeElapsed = elapsed[activity.key];
            
            return (
              <div
                key={activity.key}
                className="card"
                style={{
                  background: `linear-gradient(135deg, ${activity.color}40 0%, ${activity.color}10 50%, #000 100%)`,
                  boxShadow: `0 0 60px -15px ${activity.color}80`
                }}
              >
                <div className="card-overlay" />
                <div className="card-gradient" />
                
                <div className="card-content">
                  <div className="icon-container">
                    <div className="icon-wrapper">
                      <Icon className="activity-icon" style={{color: activity.color}} />
                      <div className="icon-ping" />
                    </div>
                  </div>

                  <h3 className="activity-label">{activity.label}</h3>

                  <div className="time-display">
                    <div className="time-value" style={{color: activity.color}}>
                      {formatTime(timeElapsed)}
                    </div>
                    <div className="time-suffix">of suffering</div>
                  </div>

                  <div className="card-bottom-line" style={{background: `linear-gradient(to right, transparent, ${activity.color}60, transparent)`}} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="footer">
          <div className="neon-container">
            <div className="neon-flicker">
              <span className="neon-text">FUCK</span>
              <span className="neon-text neon-delay">OFF</span>
            </div>
            <div className="neon-glow-bg"></div>
          </div>
        </div>
      </div>

      <div className="corner-accent corner-top-right" />
      <div className="corner-accent corner-bottom-left" />
    </div>
  );
};

export default LastTimeSince;