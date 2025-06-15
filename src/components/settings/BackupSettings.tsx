
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { createLocalBackup, importLocalBackup, BackupData } from "@/services/googleDriveBackup";
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
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createBackupData = (): BackupData => ({
    albums,
    appTheme,
    homeCustomization,
    customFont,
    exportDate: new Date().toISOString(),
    version: '1.0'
  });

  const downloadLocalBackup = () => {
    try {
      const backupData = createBackupData();
      createLocalBackup(backupData);
      toast({
        title: "Backup Downloaded",
        description: "Your backup file has been downloaded to your computer.",
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
        <h3 className="text-lg font-semibold mb-2">Backup & Restore</h3>
        <p className="text-sm text-gray-600 mb-6">
          Export all your albums, photos, themes, and customizations to a backup file, 
          or restore your data from a previously created backup.
        </p>
        
        <div className="space-y-4">
          <Button onClick={downloadLocalBackup} variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Backup File
          </Button>
          
          <Separator />
          
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
              {isLoading ? "Importing..." : "Import Backup File"}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Select a .json backup file to restore your data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
