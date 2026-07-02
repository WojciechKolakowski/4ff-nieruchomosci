import { searchFormConfig } from "@/content/search-config";

export function SearchBar() {
  const {
    locationLabel,
    locationOptions,
    propertyTypeLabel,
    propertyTypeOptions,
    priceLabel,
    priceThresholds,
    submitButtonLabel,
  } = searchFormConfig;

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
