import type { TrustBarItem } from "@/content/global-settings";

export function TrustBar({ items }: { items: TrustBarItem[] }) {
  return (
    <div className="trust-bar">
      <div className="wrap">
        {items.map((item, i) => (
          <div className="trust-item" key={i}>
            <span className="ico">{item.icon}</span>
            <span>
              {item.before}
              <strong>{item.strong}</strong>
              {item.after}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
