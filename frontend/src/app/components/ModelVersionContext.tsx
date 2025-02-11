"use client"

import React, { createContext, useState, useContext } from "react";

interface Version {
  key: string;
  label: string;
}

interface ModelVersionContextType {
  selectedVersion: Version;
  setSelectedVersion: React.Dispatch<React.SetStateAction<Version>>;
}

const ModelVersionContext = createContext<ModelVersionContextType | undefined>(undefined);

export const SelectedVersionProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedVersion, setSelectedVersion] = useState<Version>({
    key: "gpt-4o-mini",
    label: "ChatGPT 4o-mini",
  });

  return (
    <ModelVersionContext.Provider value={{ selectedVersion, setSelectedVersion }}>
      {children}
    </ModelVersionContext.Provider>
  );
};

export const useSelectedVersion = () => {
  const context = useContext(ModelVersionContext);
  if (!context) {
    throw new Error("useSelectedVersion must be used within a SelectedVersionProvider");
  }
  return context;
};
