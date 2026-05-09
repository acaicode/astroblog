/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly CI_SKIP_CONTENT_COLLECTIONS?: string;
  readonly CI_SKIP_RSS_SITEMAP?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
