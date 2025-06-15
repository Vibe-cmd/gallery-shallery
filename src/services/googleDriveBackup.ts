
// Google Drive backup service for exporting app data
export interface BackupData {
  albums: any[];
  appTheme: any;
  homeCustomization: any;
  customFont: string;
  exportDate: string;
  version: string;
}

export class GoogleDriveBackupService {
  private static CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // User will need to set this
  private static API_KEY = 'YOUR_GOOGLE_API_KEY'; // User will need to set this
  private static DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
  private static SCOPES = 'https://www.googleapis.com/auth/drive.file';

  private gapi: any;
  private isInitialized = false;

  constructor() {
    this.loadGoogleAPI();
  }

  private async loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          (window as any).gapi.load('client:auth2', resolve);
        };
        script.onerror = reject;
        document.head.appendChild(script);
      }
    });
  }

  async initialize(clientId: string, apiKey: string) {
    if (this.isInitialized) return;

    await this.loadGoogleAPI();
    this.gapi = (window as any).gapi;

    await this.gapi.client.init({
      apiKey: apiKey,
      clientId: clientId,
      discoveryDocs: [GoogleDriveBackupService.DISCOVERY_DOC],
      scope: GoogleDriveBackupService.SCOPES
    });

    this.isInitialized = true;
  }

  async signIn() {
    if (!this.isInitialized) {
      throw new Error('Google Drive API not initialized');
    }
    
    const authInstance = this.gapi.auth2.getAuthInstance();
    return await authInstance.signIn();
  }

  async signOut() {
    if (!this.isInitialized) return;
    
    const authInstance = this.gapi.auth2.getAuthInstance();
    return await authInstance.signOut();
  }

  isSignedIn(): boolean {
    if (!this.isInitialized) return false;
    
    const authInstance = this.gapi.auth2.getAuthInstance();
    return authInstance.isSignedIn.get();
  }

  async createBackup(backupData: BackupData): Promise<void> {
    if (!this.isSignedIn()) {
      throw new Error('Please sign in to Google Drive first');
    }

    const fileName = `gallery-shallery-backup-${new Date().toISOString().split('T')[0]}.json`;
    const fileContent = JSON.stringify(backupData, null, 2);

    const fileMetadata = {
      name: fileName,
      parents: [] // Root folder
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(fileMetadata)], {type: 'application/json'}));
    form.append('file', new Blob([fileContent], {type: 'application/json'}));

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
      }),
      body: form
    });

    if (!response.ok) {
      throw new Error('Failed to upload backup to Google Drive');
    }

    return response.json();
  }

  async listBackups(): Promise<any[]> {
    if (!this.isSignedIn()) {
      throw new Error('Please sign in to Google Drive first');
    }

    const response = await this.gapi.client.drive.files.list({
      q: "name contains 'gallery-shallery-backup'",
      orderBy: 'createdTime desc'
    });

    return response.result.files || [];
  }

  async downloadBackup(fileId: string): Promise<BackupData> {
    if (!this.isSignedIn()) {
      throw new Error('Please sign in to Google Drive first');
    }

    const response = await this.gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media'
    });

    return JSON.parse(response.body);
  }
}

// Fallback: Simple JSON download backup
export const createLocalBackup = (backupData: BackupData) => {
  const fileName = `gallery-shallery-backup-${new Date().toISOString().split('T')[0]}.json`;
  const fileContent = JSON.stringify(backupData, null, 2);
  
  const blob = new Blob([fileContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const importLocalBackup = (file: File): Promise<BackupData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);
        resolve(backupData);
      } catch (error) {
        reject(new Error('Invalid backup file format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
