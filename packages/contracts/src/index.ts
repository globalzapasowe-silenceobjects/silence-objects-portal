export interface SilenceObject { id: string; userId: string; tenantId?: string; content: string; captureMethod: 'text' | 'voice' | 'image'; state: 'draft' | 'captured' | 'analyzed' | 'archived'; createdAt: string; updatedAt: string; }
export interface Pattern { id: string; objectId: string; type: 'loop' | 'cycle' | 'trigger' | 'drift' | 'fault' | 'convergence'; description: string; confidence: number; phase: AnalysisPhase; }
export type AnalysisPhase = 'context' | 'tension' | 'meaning' | 'function';
export interface DualLensResult { lensA: LensInterpretation; lensB: LensInterpretation; conflict: boolean; synthesisNote?: string; }
export interface LensInterpretation { lens: 'A' | 'B'; label: string; description: string; confidence: number; patterns: string[]; }
export type ArchetypeName = 'Creator' | 'Ruler' | 'Caregiver' | 'Explorer' | 'Sage' | 'Hero' | 'Rebel' | 'Magician' | 'Lover' | 'Jester' | 'Innocent' | 'Orphan';
export interface ArchetypeScore { archetype: ArchetypeName; score: number; dominantPattern: string; typicalTension: string; shadowPattern: string; growthEdge: string; }
export interface TenantContext { tenantId: string; plan: 'free' | 'pro' | 'enterprise'; safetyProfile: 'FULL' | 'MINIMAL_ADULT_TOOL' | 'ENTERPRISE'; }
export interface ActorContext { userId: string; role: 'user' | 'admin' | 'clinician' | 'system'; locale: 'pl' | 'en'; }
export interface AgentTask { id: string; agentId: string; type: string; payload: Record<string, unknown>; priority: number; status: 'queued' | 'running' | 'completed' | 'failed'; createdAt: string; }
export interface AgentResult { taskId: string; agentId: string; success: boolean; output: Record<string, unknown>; cost: number; durationMs: number; completedAt: string; }
export interface CoreModule { analyzeObject(object: SilenceObject, actor: ActorContext): Promise<DualLensResult>; extractPatterns(object: SilenceObject): Promise<Pattern[]>; }
export interface AIProvider { analyze(prompt: string, systemPrompt: string): Promise<string>; estimateCost(promptLength: number): number; }
export interface VoiceProvider { transcribe(audioBuffer: ArrayBuffer): Promise<string>; }
export interface AgentModule { execute(task: AgentTask): Promise<AgentResult>; getStatus(): 'idle' | 'busy' | 'error'; }
