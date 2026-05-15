'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';
import { useGameStore } from 'lib/gameState';
import { ROUTES } from 'lib/routes';
import { TEAMS } from 'lib/teams';
import styles from './page.module.scss';

type Step = 'pipa' | 'nickname' | 'team';

export default function OnboardingPage() {
  const router = useRouter();
  const registerPlayer = useGameStore((s) => s.registerPlayer);
  const [step, setStep] = useState<Step>('pipa');
  const [nickname, setNickname] = useState('');
  const [teamId, setTeamId] = useState('');

  const onAgree = () => setStep('nickname');
  const onNickNext = () => {
    if (nickname.trim().length < 2) return;
    setStep('team');
  };
  const onTeamNext = () => {
    if (!teamId) return;
    registerPlayer({ nickname: nickname.trim(), team: teamId });
    router.push(ROUTES.PLAY);
  };

  return (
    <main className={styles.onboarding}>
      {step === 'pipa' && (
        <section className={styles.onboarding__section}>
          <h2 className={styles.onboarding__title}>개인정보 수집·이용 동의</h2>
          <div className={styles.onboarding__pipa}>
            <p><b>수집 항목:</b> 닉네임, 응원팀, 게임 플레이 기록, 응모권 내역</p>
            <p><b>이용 목적:</b> 게임 서비스 제공, 명예의 전당 노출, 응모권 지급</p>
            <p><b>보관 기간:</b> 회원 탈퇴 시까지</p>
            <p className={styles.onboarding__note}>미동의 시 게임을 이용하실 수 없습니다.</p>
          </div>
          <button className={styles.onboarding__cta} onClick={onAgree}>
            동의하고 시작
          </button>
        </section>
      )}

      {step === 'nickname' && (
        <section className={styles.onboarding__section}>
          <h2 className={styles.onboarding__title}>닉네임을 정해주세요</h2>
          <input
            className={styles.onboarding__input}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="2~12자"
            maxLength={12}
          />
          <button
            className={clsx(styles.onboarding__cta, {
              [styles['onboarding__cta--disabled'] as string]: nickname.trim().length < 2,
            })}
            onClick={onNickNext}
          >
            다음
          </button>
        </section>
      )}

      {step === 'team' && (
        <section className={styles.onboarding__section}>
          <h2 className={styles.onboarding__title}>응원하는 팀을 선택하세요</h2>
          <div className={styles.onboarding__teams}>
            {TEAMS.map((t) => (
              <button
                key={t.id}
                className={clsx(styles.onboarding__team, {
                  [styles['onboarding__team--active'] as string]: teamId === t.id,
                })}
                style={{ borderColor: t.color }}
                onClick={() => setTeamId(t.id)}
              >
                {t.name}
              </button>
            ))}
          </div>
          <button
            className={clsx(styles.onboarding__cta, {
              [styles['onboarding__cta--disabled'] as string]: !teamId,
            })}
            onClick={onTeamNext}
          >
            완료
          </button>
        </section>
      )}
    </main>
  );
}
