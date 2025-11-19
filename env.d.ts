declare module '@env' {
  // Dynamic environment variable types
  // This provides type safety while allowing any string key
  interface EnvVars {
    [key: string]: string;
  }

  const env: EnvVars;

  // Export individual variables for direct import
  export const BASE_URL: string;
  export const PUBLIC_CLIENT_KEY: string;
  export const MICROSERVICE_URL: string;
  export const NESTJS_API_BASE: string;
  export const TB_BOT_ID: string;
  export const TG_BOT_NAME: string;
  export const GOOGLE_CLIENT_ID: string
  // Export the entire env object as default
  export = env;
}

// Image asset type declarations
declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.jpeg' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.gif' {
  const content: any;
  export default content;
}
