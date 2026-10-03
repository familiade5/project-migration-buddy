# Project rules

- The public VDH site (`/imoveis/*`) reads only `vdh_site_properties`, kept in sync daily by the `vdh-site-sync` edge function via pg_cron; properties that are new on Caixa are also added once to the post-approval queue (flagged `autoSync`, deduped by `scraped_properties.external_id`), while the site itself never reads that queue.
- Public site leads go to `vdh_cc_leads` only through the `vdh-site-submit` edge function (signed upload URLs to the private `vdh-site-docs` bucket); the CC VDH is separate from the AM CC (`cx_*` tables) so the two operations never mix.
- VDH feed and OLX publications use a fixed five-slide sequence: property, three educational slides, and contact; this avoids duplicating scarce source photos.
- The AM CC keeps process stage separate from immutable credit-analysis results; migrations are additive, existing documents/events remain in place, and non-admin deletion means archival.
