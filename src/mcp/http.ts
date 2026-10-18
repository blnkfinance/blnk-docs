import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createMcpServer } from './server';

type Session = {
	server: McpServer;
	transport: WebStandardStreamableHTTPServerTransport;
	lastSeen: number;
};

const sessions = new Map<string, Session>();
const IDLE_MS = 30 * 60 * 1000;

async function dropIdle(now: number) {
	for (const [id, session] of sessions) {
		if (now - session.lastSeen < IDLE_MS) continue;
		sessions.delete(id);
		await session.server.close().catch(() => undefined);
	}
}

export async function handleMcp(request: Request): Promise<Response> {
	const now = Date.now();
	await dropIdle(now);
	const sessionId = request.headers.get('mcp-session-id');
	if (sessionId) {
		const session = sessions.get(sessionId);
		if (!session) return new Response('Session not found', { status: 404 });
		session.lastSeen = now;
		return session.transport.handleRequest(request);
	}

	if (request.method !== 'POST') return new Response('Missing session', { status: 400 });

	let current: Session | undefined;
	const transport = new WebStandardStreamableHTTPServerTransport({
		sessionIdGenerator: () => crypto.randomUUID(),
		enableJsonResponse: true,
		onsessioninitialized: (id) => {
			if (current) sessions.set(id, current);
		},
		onsessionclosed: (id) => {
			const session = sessions.get(id);
			sessions.delete(id);
			void session?.server.close().catch(() => undefined);
		},
	});
	const server = await createMcpServer();
	current = { server, transport, lastSeen: now };
	await server.connect(transport);
	return transport.handleRequest(request);
}
