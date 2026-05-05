/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Loose generic database type used purely to silence the supabase-js
 * type narrowing to `never[]`. We don't auto-generate types; row shapes
 * are validated with zod at the boundary and cast on read.
 */
type Loose = {
  Row: any;
  Insert: any;
  Update: any;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      contact_submissions: Loose;
      page_visits: Loose;
      before_after_cases: Loose;
      services: Loose;
      testimonials: Loose;
      profiles: Loose;
      site_settings: Loose;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
