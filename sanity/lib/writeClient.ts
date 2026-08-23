import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// Server-only client for writes (e.g. lead form submissions). Never import
// this from a Client Component — the write token must not reach the browser.
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});
