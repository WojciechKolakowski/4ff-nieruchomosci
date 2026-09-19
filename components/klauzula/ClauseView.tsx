import { Fragment } from "react";
import type { ClauseVersion } from "@/templates/klauzula-rodo";

type Content = ClauseVersion["content"];
type Run = Content["letterhead"][number];

/**
 * Pure presentational components: they render the approved clause text from
 * templates/klauzula-rodo/<version>/content.ts and nothing else. No state, no
 * hooks — the text-parity test renders them to static HTML and compares the
 * result with the template PDF.
 */

export function RunsView({ runs }: { runs: Run[] }) {
  return (
    <>
      {runs.map((run, index) => {
        if (run.bold) return <strong key={index}>{run.text}</strong>;
        if (run.italic) return <em key={index}>{run.text}</em>;
        return <Fragment key={index}>{run.text}</Fragment>;
      })}
    </>
  );
}

/** Letterhead, title and clause points 1–9 (everything above the acknowledgement). */
export function ClauseView({ content }: { content: Content }) {
  return (
    <article className="kl-doc">
      <div className="kl-letterhead">
        {content.letterhead.map((run, index) => (
          <p key={index}>
            <RunsView runs={[run]} />
          </p>
        ))}
      </div>

      <h2 className="kl-doc-title">{content.title}</h2>
      <p className="kl-doc-subtitle">{content.subtitle}</p>

      {content.clauseBlocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return <h3 key={index}>{block.text}</h3>;
          case "paragraph":
            return (
              <p key={index}>
                <RunsView runs={block.runs} />
              </p>
            );
          case "bullets":
            return (
              <ul key={index}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <RunsView runs={item} />
                  </li>
                ))}
              </ul>
            );
          case "table":
            return (
              <div className="kl-table-wrap" key={index}>
                <table className="kl-table">
                  <thead>
                    <tr>
                      {block.columns.map((column) => (
                        <th scope="col" key={column}>
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} data-label={block.columns[cellIndex]}>
                            <RunsView runs={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </article>
  );
}

/** "Potwierdzam, że zapoznałem/zapoznałam się…" */
export function Acknowledgement({ content }: { content: Content }) {
  return <p className="kl-ack">{content.acknowledgement}</p>;
}

/** Title, subtitle and intro of the marketing-consent page. */
export function ConsentHeader({ content }: { content: Content }) {
  // A <div>, not <header>: the public site styles every <header> element
  // globally (green sticky bar), which would leak into this block.
  return (
    <div className="kl-consent-head">
      <h2 className="kl-doc-title">{content.consent.title}</h2>
      <p className="kl-doc-subtitle">
        <em>{content.consent.subtitle}</em>
      </p>
      <p>{content.consent.intro}</p>
    </div>
  );
}

/** "Wyrażam zgodę na przetwarzanie moich danych osobowych… (proszę zaznaczyć wybrane):" */
export function ConsentStatement({ content }: { content: Content }) {
  return (
    <p className="kl-consent-statement">
      <RunsView runs={content.consent.statement} />
    </p>
  );
}
