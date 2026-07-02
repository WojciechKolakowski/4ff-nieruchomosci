import type { SearchFormConfig } from "@/content/search-config";

export function SearchBar({ config }: { config: SearchFormConfig }) {
  const {
    locationLabel,
    locationOptions,
    propertyTypeLabel,
    propertyTypeOptions,
    priceLabel,
    priceThresholds,
    submitButtonLabel,
  } = config;

  return (
    <div className="search-bar">
      <div className="search-field">
        <label>{locationLabel}</label>
        <select>
          {locationOptions.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div className="search-field">
        <label>{propertyTypeLabel}</label>
        <select>
          {propertyTypeOptions.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div className="search-field">
        <label>{priceLabel}</label>
        <select>
          {priceThresholds.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <button className="btn btn-gold search-submit">{submitButtonLabel}</button>
    </div>
  );
}
