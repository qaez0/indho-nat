/**
 * Utility functions for handling GameLogin URL parameters in the native app.
 * 
 * For native apps:
 * - device: Always "H5" (mobile)
 * - return_url: Always "game11ic://" (deep link scheme)
 */

/**
 * Detects the device type for GameLogin requests.
 * In native apps, this is always "H5" (mobile).
 */
export const detectGameLoginDevice = (): 'H5' => {
    // Native apps are always mobile
    return 'H5';
  };
  
  /**
   * Adds the device parameter to GameLogin URLs.
   * Only processes URLs containing "/GameLogin" or "/GameLoginTest".
   * 
   * @param url - The GameLogin URL
   * @param device - The device type (always "H5" for native)
   * @returns The URL with device parameter added
   */
  export const addDeviceParamToGameLogin = (
    url: string,
    device: 'H5' | 'PC',
  ): string => {
    const isGameLoginUrl =
      url.includes('/Login/GameLogin/') ||
      url.includes('/Login/GameLoginTest/');
  
    if (!isGameLoginUrl) {
      return url;
    }
  
    try {
      // Parse the URL to handle existing query parameters
      const [path, existingQuery = ''] = url.split('?');
      const queryParams = new URLSearchParams(existingQuery);
      
      // Add or overwrite device parameter
      queryParams.set('device', device);
  
      // Reconstruct URL with device parameter
      const queryString = queryParams.toString();
      return queryString ? `${path}?${queryString}` : path;
    } catch (error) {
      // If URL parsing fails, fallback to simple append
      console.warn('Failed to parse GameLogin URL:', error);
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}device=${device}`;
    }
  };
  
  /**
   * Appends the return_url parameter to GameLogin URLs.
   * For native apps, this is always "game11ic://" (deep link scheme).
   * 
   * @param url - The GameLogin URL (may already have device parameter)
   * @returns The URL with return_url parameter added
   */
  export const appendReturnUrlIfNeeded = (url: string): string => {
    const isGameLoginUrl =
      url.includes('/Login/GameLogin/') ||
      url.includes('/Login/GameLoginTest/');
  
    if (!isGameLoginUrl) {
      return url;
    }
  
    try {
      // Parse the URL to handle existing query parameters
      const [path, existingQuery = ''] = url.split('?');
      const queryParams = new URLSearchParams(existingQuery);
      
      // Only add return_url if not already present
      if (!queryParams.has('return_url')) {
        queryParams.set('return_url', 'game11ic://');
      }
  
      // Reconstruct URL with return_url parameter
      const queryString = queryParams.toString();
      return queryString ? `${path}?${queryString}` : path;
    } catch (error) {
      // If URL parsing fails, fallback to simple append
      console.warn('Failed to parse GameLogin URL for return_url:', error);
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}return_url=game11ic://`;
    }
  };
  
  /**
   * Applies both device and return_url parameters to a GameLogin URL.
   * This is the main function to use when preparing GameLogin URLs.
   * 
   * @param url - The GameLogin URL
   * @returns The URL with both device and return_url parameters added
   */
  export const prepareGameLoginUrl = (url: string): string => {
    const device = detectGameLoginDevice();
    let processedUrl = addDeviceParamToGameLogin(url, device);
    processedUrl = appendReturnUrlIfNeeded(processedUrl);
    return processedUrl;
  };
  