import { Stats } from "@/components/Stats";
import styles from "./page.module.css";
import { Display } from "@/components/Display";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Stats correct={20} incorrect={30} highestConsecutive={10}/>
        {/* <Display/> */}
      </main>
    </div>
  );
}
