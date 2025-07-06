'use client'

import React, { useState } from 'react';

export default function ThreePageNavigation() {
  const [showGreeting, setShowGreeting] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);

  const handleGreetingClick = () => {
    setShowGreeting(false);
  };

  const handleSectionClick = (section: SectionKey) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  const getZIndex = (section: string) => {
    if (!activeSection) {
      switch (section) {
        case 'treeking': return 3;
        case 'camping': return 2;
        case 'concert': return 1;
        default: return 1;
      }
    } else {
      // Only active section is visible when expanded
      return activeSection === section ? 10 : 0;
    }
  };

  const getBackgroundStyle = (section: string) => {
    const baseStyle = {
      zIndex: getZIndex(section)
    };

    if (activeSection === section) {
      // Active section's background expands to full screen
      return {
        ...baseStyle,
        top: '0',
        height: '100%',
      };
    } else {
      // Non-active sections keep their original background size
      switch (section) {
        case 'treeking':
          return {
            ...baseStyle,
            top: '0',
            height: '33.33%'
          };
        case 'camping':
          return {
            ...baseStyle,
            top: '33.33%',
            height: '33.34%',
            boxShadow: activeSection ? 'none' : '0px -10px 10px black'
          };
        case 'concert':
          return {
            ...baseStyle,
            top: '66.67%',
            height: '33.33%',
            boxShadow: activeSection ? 'none' : '0px -10px 10px black'
          };
        default:
          return baseStyle;
      }
    }
  };

  type SectionKey = 'treeking' | 'camping' | 'concert';

  const getContentForSection = (section: SectionKey) => {
    const content: Record<SectionKey, { up: string[]; middle: string[]; down: string[] }> = {
      treeking: {
        up: [
          "🌲 PRIME-UP / PURPLE-UP Content",
          "This is the prime-up section content. Advanced mountain hiking, forest canopy exploration, and high-altitude adventures.",
          "Expert-level treeking techniques, wilderness survival skills, and professional mountaineering strategies."
        ],
        middle: [
          "🌳 PURPLE-MIDDLE Content", 
          "This is the middle section of purple treeking content. Intermediate trail navigation, seasonal hiking considerations, and equipment selection.",
          "Weather safety protocols, wildlife awareness, and sustainable hiking practices for responsible outdoor recreation."
        ],
        down: [
          "🌿 PURPLE-DOWN Content",
          "This is the lower section of purple treeking content. Beginner-friendly hiking information, basic gear recommendations, and safety fundamentals.",
          "Getting started with treeking, choosing appropriate footwear, and planning your first hiking adventures."
        ]
      },
      camping: {
        up: [
          "🏔️ BLUE-UP Content",
          "This is the upper section of blue camping content. Advanced wilderness camping, extreme weather techniques, and expedition camping strategies.",
          "High-altitude camping, ice camping, and professional outdoor expedition management for experienced campers."
        ],
        middle: [
          "🏕️ PRIME-MIDDLE / BLUE-MIDDLE Content",
          "This is the prime-middle section content. Intermediate campsite selection, outdoor cooking techniques, and camping equipment essentials.",
          "Fire safety protocols, food storage methods, Leave No Trace principles, and seasonal camping considerations."
        ],
        down: [
          "🏞️ BLUE-DOWN Content", 
          "This is the lower section of blue camping content. Beginner camping basics, family-friendly campgrounds, and essential camping safety.",
          "Setting up your first camping experience, basic camping supplies, and easy outdoor destinations for newcomers."
        ]
      },
      concert: {
        up: [
          "🎸 PINK-UP Content",
          "This is the upper section of pink concert content. Professional music production, large-scale event management, and advanced sound engineering.",
          "Concert venue operations, artist coordination, and music industry production techniques for professionals."
        ],
        middle: [
          "🎵 PINK-MIDDLE Content",
          "This is the middle section of pink concert content. Music genre exploration, live performance experiences, and concert culture.",
          "Venue acoustics, crowd dynamics, and the cultural significance of live music in modern entertainment."
        ],
        down: [
          "🎤 PRIME-DOWN / PINK-DOWN Content",
          "This is the prime-down section content. Concert basics for beginners, ticket purchasing, and first-time concert experiences.",
          "What to expect at concerts, discovering new music, and enjoying live performances safely and responsibly."
        ]
      }
    };

    return content[section];
  };

  // Greeting Screen
  if (showGreeting) {
    return (
      <div 
        className="fixed inset-0 w-full h-full bg-black cursor-pointer flex items-center justify-center transition-all duration-500 hover:bg-gray-900"
        onClick={handleGreetingClick}
      >
        <div className="text-center space-y-8 px-8">
          <div className="text-6xl md:text-8xl font-bold text-white animate-pulse">
            Coming Soon
          </div>
          <div className="text-xl md:text-2xl text-gray-300 opacity-80">
            Click anywhere to enter
          </div>
          <div className="text-sm text-gray-500 opacity-60">
            Your adventure awaits...
          </div>
        </div>
      </div>
    );
  }

  // Main Navigation (your existing code)
  return (
    <div className="fixed inset-0 w-full h-full">
      {/* Background layers */}
      <div 
        className="absolute left-0 w-full transition-all duration-300"
        style={{
          backgroundColor: '#130117',
          ...getBackgroundStyle('treeking')
        }}
      />
      
      <div 
        className="absolute left-0 w-full transition-all duration-300"
        style={{
          backgroundColor: '#5e39e0',
          ...getBackgroundStyle('camping')
        }}
      />
      
      <div 
        className="absolute left-0 w-full transition-all duration-300"
        style={{
          backgroundColor: '#e357b8',
          ...getBackgroundStyle('concert')
        }}
      />

      {/* Content layers - these stay in fixed positions when not expanded */}
      {!activeSection && (
        <>
          {/* Prime-Up (Treeking) */}
          <div 
            className="absolute top-0 left-0 w-full h-1/3 cursor-pointer hover:opacity-90 transition-all duration-300 flex items-center justify-center"
            style={{ zIndex: 103 }}
            onClick={() => handleSectionClick('treeking')}
          >
            <div className="text-white text-2xl font-bold">
              🌳 Prime-Up
            </div>
          </div>

          {/* Prime-Middle (Camping) */}
          <div 
            className="absolute left-0 w-full h-1/3 cursor-pointer hover:opacity-90 transition-all duration-300 flex items-center justify-center"
            style={{ top: '33.33%', zIndex: 102 }}
            onClick={() => handleSectionClick('camping')}
          >
            <div className="text-white text-2xl font-bold">
              🏕️ Prime-Middle
            </div>
          </div>

          {/* Prime-Down (Concert) */}
          <div 
            className="absolute left-0 w-full h-1/3 cursor-pointer hover:opacity-90 transition-all duration-300 flex items-center justify-center"
            style={{ top: '66.67%', zIndex: 101 }}
            onClick={() => handleSectionClick('concert')}
          >
            <div className="text-white text-2xl font-bold">
              🎵 Prime-Down
            </div>
          </div>
        </>
      )}

      {activeSection && ['treeking', 'camping', 'concert'].includes(activeSection) && (
        <div className="absolute inset-0 text-white" style={{ zIndex: 15 }}>
          {/* Upper section */}
          <div className={`h-1/3 p-6 border-b border-white/20 overflow-auto flex items-center justify-center relative ${
            activeSection === 'treeking' ? 'cursor-pointer hover:opacity-90' : ''
          }`}
               onClick={activeSection === 'treeking' ? () => setActiveSection(null) : undefined}>
            <div className="space-y-4">
              {getContentForSection(activeSection as SectionKey).up.map((paragraph, index) => (
                <p key={index} className={`${index === 0 ? 'text-2xl font-bold mb-4' : 'text-base leading-relaxed'}`}>
                  {paragraph}
                </p>
              ))}
            </div>
            {/* Close button for treeking (black background) - appears in UP section */}
            {activeSection === 'treeking' && (
              <div 
                className="absolute bottom-4 right-4 text-white text-2xl cursor-pointer hover:opacity-70 font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection(null);
                }}
              >
                ×
              </div>
            )}
          </div>

          {/* Middle section */}
          <div className={`h-1/3 p-6 border-b border-white/20 overflow-auto flex items-center justify-center relative ${
            activeSection === 'camping' ? 'cursor-pointer hover:opacity-90' : ''
          }`}
               onClick={activeSection === 'camping' ? () => setActiveSection(null) : undefined}>
            <div className="space-y-4">
              {getContentForSection(activeSection as SectionKey).middle.map((paragraph, index) => (
                <p key={index} className={`${index === 0 ? 'text-2xl font-bold mb-4' : 'text-base leading-relaxed'}`}>
                  {paragraph}
                </p>
              ))}
            </div>
            {/* Close button for camping (purple background) - appears in MIDDLE section */}
            {activeSection === 'camping' && (
              <div 
                className="absolute bottom-4 right-4 text-white text-2xl cursor-pointer hover:opacity-70 font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection(null);
                }}
              >
                ×
              </div>
            )}
          </div>

          {/* Lower section */}
          <div className={`h-1/3 p-6 overflow-auto flex items-center justify-center relative ${
            activeSection === 'concert' ? 'cursor-pointer hover:opacity-90' : ''
          }`}
               onClick={activeSection === 'concert' ? () => setActiveSection(null) : undefined}>
            <div className="space-y-4">
              {getContentForSection(activeSection as SectionKey).down.map((paragraph, index) => (
                <p key={index} className={`${index === 0 ? 'text-2xl font-bold mb-4' : 'text-base leading-relaxed'}`}>
                  {paragraph}
                </p>
              ))}
            </div>
            {/* Close button for concert (pink background) - appears in DOWN section */}
            {activeSection === 'concert' && (
              <div 
                className="absolute bottom-4 right-4 text-white text-2xl cursor-pointer hover:opacity-70 font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection(null);
                }}
              >
                ×
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}