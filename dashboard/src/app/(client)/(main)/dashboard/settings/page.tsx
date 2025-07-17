'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useUser } from '@/store/userId.context';
import axios from 'axios';

export default function BillingPage() {
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const userId = useUser();

  const handleGenerateKey = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/keys/getApiKey', {
        username: userId?.user.userId,
      });
      setApiKey(response.data.api_key);
      setCopied(false);
    } catch (error) {
      console.error('Error generating API key:', error);
    }
  };

  return (
    <div className="grid gap-1 py-10 md:py-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold md:text-4xl text-white">Settings</h1>
        <p className="text-sm text-muted-foreground text-white">Manage your account settings</p>
      </div>

      <h3 className="mb-2 text-xl font-medium text-white">Keys</h3>
      <p className="mb-4 text-base text-white">
        For security reasons, we do not store your keys (not even encrypted!). So, remember to save the key in a secure
        location. However, you can always generate one in case you lose it :)
      </p>

      <div className="flex mb-10 mt-5 flex-col space-y-4">
        <Button onClick={handleGenerateKey}>Generate Key</Button>
        {apiKey && (
          <div className="flex flex-col space-y-2">
            <textarea
              className="p-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-muted"
              rows={3}
              readOnly
              value={apiKey}
            />
            <CopyToClipboard text={apiKey} onCopy={() => setCopied(true)}>
              <Button variant="secondary" className="text-white">
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </CopyToClipboard>
          </div>
        )}
      </div>

      <h3 className="mb-2 text-lg font-medium text-white">Email Notifications</h3>
      <div className="space-y-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <div className="text-white">Marketing emails</div>
            <div className="text-white">Receive emails about new products, features, and more.</div>
          </div>
          <div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
}
