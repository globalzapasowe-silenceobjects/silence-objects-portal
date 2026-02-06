export type SilenceEventType = 'object.created' | 'object.analyzed' | 'pattern.detected' | 'archetype.updated' | 'prediction.generated' | 'crisis.detected' | 'risk.flagged' | 'agent.run.completed' | 'agent.run.failed' | 'tenant.provisioned' | 'subscription.changed' | 'content.published' | 'content.blocked' | 'anomaly.detected';
export interface SilenceEvent<T = unknown> { id: string; type: SilenceEventType; payload: T; timestamp: string; source: string; tenantId?: string; userId?: string; }
type Handler<T = unknown> = (e: SilenceEvent<T>) => void | Promise<void>;
class SilenceEventBus {
  private h: Map<SilenceEventType, Set<Handler>> = new Map();
  private a: Set<Handler> = new Set();
  on<T>(t: SilenceEventType, fn: Handler<T>): () => void { if (!this.h.has(t)) this.h.set(t, new Set()); this.h.get(t)!.add(fn as Handler); return () => { this.h.get(t)?.delete(fn as Handler); }; }
  onAll(fn: Handler): () => void { this.a.add(fn); return () => { this.a.delete(fn); }; }
  async emit<T>(t: SilenceEventType, p: T, src: string, m?: { tenantId?: string; userId?: string }): Promise<void> {
    const ev: SilenceEvent<T> = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, type: t, payload: p, timestamp: new Date().toISOString(), source: src, tenantId: m?.tenantId, userId: m?.userId };
    await Promise.allSettled([...(this.h.get(t) ?? []), ...this.a].map(fn => fn(ev as SilenceEvent)));
  }
  clear(): void { this.h.clear(); this.a.clear(); }
}
export const eventBus = new SilenceEventBus();
export { SilenceEventBus };
