import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    triggerOnce = true,
    rootMargin = '0px'
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, triggerOnce, rootMargin]);

  return { ref: elementRef, isVisible };
};

export const useStaggerAnimation = (itemCount: number, options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    triggerOnce = true,
    rootMargin = '0px'
  } = options;

  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const items = new Array(itemCount).fill(false);
          setVisibleItems(items);

          items.forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems(prev => {
                const updated = [...prev];
                updated[index] = true;
                return updated;
              });
            }, index * 150);
          });

          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [itemCount, threshold, triggerOnce, rootMargin]);

  return { ref: sectionRef, visibleItems };
};
