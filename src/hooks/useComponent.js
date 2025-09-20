import { useState, useEffect } from 'react';
import { componentRegistry } from '../registry/ComponentRegistry.js';

export const useComponent = (componentName) => {
  const [component, setComponent] = useState(null);
  const [currentSkin, setCurrentSkin] = useState(componentRegistry.getCurrentSkin());

  useEffect(() => {
    // Get the component for the current skin
    const comp = componentRegistry.getComponent(componentName);
    setComponent(() => comp);

    // Listen for skin changes
    const unsubscribe = componentRegistry.addListener((newSkin) => {
      setCurrentSkin(newSkin);
      const newComp = componentRegistry.getComponent(componentName);
      setComponent(() => newComp);
    });

    return unsubscribe;
  }, [componentName]);

  return component;
};

export const useSkin = () => {
  const [currentSkin, setCurrentSkin] = useState(componentRegistry.getCurrentSkin());
  const [availableSkins, setAvailableSkins] = useState(componentRegistry.getAvailableSkins());

  useEffect(() => {
    const unsubscribe = componentRegistry.addListener((newSkin) => {
      setCurrentSkin(newSkin);
      setAvailableSkins(componentRegistry.getAvailableSkins());
    });

    return unsubscribe;
  }, []);

  const switchSkin = (skinName) => {
    componentRegistry.switchSkin(skinName);
    componentRegistry.saveSkinToStorage();
  };

  return {
    currentSkin,
    availableSkins,
    switchSkin
  };
};