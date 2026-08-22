import type { LiftAnalyzeReport } from "@/lib/api/generated/models";

export function AnalysisReport({ report }: { report: LiftAnalyzeReport }) {
  const poor = report.view_quality === "poor";
  const good = report.verdict === "good" && !poor;
  const strengths = report.strengths ?? [];
  const issues = report.issues ?? [];
  const accessories = report.accessories ?? [];
  const focus = report.focus ?? [];

  return (
    <article className="animate-rise space-y-5 border border-paper/10 bg-paper/3 p-5">
      <header>
        <p className="font-display text-[10px] tracking-[0.16em] text-brand uppercase">
          {poor ? "Klatki za słabe" : good ? "Dobra technika" : "Do poprawy"}
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold uppercase">
          {report.headline}
        </h2>
      </header>

      {strengths.length > 0 ? (
        <section>
          <h3 className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
            {good ? "Co wyszło" : "Plusy"}
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-paper/80">
            {strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {!good && !poor && issues.length > 0 ? (
        <section className="space-y-3">
          <h3 className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
            Co poprawić
          </h3>
          {issues.map((issue, idx) => (
            <div
              key={`${issue.phase ?? ""}-${issue.problem ?? idx}`}
              className="border-l-2 border-brand/60 bg-brand/5 px-4 py-3"
            >
              {issue.phase ? (
                <p className="font-display text-[10px] tracking-[0.12em] text-brand uppercase">
                  {issue.phase}
                </p>
              ) : null}
              {issue.problem ? (
                <p className="mt-1 text-sm text-paper">{issue.problem}</p>
              ) : null}
              {issue.fix ? (
                <p className="mt-1 text-sm text-paper/70">{issue.fix}</p>
              ) : null}
              {issue.cue ? (
                <p className="mt-1 text-sm text-paper/55">Cue: {issue.cue}</p>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {good && issues.length === 1 ? (
        <section>
          <h3 className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
            Opcjonalny szlif
          </h3>
          <p className="mt-2 text-sm text-paper/75">
            {issues[0].problem}
            {issues[0].fix ? ` ${issues[0].fix}` : ""}
          </p>
        </section>
      ) : null}

      {!good && !poor && accessories.length > 0 ? (
        <section>
          <h3 className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
            Akcesoria
          </h3>
          <ul className="mt-2 space-y-2 text-sm">
            {accessories.map((a) => (
              <li key={a.name ?? a.why}>
                <span className="text-paper">{a.name}</span>
                {a.why ? (
                  <span className="text-paper/60"> — {a.why}</span>
                ) : null}
                {a.sets_hint ? (
                  <span className="text-paper/40"> ({a.sets_hint})</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!good && !poor && focus.length > 0 ? (
        <section>
          <h3 className="font-display text-[10px] tracking-[0.14em] text-paper/45 uppercase">
            Na najbliższe treningi
          </h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-paper/80">
            {focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ol>
        </section>
      ) : null}
    </article>
  );
}
