import { useState, useEffect } from 'preact/hooks';

export function Toast({ message }: { message: string }, duration = 3000) {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  return (
    <div className={`toast ${isVisible ? 'show' : 'hide'}`}>
      {message}
    </div>
  );
}