// src/featureFlags.ts

interface FeatureFlags {
    ContextMenu: boolean;
  }
  
  const featureFlags: FeatureFlags = {
    ContextMenu: false, // Set this to true or false to enable/disable features
  };
  
  export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
    return featureFlags[flag];
  }
  