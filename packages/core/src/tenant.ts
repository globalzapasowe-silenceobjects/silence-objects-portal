export interface TenantContext {
  tenantId: string;
  orgName: string;
  plan: "free" | "starter" | "growth" | "enterprise";
  features: string[];
}

export interface ActorContext {
  userId: string;
  role: "investor" | "admin" | "consumer" | "b2b";
  tenantId: string;
}

export function createTenantContext(tenantId: string, orgName: string, plan: TenantContext["plan"]): TenantContext {
  const featureMap: Record<TenantContext["plan"], string[]> = {
    free: ["dashboard"],
    starter: ["dashboard", "kpi", "export"],
    growth: ["dashboard", "kpi", "export", "agents", "api"],
    enterprise: ["dashboard", "kpi", "export", "agents", "api", "custom-integrations", "sla"],
  };
  return { tenantId, orgName, plan, features: featureMap[plan] };
}

export function hasFeature(ctx: TenantContext, feature: string): boolean {
  return ctx.features.includes(feature);
}
