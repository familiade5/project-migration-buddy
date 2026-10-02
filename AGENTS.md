# Project rules

- The public VDH site (`/imoveis/*`) reads only `vdh_site_properties`, kept in sync daily by the `vdh-site-sync` edge function via pg_cron; it never touches the post-approval queue, so the site and post creators stay independent.
- Public site leads go to `vdh_cc_leads` only through the `vdh-site-submit` edge function (signed upload URLs to the private `vdh-site-docs` bucket); the CC VDH is separate from the AM CC (`cx_*` tables) so the two operations never mix.
