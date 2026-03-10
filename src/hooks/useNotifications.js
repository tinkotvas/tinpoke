import { useState, useEffect, useCallback, useRef } from 'react';
import { notification } from 'antd';
import { useMilestonesStore } from '../stores/milestonesStore.js';
import { BADGES } from '../data/badges.js';

// Milestone thresholds configuration
export const MILESTONE_THRESHOLDS = {
  25: { count: 38, label: '25%', message: 'Great start! You\'re a quarter of the way there!' },
  50: { count: 76, label: '50%', message: 'Halfway there! Keep up the great work!' },
  75: { count: 114, label: '75%', message: 'Three quarters done! The finish line is in sight!' },
  100: { count: 151, label: '100%', message: 'Congratulations! You\'ve completed the Kanto Pokédex!' },
};

// Create a map for quick badge lookup
const BADGE_MAP = Object.fromEntries(BADGES.map(b => [b.id, b]));

/**
 * Consolidated notifications hook for both milestones and badges.
 * Uses a single notification context to avoid duplicate key warnings.
 * 
 * @param {number} caughtCount - Number of caught Pokémon
 * @param {Set} badges - Set of earned badge IDs
 * @returns {Object} { contextHolder, showConfetti, celebrated, MILESTONE_THRESHOLDS }
 */
export function useNotifications(caughtCount, badges) {
  // Single notification API instance
  const [api, contextHolder] = notification.useNotification();
  
  // Milestone state
  const [showConfetti, setShowConfetti] = useState(false);
  const celebrated = useMilestonesStore((s) => s.celebrated);
  const markCelebrated = useMilestonesStore((s) => s.markCelebrated);
  
  // Badge tracking
  const prevBadgesRef = useRef(badges);

  // Milestone notification handler
  const triggerMilestoneCelebration = useCallback((milestone, data) => {
    api.success({
      message: `${data.label} Complete!`,
      description: data.message,
      duration: 5,
      placement: 'top',
    });

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, [api]);

  // Check for milestone achievements
  useEffect(() => {
    Object.entries(MILESTONE_THRESHOLDS).forEach(([milestone, data]) => {
      const milestoneNum = parseInt(milestone, 10);
      if (caughtCount >= data.count && !celebrated.has(milestoneNum)) {
        markCelebrated(milestoneNum);
        triggerMilestoneCelebration(milestoneNum, data);
      }
    });
  }, [caughtCount, celebrated, markCelebrated, triggerMilestoneCelebration]);

  // Check for newly earned badges
  useEffect(() => {
    const prevBadges = prevBadgesRef.current;
    
    // Find newly earned badges (in current but not in previous)
    badges?.forEach((badgeId) => {
      if (!prevBadges?.has(badgeId)) {
        const badge = BADGE_MAP[badgeId];
        if (badge) {
          api.success({
            message: `${badge.icon} ${badge.name} Badge Earned!`,
            description: `${badge.leader}: "${badge.quote}"`,
            duration: 5,
            placement: 'top',
          });
        }
      }
    });

    prevBadgesRef.current = badges;
  }, [badges, api]);

  return { contextHolder, showConfetti, celebrated, MILESTONE_THRESHOLDS };
}