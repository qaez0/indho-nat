import { useRef, useEffect, useCallback } from 'react';
import { ScrollView } from 'react-native';

interface UseAutoSwipeProps {
  itemWidth: number;
  itemGap: number;
  totalItems: number;
  autoSwipeInterval?: number;
  pauseOnHover?: boolean;
}

export const useAutoSwipe = ({
  itemWidth,
  itemGap,
  totalItems,
  autoSwipeInterval = 3000, // 3 seconds
  pauseOnHover = true,
}: UseAutoSwipeProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const currentIndexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToIndex = useCallback((index: number) => {
    if (scrollViewRef.current && totalItems > 0) {
      // Calculate scroll position to move exactly one game width
      // This makes the first game disappear and next game start at left edge
      const scrollX = index * (itemWidth + itemGap);
      scrollViewRef.current.scrollTo({
        x: scrollX,
        animated: true,
      });
      currentIndexRef.current = index;
    }
  }, [itemWidth, itemGap, totalItems]);

  const nextItem = useCallback(() => {
    if (totalItems <= 1) return;
    
    const nextIndex = (currentIndexRef.current + 1) % totalItems;
    scrollToIndex(nextIndex);
  }, [scrollToIndex, totalItems]);

  const startAutoSwipe = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (totalItems > 1) {
      intervalRef.current = setInterval(() => {
        if (!isPausedRef.current) {
          nextItem();
        }
      }, autoSwipeInterval);
    }
  }, [nextItem, autoSwipeInterval, totalItems]);

  const stopAutoSwipe = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const pauseAutoSwipe = useCallback(() => {
    if (pauseOnHover) {
      isPausedRef.current = true;
    }
  }, [pauseOnHover]);

  const resumeAutoSwipe = useCallback(() => {
    if (pauseOnHover) {
      isPausedRef.current = false;
    }
  }, [pauseOnHover]);

  const handleManualScrollEnd = useCallback(() => {
    // Clear any existing resume timeout
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    
    // Set a timeout to resume auto-swipe after manual scroll ends
    resumeTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
      startAutoSwipe(); // Restart the auto-swipe interval
    }, 2000); // Resume after 2 seconds of no manual interaction
  }, [startAutoSwipe]);

  const handleScroll = useCallback((event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    // Calculate index based on exact game width movement
    const newIndex = Math.round(scrollX / (itemWidth + itemGap));
    currentIndexRef.current = Math.max(0, newIndex);
    
    // Trigger manual scroll end handler to resume auto-swipe
    handleManualScrollEnd();
  }, [itemWidth, itemGap, handleManualScrollEnd]);

  useEffect(() => {
    startAutoSwipe();
    return () => {
      stopAutoSwipe();
      // Clean up timeout on unmount
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [startAutoSwipe, stopAutoSwipe]);

  return {
    scrollViewRef,
    handleScroll,
    handleManualScrollEnd,
    pauseAutoSwipe,
    resumeAutoSwipe,
    startAutoSwipe,
    stopAutoSwipe,
    scrollToIndex,
  };
};
