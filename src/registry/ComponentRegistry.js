class ComponentRegistry {
  constructor() {
    this.skins = new Map();
    this.currentSkin = 'default';
    this.listeners = new Set();
  }

  registerSkin(skinName, components) {
    this.skins.set(skinName, components);
  }

  getComponent(componentName) {
    const currentSkin = this.skins.get(this.currentSkin);
    const defaultSkin = this.skins.get('default');

    // Try current skin first, fallback to default
    return currentSkin?.[componentName] || defaultSkin?.[componentName];
  }

  switchSkin(skinName) {
    if (this.skins.has(skinName)) {
      this.currentSkin = skinName;
      this.notifyListeners();
    } else {
      console.warn(`Skin "${skinName}" not found. Available skins:`, Array.from(this.skins.keys()));
    }
  }

  getCurrentSkin() {
    return this.currentSkin;
  }

  getAvailableSkins() {
    return Array.from(this.skins.keys());
  }

  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentSkin));
  }

  loadSkinFromStorage() {
    const savedSkin = localStorage.getItem('currentSkin');
    if (savedSkin && this.skins.has(savedSkin)) {
      this.currentSkin = savedSkin;
    }
  }

  saveSkinToStorage() {
    localStorage.setItem('currentSkin', this.currentSkin);
  }
}

// Global registry instance
export const componentRegistry = new ComponentRegistry();

export default ComponentRegistry;