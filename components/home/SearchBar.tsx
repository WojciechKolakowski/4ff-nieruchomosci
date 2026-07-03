import type { SearchFormConfig } from "@/content/search-config";
import { parsePriceThreshold } from "@/content/search-config";

interface SearchBarDefaults {
  powiat?: string;
  propertyType?: string;
  maxPrice?: string;
}

export function SearchBar({
  config,
  defaultValues,
}: {
  config: SearchFormConfig;
  defaultValues?: SearchBarDefaults;
}) {
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
    <form className="search-bar" method="get" action="/nieruchomosci">
      <div className="search-field">
        <label htmlFor="powiat">{locationLabel}</label>
        <select id="powiat" name="powiat" defaultValue={defaultValues?.powiat ?? ""}>
          {locationOptions.map((opt) => (
            <option key={opt} value={opt === "Cała oferta" ? "" : opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="search-field">
        <label htmlFor="propertyType">{propertyTypeLabel}</label>
        <select
          id="propertyType"
          name="propertyType"
          defaultValue={defaultValues?.propertyType ?? ""}
        >
          {propertyTypeOptions.map((opt) => (
            <option key={opt} value={opt === "Dowolny" ? "" : opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="search-field">
        <label htmlFor="maxPrice">{priceLabel}</label>
        <select id="maxPrice" name="maxPrice" defaultValue={defaultValues?.maxPrice ?? ""}>
          {priceThresholds.map((opt) => {
            const value = parsePriceThreshold(opt);
            return (
              <option key={opt} value={value || ""}>
                {opt}
              </option>
            );
          })}
        </select>
      </div>
      <button type="submit" className="btn btn-gold search-submit">
        {submitButtonLabel}
      </button>
    </form>
  );
}
