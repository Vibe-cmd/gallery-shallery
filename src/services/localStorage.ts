
import { Album, AppTheme } from "@/pages/Index";
import { HomeCustomization } from "@/components/settings/AppSettingsModal";

const STORAGE_KEYS = {
  ALBUMS: 'gallery_shallery_albums',
  APP_THEME: 'gallery_shallery_theme',
  HOME_CUSTOMIZATION: 'gallery_shallery_home_customization',
  CUSTOM_FONT: 'gallery_shallery_custom_font'
};

export const localStorageService = {
  // Albums
  saveAlbums: (albums: Album[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALBUMS, JSON.stringify(albums));
    } catch (error) {
      console.error('Error saving albums to localStorage:', error);
    }
  },

  loadAlbums: (): Album[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALBUMS);
      if (saved) {
        const albums = JSON.parse(saved);
        // Convert date strings back to Date objects
        return albums.map((album: any) => ({
          ...album,
          createdAt: new Date(album.createdAt),
          photos: album.photos.map((photo: any) => ({
            ...photo,
            date: photo.date ? new Date(photo.date) : undefined
          }))
        }));
      }
    } catch (error) {
      console.error('Error loading albums from localStorage:', error);
    }
    return [];
  },

  // App Theme
  saveAppTheme: (theme: AppTheme) => {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_THEME, JSON.stringify(theme));
    } catch (error) {
      console.error('Error saving app theme to localStorage:', error);
    }
  },

  loadAppTheme: (): AppTheme | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APP_THEME);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading app theme from localStorage:', error);
    }
    return null;
  },

  // Home Customization
  saveHomeCustomization: (customization: HomeCustomization) => {
    try {
      localStorage.setItem(STORAGE_KEYS.HOME_CUSTOMIZATION, JSON.stringify(customization));
    } catch (error) {
      console.error('Error saving home customization to localStorage:', error);
    }
  },

  loadHomeCustomization: (): HomeCustomization | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOME_CUSTOMIZATION);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading home customization from localStorage:', error);
    }
    return null;
  },

  // Custom Font
  saveCustomFont: (font: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_FONT, font);
    } catch (error) {
      console.error('Error saving custom font to localStorage:', error);
    }
  },

  loadCustomFont: (): string => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CUSTOM_FONT) || "";
    } catch (error) {
      console.error('Error loading custom font from localStorage:', error);
    }
    return "";
  }
};
