import styles from './Angler.module.scss';

type Props = { castedRod: boolean };

// Layered back-view angler. Stacked PNGs (torso / head / arm+rod) so the rod
// arm can rotate independently for casting motion. PNGs come from
// public/images/02*-angler-*.png.
export function Angler({ castedRod }: Props) {
  return (
    <div className={styles.angler}>
      {/* eslint-disable @next/next/no-img-element */}
      <img
        src="/images/02a-angler-torso.png"
        alt=""
        className={styles.angler__torso}
        draggable={false}
      />
      <img
        src="/images/02b-angler-head.png"
        alt=""
        className={styles.angler__head}
        draggable={false}
      />
      <img
        src="/images/02c-angler-arm.png"
        alt=""
        className={styles.angler__arm}
        data-cast={castedRod ? 'yes' : 'no'}
        draggable={false}
      />
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  );
}
