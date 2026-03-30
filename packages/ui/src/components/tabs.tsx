'use client';

import { HTMLAttributes, createContext, useContext, useState, forwardRef } from 'react';
import { cn } from '@sociolume/utils';

interface TabsContextValue {
  variant?: 'tabs' | 'pills';
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue>({});

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  variant?: 'tabs' | 'pills';
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tab: string) => void;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, variant = 'tabs', defaultTab, activeTab, onChange, children, ...props }, ref) => {
    const [currentTab, setCurrentTab] = useState<string>(defaultTab || '');
    const currentActiveTab = activeTab ?? currentTab;

    const handleTabChange = (tab: string) => {
      setCurrentTab(tab);
      onChange?.(tab);
    };

    return (
      <TabsContext.Provider
        value={{ variant, activeTab: currentActiveTab, setActiveTab: handleTabChange }}
      >
        <div ref={ref} className={cn(variant, className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
}

export interface TabProps extends HTMLAttributes<HTMLLabelElement> {
  value: string;
  disabled?: boolean;
}

export const Tab = forwardRef<HTMLLabelElement, TabProps>(
  ({ className, value, disabled, children, ...props }, ref) => {
    const { variant, activeTab, setActiveTab } = useTabsContext();
    const isActive = activeTab === value;

    return (
      <label
        ref={ref}
        className={cn(
          'tab',
          variant === 'pills' && isActive && 'tab-active',
          disabled && 'tab-disabled',
          className
        )}
        onClick={() => !disabled && setActiveTab?.(value)}
        {...props}
      >
        <input type="radio" name="tabs" disabled={disabled} />
        {children}
      </label>
    );
  }
);

Tab.displayName = 'Tab';

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ className, value, children, ...props }, ref) => {
    const { activeTab } = useTabsContext();

    if (activeTab !== value) return null;

    return (
      <div ref={ref} className={cn('tab-content', className)} {...props}>
        {children}
      </div>
    );
  }
);

TabPanel.displayName = 'TabPanel';
