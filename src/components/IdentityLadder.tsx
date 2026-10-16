interface Props {
  ladder: string[]
  current: string
}

export function IdentityLadder({ ladder, current }: Props) {
  const idx = Math.max(0, ladder.indexOf(current))

  return (
    <div className="ladder" role="list" aria-label="身份阶梯">
      <div className="ladder__track">
        {ladder.map((rung, i) => (
          <span
            key={rung}
            role="listitem"
            title={rung}
            className={`ladder__step ${
              i < idx ? 'is-past' : i === idx ? 'is-current' : ''
            }`}
          >
            <span className="ladder__dot" />
          </span>
        ))}
      </div>
      <span className="ladder__caption">
        第 {idx + 1} 级 · 共 {ladder.length} 级
      </span>
    </div>
  )
}
