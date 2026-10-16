import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Dataset } from '../types'

interface Props {
  dataset: Dataset
  onFinish: () => void
}

export function IntroScreen({ dataset, onFinish }: Props) {
  const [phase, setPhase] = useState(0)
  const [ready, setReady] = useState(false)

  const { stages } = dataset

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 2600),
      setTimeout(() => setPhase(3), 5200),
      setTimeout(() => setReady(true), 7200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleEnter = () => {
    if (ready) onFinish()
  }

  const dustParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 13) % 100}%`,
    delay: `${(i * 0.23) % 6}s`,
    duration: `${4 + (i % 4)}s`,
    size: `${2 + (i % 3)}px`,
  }))

  return (
    <div className="intro" onClick={handleEnter}>
      {/* 背景层 */}
      <div className="intro__bg" />

      {/* 宫殿剪影 */}
      <div className="intro__palace">
        <svg
          viewBox="0 0 800 200"
          preserveAspectRatio="xMidYMax meet"
          className="intro__palace-svg"
        >
          <defs>
            <linearGradient id="palaceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c9a03a" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#b83a2a" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          {/* 左侧配殿 */}
          <polygon
            points="0,200 60,160 100,150 140,160 180,200"
            fill="url(#palaceGrad)"
            opacity="0.4"
          />
          {/* 主殿下层屋顶 */}
          <polygon
            points="100,200 200,120 300,100 400,90 500,100 600,120 700,200"
            fill="url(#palaceGrad)"
            opacity="0.55"
          />
          {/* 主殿上层屋顶 */}
          <polygon
            points="250,200 320,150 380,140 420,140 480,150 550,200"
            fill="url(#palaceGrad)"
            opacity="0.7"
          />
          {/* 宝顶 */}
          <circle cx="400" cy="130" r="7" fill="#d4a843" opacity="0.5" />
          {/* 右侧配殿 */}
          <polygon
            points="620,200 660,160 700,150 740,160 800,200"
            fill="url(#palaceGrad)"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* 飘动的云 */}
      <div className="intro__clouds">
        <div className="intro__cloud intro__cloud--1" />
        <div className="intro__cloud intro__cloud--2" />
        <div className="intro__cloud intro__cloud--3" />
      </div>

      {/* 金色光尘 */}
      <div className="intro__dust">
        {dustParticles.map((p) => (
          <span
            key={p.id}
            className="intro__dust-particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* 内容层 —— 绝对定位叠加 */}
      <div className="intro__content">
        {/* 命运宣言：仅在 phase === 1 显示，退场向上滑出 */}
        <motion.div
          className="intro__scene"
          initial={{ opacity: 0, y: 50 }}
          animate={
            phase === 1
              ? { opacity: 1, y: 0 }
              : phase > 1
                ? { opacity: 0, y: -50 }
                : { opacity: 0, y: 50 }
          }
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          <p className="intro__quote">自佃农之子，至九五之尊。</p>
        </motion.div>

        {/* 阶段宫灯：仅在 phase === 2 显示 */}
        <motion.div
          className="intro__scene"
          initial={{ opacity: 0, y: 50 }}
          animate={
            phase === 2
              ? { opacity: 1, y: 0 }
              : phase > 2
                ? { opacity: 0, y: -50 }
                : { opacity: 0, y: 50 }
          }
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          <div className="intro__stages">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.key}
                className="intro__stage-lantern"
                initial={{ opacity: 0, y: 24, scale: 0.85 }}
                animate={
                  phase === 2
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 24, scale: 0.85 }
                }
                transition={{ delay: i * 0.35, duration: 0.7, ease: 'easeOut' }}
              >
                <span className="intro__stage-name">{stage.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 大标题 + 按钮：仅在 phase === 3 显示 */}
        <motion.div
          className="intro__scene"
          initial={{ opacity: 0, y: 50 }}
          animate={
            phase === 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
          }
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          <motion.h1
            className="intro__title"
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={
              phase === 3
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 32, scale: 0.92 }
            }
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            朱元璋命运轨迹可视化
          </motion.h1>
          <motion.p
            className="intro__subtitle"
            initial={{ opacity: 0 }}
            animate={phase === 3 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            从佃农之子到开国皇帝——命运的三条线，在此交织。
          </motion.p>

          <motion.button
            type="button"
            className="intro__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={phase === 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            onClick={(e) => {
              e.stopPropagation()
              handleEnter()
            }}
          >
            <span className="intro__cta-text">开启篇章</span>
            <span className="intro__cta-shine" />
          </motion.button>

          {ready && (
            <motion.p
              className="intro__hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              点击屏幕任意处进入
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* 跳过 */}
      <button
        type="button"
        className="intro__skip"
        onClick={(e) => {
          e.stopPropagation()
          onFinish()
        }}
      >
        跳过
      </button>
    </div>
  )
}
