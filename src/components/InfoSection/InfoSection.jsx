import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ballVideo from '../../assets/ball.mp4'
import styles from './InfoSection.module.css'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
  { num: '01.', title: 'Creative Design', desc: 'Beautiful, modern interfaces crafted\nwith attention to every detail.' },
  { num: '02.', title: 'Smooth Animations', desc: 'Fluid 3D animations and transitions\nthat bring your vision to life.' },
  { num: '03.', title: 'Premium Quality', desc: 'Production-ready solutions built\nwith cutting-edge technology.' },
]

export default function InfoSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.aboutItem}`, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="info" ref={sectionRef} className={styles.aboutSection}>
      <div className={styles.aboutContent}>
        <h2 className={styles.aboutTitle}>What's inside?</h2>
        <div className={styles.aboutList}>
          {ITEMS.map(item => (
            <div key={item.num} className={styles.aboutItem}>
              <span className={styles.aboutNumber}>{item.num}</span>
              <div className={styles.aboutText}>
                <h3>{item.title}</h3>
                <p>{item.desc.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && item.desc.includes('\n') ? <br/> : ''}</span>)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.aboutVideoWrapper}>
        <video autoPlay muted loop playsInline className={styles.aboutVideo}>
          <source src={ballVideo} type="video/mp4" />
        </video>
      </div>
    </section>
  )
}
