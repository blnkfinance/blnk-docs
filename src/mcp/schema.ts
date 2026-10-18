export const sessionLogStatements = [
	`CREATE TABLE IF NOT EXISTS mcp_session_log (
	id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	at timestamptz NOT NULL,
	tool text NOT NULL,
	session text NOT NULL,
	client text NOT NULL,
	page_path text,
	page_title text,
	operation text,
	query text,
	task text,
	filter text
)`,
	`CREATE INDEX IF NOT EXISTS mcp_session_log_at_idx ON mcp_session_log (at)`,
];
