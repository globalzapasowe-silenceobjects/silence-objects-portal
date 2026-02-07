-- Sentinel Agent tables

CREATE TABLE IF NOT EXISTS sentinel_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pr_number INTEGER,
    commit_sha TEXT NOT NULL,
    guard_name TEXT NOT NULL,
    status TEXT NOT NULL,
    violations JSONB DEFAULT '[]',
    compliance_score NUMERIC(5,2),
    execution_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sentinel_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guard_name TEXT UNIQUE NOT NULL,
    enabled BOOLEAN DEFAULT true,
    severity TEXT DEFAULT 'error',
    config JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sentinel_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_type TEXT NOT NULL,
    status TEXT NOT NULL,
    findings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE sentinel_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentinel_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentinel_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sentinel_service_all" ON sentinel_checks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "sentinel_service_all" ON sentinel_policies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "sentinel_service_all" ON sentinel_audit_log FOR ALL USING (true) WITH CHECK (true);

-- Seed default policies
INSERT INTO sentinel_policies (guard_name, enabled, severity) VALUES
  ('terminology', true, 'error'),
  ('contracts', true, 'error'),
  ('dependency', true, 'error'),
  ('closed-module', true, 'error'),
  ('type-safety', true, 'warning'),
  ('import', true, 'warning'),
  ('security', true, 'error'),
  ('build', true, 'error')
ON CONFLICT (guard_name) DO NOTHING;
