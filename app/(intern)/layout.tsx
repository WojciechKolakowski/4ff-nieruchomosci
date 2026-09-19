// Internal pages: deliberately outside the (site) group, so they get none of
// the public site's chrome — no header/footer, no Sanity queries, no cookie
// banner and, above all, no Meta Pixel on a page that shows client data.
export default function InternLayout({ children }: { children: React.ReactNode }) {
  return <div className="kl-shell">{children}</div>;
}
