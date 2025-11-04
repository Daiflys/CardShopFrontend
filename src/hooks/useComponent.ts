import { useState, useEffect } from 'react';
import { componentRegistry } from '../registry/ComponentRegistry.js';

export const useComponent = <T = any>(componentName: string): T | null => {
  const [component, setComponent] = useState<T | null>(null);
  const [currentSkin, setCurrentSkin] = useState<string>(componentRegistry.getCurrentSkin());

  useEffect(() => {
    // Get the component for the current skin
    const comp = componentRegistry.getComponent(componentName);
    setComponent(() => comp);

    // Listen for skin changes
    const unsubscribe = componentRegistry.addListener((newSkin: string) => {
      setCurrentSkin(newSkin);
      const newComp = componentRegistry.getComponent(componentName);
      setComponent(() => newComp);
    });

    return unsubscribe;
  }, [componentName]);

  return component;
};

export interface UseSkinReturn {
  currentSkin: string;
  availableSkins: string[];
  switchSkin: (skinName: string) => void;
}

export const useSkin = (): UseSkinReturn => {
  const [currentSkin, setCurrentSkin] = useState<string>(componentRegistry.getCurrentSkin());
  const [availableSkins, setAvailableSkins] = useState<string[]>(componentRegistry.getAvailableSkins());

  useEffect(() => {
    const unsubscribe = componentRegistry.addListener((newSkin: string) => {
      setCurrentSkin(newSkin);
      setAvailableSkins(componentRegistry.getAvailableSkins());
    });

    return unsubscribe;
  }, []);

  const switchSkin = (skinName: string): void => {
    componentRegistry.switchSkin(skinName);
    componentRegistry.saveSkinToStorage();
  };

  return {
    currentSkin,
    availableSkins,
    switchSkin
  };
};
