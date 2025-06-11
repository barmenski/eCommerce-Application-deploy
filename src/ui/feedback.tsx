import type { Dispatch, JSX, SetStateAction } from 'react';
import { useEffect } from 'react';

type FeedbackMessage = {
  message: string;
  duration: number;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
};

export default function Feedback({
  message = '',
  duration = 3000,
  isVisible,
  setIsVisible,
}: FeedbackMessage): JSX.Element | null {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return (): void => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  return isVisible ? (
    <div className="feedback">
      <span className="feedback-msg">{message}</span>
    </div>
  ) : null;
}
