declare module '@react-native-google-signin/google-signin' {
  export interface GoogleSigninUser {
    id: string;
    name: string | null;
    email: string;
    photo: string | null;
    familyName: string | null;
    givenName: string | null;
  }

  export interface SignInResponse {
    idToken: string | null;
    serverAuthCode: string | null;
    user: GoogleSigninUser;
    scopes: string[];
    serverAuthCode: string | null;
  }

  export class GoogleSignin {
    static configure(options?: {
      webClientId?: string;
      offlineAccess?: boolean;
    }): void;
    static hasPlayServices(options?: {
      showPlayServicesUpdateDialog?: boolean;
    }): Promise<boolean>;
    static signIn(): Promise<{
      type: string;
      data: SignInResponse;
    }>;
  }
}
