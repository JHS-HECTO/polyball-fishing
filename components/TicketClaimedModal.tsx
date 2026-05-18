'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import styles from './TicketClaimedModal.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv = motion.div as ComponentType<any>;

type Props = {
  count?: number;
  onClose: () => void;
};

// "Ticket granted" celebration used after a progress-bar claim. Distinct from
// the golden-fish flow so the copy fits the source (player filled the gauge
// and earned the ticket vs. caught a golden fish).
export function TicketClaimedModal({ count = 1, onClose }: Props) {
  return (
    <MotionDiv
      className={styles.modal}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <MotionDiv
        className={styles.modal__card}
        initial={{ scale: 0.5, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      >
        <MotionDiv
          className={styles.modal__ticket}
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/15-ticket.png" alt="응모권" className={styles.modal__ticketImg} draggable={false} />
        </MotionDiv>

        <h3 className={styles.modal__title}>응모권 {count}장 지급 완료!</h3>
        <p className={styles.modal__subtitle}>응모권은 폴리볼 마이페이지에서 확인할 수 있어요</p>

        <button className={styles.modal__cta} onClick={onClose}>
          확인
        </button>
      </MotionDiv>
    </MotionDiv>
  );
}
