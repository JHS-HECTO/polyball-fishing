import styles from './Angler.module.scss';

type Props = { castedRod: boolean };

export function Angler({ castedRod }: Props) {
  return (
    <div className={styles.angler}>
      <div className={styles.angler__body}>
        <div className={styles.angler__head} />
        <div className={styles.angler__torso} />
      </div>
      <div
        className={styles.angler__rod}
        data-cast={castedRod ? 'yes' : 'no'}
      />
    </div>
  );
}
