export const SchemaChart = () => {
  return (
    <figure
      className="schema-chart"
      aria-label="Transactions point to balances as source and destination. Balances point to ledgers by ledger_id and to identity by identity_id."
    >
      <svg
        className="schema-chart__svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 560 340"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="schema-chart-arrow"
            className="schema-chart__arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0 0 L8 4 L0 8 z" />
          </marker>
        </defs>

        <path
          className="schema-chart__edge"
          d="M236 150 V109 H122 V70"
          markerEnd="url(#schema-chart-arrow)"
        />
        <path
          className="schema-chart__edge"
          d="M324 150 V109 H438 V70"
          markerEnd="url(#schema-chart-arrow)"
        />
        <path
          className="schema-chart__edge"
          d="M230 272 V192"
          markerEnd="url(#schema-chart-arrow)"
        />
        <path
          className="schema-chart__edge"
          d="M330 272 V192"
          markerEnd="url(#schema-chart-arrow)"
        />

        <rect className="schema-chart__label-bg" x="148" y="100" width="62" height="18" rx="2" />
        <text className="schema-chart__edge-label" x="179" y="113">
          ledger_id
        </text>
        <rect className="schema-chart__label-bg" x="345" y="100" width="72" height="18" rx="2" />
        <text className="schema-chart__edge-label" x="381" y="113">
          identity_id
        </text>
        <rect className="schema-chart__label-bg" x="206" y="223" width="48" height="18" rx="2" />
        <text className="schema-chart__edge-label" x="230" y="236">
          source
        </text>
        <rect className="schema-chart__label-bg" x="291" y="223" width="78" height="18" rx="2" />
        <text className="schema-chart__edge-label" x="330" y="236">
          destination
        </text>

        <rect className="schema-chart__node" x="48" y="28" width="148" height="40" rx="5" />
        <text className="schema-chart__node-label" x="122" y="53">
          ledgers
        </text>
        <rect className="schema-chart__node" x="364" y="28" width="148" height="40" rx="5" />
        <text className="schema-chart__node-label" x="438" y="53">
          identity
        </text>
        <rect className="schema-chart__node" x="196" y="150" width="168" height="40" rx="5" />
        <text className="schema-chart__node-label" x="280" y="175">
          balances
        </text>
        <rect className="schema-chart__node" x="176" y="272" width="208" height="40" rx="5" />
        <text className="schema-chart__node-label" x="280" y="297">
          transactions
        </text>
      </svg>
    </figure>
  )
}
