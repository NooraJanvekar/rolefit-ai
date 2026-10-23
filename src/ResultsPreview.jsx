function ResultsPreview() {
  return (
    <section className="analysis-results" aria-labelledby="results-heading">
      <div className="results-heading">
        <p className="eyebrow">RESULTS PREVIEW · SAMPLE DATA</p>

        <h2 id="results-heading">Your role-fit breakdown</h2>

        <p>
          This example previews the layout. It is not an analysis of your
          inputs.
        </p>
      </div>

      <div className="results-grid">
        <article className="result-card">
          <h3>Experience match</h3>

          <p>Where your background connects with the role.</p>

          <ul>
            <li>
              Cross-functional project experience aligns with coordinating work
              across product and engineering.
            </li>

            <li>
              Workflow prototyping provides relevant experience for testing and
              improving new ideas.
            </li>
          </ul>
        </article>

        <article className="result-card">
          <h3>Priority alignment</h3>

          <p>How the opportunity fits what you want next.</p>

          <ul>
            <li>
              Product discovery responsibilities could align with an interest in
              product management.
            </li>

            <li>
              Technical depth is unclear without more detail about the team's
              engineering collaboration.
            </li>
          </ul>
        </article>

        <article className="result-card">
          <h3>Gaps and unknowns</h3>

          <p>What needs stronger evidence or clarification.</p>

          <ul>
            <li>
              The profile does not yet demonstrate ownership of product success
              metrics.
            </li>

            <li>
              The posting does not specify how much ownership an intern
              receives.
            </li>
          </ul>
        </article>

        <article className="result-card">
          <h3>Suggested next step</h3>

          <p>How to act on the assessment.</p>

          <ul>
            <li>
              Highlight a project where user feedback influenced what you built.
            </li>

            <li>
              Ask the hiring team what an intern would own and how success would
              be measured.
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}

export default ResultsPreview;
