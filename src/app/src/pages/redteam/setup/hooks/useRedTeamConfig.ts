import { ApiSchemas } from '@server/apiSchemas';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Config, ProviderOptions } from '../types';

export const DEFAULT_HTTP_TARGET: ProviderOptions = {
  id: 'http',
  config: {
    url: '',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // @ts-ignore
    body: {
      message: '{{prompt}}',
    },
  },
};

export const PROMPT_EXAMPLE =
  'You are a travel agent specialized in budget trips to Europe\n\nUser query: {{prompt}}';

export const DEFAULT_PURPOSE = 'Assist users with planning affordable trips to Europe';

const defaultConfig: Config = {
  description: 'My Red Team Configuration',
  prompts: ['{{prompt}}'],
  target: DEFAULT_HTTP_TARGET,
  plugins: ['default'],
  strategies: ['jailbreak', 'prompt-injection'],
  purpose: '',
  entities: [],
};

interface RedTeamConfigState {
  config: Config;
  updateConfig: (section: keyof Config, value: any) => void;
  resetConfig: () => void;
  sendConfig: (email: string) => Promise<any>;
}

export const useRedTeamConfig = create<RedTeamConfigState>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      updateConfig: (section, value) =>
        set((state) => ({
          config: {
            ...state.config,
            [section]: value,
          },
        })),
      resetConfig: () => set({ config: defaultConfig }),
      sendConfig: async (email: string) => {
        const { config } = get();
        const response = await fetch('/api/redteam/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, config }),
        });

        if (!response.ok) {
          throw new Error('Failed to send config copy');
        }

        const result = await response.json();
        return ApiSchemas.Redteam.Send.Response.parse(result);
      },
    }),
    {
      name: 'redTeamConfig',
      skipHydration: true,
    },
  ),
);
