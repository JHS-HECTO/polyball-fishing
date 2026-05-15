'use client';

import Link from 'next/link';
import { ROUTES } from 'lib/routes';
import styles from './page.module.scss';

export default function TitlePage() {
  return (
    <main className={styles.title}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/01-title-bg.png" alt="" className={styles.title__bg} draggable={false} />
      <div className={styles.title__content}>
        <h1 className={styles.title__heading}>응모권 낚시하기</h1>
        <p className={styles.title__subtitle}>저수지에서 황금물고기를 잡아보세요</p>
        <div className={styles.title__actions}>
          <Link href={ROUTES.PLAY} className={styles.title__cta}>
            시작하기
          </Link>
        </div>
      </div>
    </main>
  );
}
