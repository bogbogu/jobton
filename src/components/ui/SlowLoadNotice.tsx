import { useEffect, useState } from "react";

const SLOW_AFTER_MS = 6000;

// Free hosting puts the API to sleep, and the first request after a quiet
// spell can take up to a minute. Mount this only while something is loading:
// it says nothing at first and, if the wait drags on, explains why. The
// polite live region is in the DOM from the start so the late message is
// announced; unmounting (loading finished) removes it and its timer.
const SlowLoadNotice = ({ className = "" }: { className?: string }) => {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsSlow(true), SLOW_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div aria-live="polite">
      {isSlow && (
        <p className={`text-sm text-slate-500 dark:text-slate-400 ${className}`}>
          Still loading… our server is waking up, this can take up to a minute the first time.
        </p>
      )}
    </div>
  );
};

export default SlowLoadNotice;
