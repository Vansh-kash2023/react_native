import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        const storedFont = await AsyncStorage.getItem('fontSizeMultiplier');
        
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === 'dark');
        } else {
          setIsDarkMode(systemColorScheme === 'dark');
        }

        if (storedFont !== null) {
          setFontSizeMultiplier(parseFloat(storedFont));
        }
      } catch (err) {
        console.log("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (e) {
      console.log(e);
    }
  };

  const changeFontSize = async (multiplier) => {
    try {
      setFontSizeMultiplier(multiplier);
      await AsyncStorage.setItem('fontSizeMultiplier', multiplier.toString());
    } catch (e) {
      console.log(e);
    }
  };

  const colors = {
    primary: '#3b82f6', // Light blue (blue-500)
    primaryLight: '#bfdbfe', // blue-200
    primaryDark: '#1d4ed8', // blue-700
    background: isDarkMode ? '#0d1117' : '#f8fafc', // GitHub-style dark mode
    card: isDarkMode ? '#161b22' : '#ffffff',
    text: isDarkMode ? '#c9d1d9' : '#0f172a',
    textMuted: isDarkMode ? '#8b949e' : '#64748b',
    border: isDarkMode ? '#30363d' : '#e2e8f0',
    black: '#0f172a',
    white: '#ffffff',
    danger: '#da3633', // Adjusted red for github-style dark
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, fontSizeMultiplier, changeFontSize, colors, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
