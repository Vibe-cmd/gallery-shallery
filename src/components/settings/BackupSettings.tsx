
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Cloud, Download, Upload, Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { GoogleDriveBackupService, createLocalBackup, importLocalBackup, BackupData } from "@/services/googleDriveBackup";
import { Album, AppTheme } from "@/pages/Index";
import { HomeCustomization } from "./AppSettingsModal";

interface BackupSettingsProps {
  albums: Album[];
  appTheme: AppTheme;
  homeCustomization: HomeCustomization;
  customFont: string;
  onImportData: (data: BackupData) => void;
}

export const BackupSettings: React.FC<BackupSettingsProps> = ({
  albums,
  appTheme,
  homeCustomization,
  customFont,
  onImportData
}) => {
  const [googleClientId, setGoogleClientId] = useState(localStorage.getItem('google_client_id') || '');
  const [googleApiKey, setGoogleApiKey] = useState(localStorage.getItem('google_api_key') || '');
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const driveService = new GoogleDriveBackupService();

  const saveGoogleCredentials = () => {
    localStorage.setItem('google_client_id', googleClientId);
    localStorage.setItem('google_api_key', googleApiKey);
    toast({
      title: "Credentials Saved",
      description: "Google Drive credentials have been saved locally.",
    });
  };

  const initializeGoogleDrive = async () => {
    if (!googleClientId || !googleApiKey) {
      toast({
        title: "Missing Credentials",
        description: "Please enter your Google Client ID and API Key first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await driveService.initialize(googleClientId, googleApiKey);
      await driveService.signIn();
      setIsGoogleSignedIn(true);
      toast({
        title: "Connected to Google Drive",
        description: "You can now backup and restore your data.",
      });
    } catch (error) {
      console.error('Google Drive initialization error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Drive. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOutGoogleDrive = async () => {
    try {
      await driveService.signOut();
      setIsGoogleSignedIn(false);
      toast({
        title: "Signed Out",
        description: "Disconnected from Google Drive.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const createBackupData = (): BackupData => ({
    albums,
    appTheme,
    homeCustomization,
    customFont,
    exportDate: new Date().toISOString(),
    version: '1.0'
  });

  const backupToGoogleDrive = async () => {
    if (!isGoogleSignedIn) {
      toast({
        title: "Not Connected",
        description: "Please connect to Google Drive first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const backupData = createBackupData();
      await driveService.createBackup(backupData);
      toast({
        title: "Backup Successful",
        description: "Your data has been backed up to Google Drive.",
      });
    } catch (error) {
      console.error('Backup error:', error);
      toast({
        title: "Backup Failed",
        description: "Failed to backup data to Google Drive.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadLocalBackup = () => {
    try {
      const backupData = createBackupData();
      createLocalBackup(backupData);
      toast({
        title: "Backup Downloaded",
        description: "Your backup file has been downloaded.",
      });
    } catch (error) {
      console.error('Local backup error:', error);
      toast({
        title: "Backup Failed",
        description: "Failed to create backup file.",
        variant: "destructive",
      });
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const backupData = await importLocalBackup(file);
      onImportData(backupData);
      toast({
        title: "Import Successful",
        description: "Your data has been restored from the backup file.",
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import backup file. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Cloud className="w-5 h-5" />
          Google Drive Backup
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="clientId">Google Client ID</Label>
            <Input
              id="clientId"
              type="text"
              value={googleClientId}
              onChange={(e) => setGoogleClientId(e.target.value)}
              placeholder="Enter your Google Client ID"
            />
          </div>
          
          <div>
            <Label htmlFor="apiKey">Google API Key</Label>
            <Input
              id="apiKey"
              type="text"
              value={googleApiKey}
              onChange={(e) => setGoogleApiKey(e.target.value)}
              placeholder="Enter your Google API Key"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={saveGoogleCredentials} variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Save Credentials
            </Button>
            
            {!isGoogleSignedIn ? (
              <Button onClick={initializeGoogleDrive} disabled={isLoading}>
                Connect to Google Drive
              </Button>
            ) : (
              <Button onClick={signOutGoogleDrive} variant="outline">
                Disconnect
              </Button>
            )}
          </div>
          
          {isGoogleSignedIn && (
            <Button onClick={backupToGoogleDrive} disabled={isLoading} className="w-full">
              <Cloud className="w-4 h-4 mr-2" />
              Backup to Google Drive
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Local Backup</h3>
        <div className="space-y-4">
          <Button onClick={downloadLocalBackup} variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Backup File
          </Button>
          
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              variant="outline" 
              className="w-full"
              disabled={isLoading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Backup File
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
