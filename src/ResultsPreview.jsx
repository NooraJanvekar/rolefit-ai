const dimensions = [
  ['skills', 'Skills alignment'], ['experience', 'Experience alignment'], ['career', 'Career alignment'],
]

export default function Results({ analysis }) {
  return <div className="stack results">
    <section className="card result-summary">
      <div><h2>Overall alignment</h2><p>{analysis.summary}</p></div>
      <div className="score">{analysis.overall ?? '—'}{analysis.overall !== null && <small> / 100</small>}</div>
      <p className="wide">Evidence supports {analysis.coveredWeight}% of the scoring weight. Alignment describes how the role fits your profile and priorities.</p>
    </section>
    <div className="result-grid">
      {dimensions.map(([key, title]) => {
        const dimension = analysis[key]
        const { score, weight } = analysis.scores[key]
        return <article className="card" key={key}>
          <h3>{title}</h3><p className="metric">{score ?? 'Unscored'}</p>
          <p className="muted">{weight}% weight · {dimension.confidence} confidence</p>
          <p>{dimension.explanation}</p>
          {score !== null && <progress aria-label={title} value={score} max="100" />}
          {(dimension.evidence.length > 0 || dimension.gaps.length > 0) && <details>
            <summary>Evidence and gaps</summary>
          {dimension.evidence.map(({ profile, posting }, index) => <blockquote key={index}>
            <p><strong>Your profile</strong><br />{profile}</p><p><strong>The posting</strong><br />{posting}</p>
          </blockquote>)}
          {dimension.gaps.length > 0 && <><h4>Where you might need a stronger example</h4><ul>{dimension.gaps.map((gap, index) => <li key={index}>{gap}</li>)}</ul></>}</details>}
        </article>
      })}
    </div>
    <section className="card">
      <h2>Eligibility and logistics</h2>
      {analysis.eligibility.length ? <ul className="eligibility">{analysis.eligibility.map((item, index) => <li key={index}>
        <span className="tag" data-status={item.status}>{item.status}</span>
        <div><strong>{item.requirement}</strong><p>{item.evidence}</p></div>
      </li>)}</ul> : <p>Review the original posting for eligibility requirements.</p>}
    </section>
    <section className="card"><h2>What to check next</h2>
      {analysis.recommendations.length ? <ol>{analysis.recommendations.map((item, index) => <li key={index}>{item}</li>)}</ol> : <p>Review the gaps and eligibility details before deciding whether to apply.</p>}
    </section>
  </div>
}
