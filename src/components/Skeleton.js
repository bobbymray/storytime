import styles from './Skeleton.module.scss'

export default function Skeleton () {
  return (
    <>
      <h1 className={styles.skeleton}>&nbsp;</h1>

      <p className={styles.skeleton}>&nbsp;</p>

      <section>
        <p className={styles.skeleton}>&nbsp;</p>
        <p className={styles.skeleton}>&nbsp;<br />&nbsp;<br />&nbsp;</p>
        <p className={styles.skeleton}>&nbsp;<br />&nbsp;</p>
      </section>
    </>
  )
}
