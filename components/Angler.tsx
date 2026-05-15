import styles from './Angler.module.scss';

type Props = { castedRod: boolean };

// Back-view angler: viewer sees the back of the head + hat brim + torso.
// Fishing rod sticks out diagonally upward into the lake above.
export function Angler({ castedRod }: Props) {
  return (
    <div className={styles.angler}>
      <div className={styles.angler__torso} />
      <div className={styles.angler__head} />
      <div className={styles.angler__hatBrim} />
      <div className={styles.angler__hatTop} />
      <div
        className={styles.angler__rod}
        data-cast={castedRod ? 'yes' : 'no'}
      />
    </div>
  );
}
