import React, { useState, useMemo } from 'react';
import Button from '../design/components/Button';
import { useNavigate } from 'react-router-dom';
import { getAllSets, getSetIcon } from '../data/sets';

const SetsSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  
  
  // Get specific sets: SPM, Final Fantasy, and Edge of Eternities
  const recentSets = useMemo(() => {
    const allSets = getAllSets();
    return allSets
      .filter(set => {
        const name = set.name.toLowerCase();
        const code = set.code.toLowerCase();
        return (
          code === 'spm' || 
          name.includes('spider-man') ||
          name.includes('final fantasy') ||
          name.includes('edge of eternities')
        );
      })
      .filter(set => !set.name.includes('Token') && !set.name.includes('Art Series') && !set.name.includes('Promo'))
      .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  }, []);

  const handleSetClick = (setCode) => {
    navigate(`/search?set=${setCode.toLowerCase()}`);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'} sticky top-6`}>
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className={`font-semibold text-gray-800 ${isCollapsed ? 'hidden' : 'block'}`}>
          New Sets
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-pressed={isCollapsed}
          aria-label={isCollapsed ? 'Expand new sets panel' : 'Collapse new sets panel'}
          className="p-1 text-gray-600"
        >
          {isCollapsed ? '→' : '←'}
        </Button>
      </div>
      
      <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
        <div>
          {recentSets.slice(0, 10).map((set) => {
            const iconPath = getSetIcon(set.code);
            return (
              <div
                key={set.code}
                onClick={() => handleSetClick(set.code)}
                className="flex items-center p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 mr-3 flex items-center justify-center">
                  {iconPath ? (
                    <div className="w-8 h-8 flex items-center justify-center">
                      <img 
                        src={iconPath} 
                        alt={set.name}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-500 font-bold">
                        {set.code.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate font-medium">
                    {set.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {set.code.toUpperCase()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {isCollapsed && (
        <div className="p-2">
          <div className="text-center">
            <span className="text-xs text-gray-500 writing-vertical">Sets</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetsSidebar;
