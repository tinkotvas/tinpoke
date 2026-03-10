import { useState, useEffect, useCallback } from 'react';
import { notification } from 'antd';
import { useMilestonesStore } from '../stores/milestonesStore.js';

const MILESTONE_THRESHOLDS = {
  25: { count: 38, label: '25%', message: 'Great start! You\'re a quarter of the way there!' },
  50: { count: 76, label: '50%', message: 'Halfway there! Keep up the great work!' },
  75: { count: 114, label: '75%', message: 'Three quarters done! The finish line is in sight!' },
  100: { count: 151, label: '100%', message: 'Congratulations! You\'ve completed the Kanto Pokédex!' },
};

export function useMilestones(caughtCount) {
  const [api, contextHolder] = notification.useNotification();
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Read from store
  const celebrated = useMilestonesStore((s) => s.celebrated);
  const markCelebrated = useMilestonesStore((s) => s.markCelebrated);

  const triggerCelebration = useCallback((milestone, data) => {
    api.success({
      message: `${data.label} Complete!`,
      description: data.message,
      duration: 5,
      placement: 'top',
    });

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, [api]);

  useEffect(() => {
    Object.entries(MILESTONE_THRESHOLDS).forEach(([milestone, data]) => {
      const milestoneNum = parseInt(milestone, 10);
      if (caughtCount >= data.count && !celebrated.has(milestoneNum)) {
        markCelebrated(milestoneNum);
        triggerCelebration(milestoneNum, data);
      }
    });
  }, [caughtCount, celebrated, markCelebrated, triggerCelebration]);

  return { celebrated, showConfetti, MILESTONE_THRESHOLDS, contextHolder };
}