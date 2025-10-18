-- SEBMC Database Schema for Neon PostgreSQL

-- Table to store canvas data
CREATE TABLE IF NOT EXISTS canvas_data (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL DEFAULT 'default',
  canvas_name VARCHAR(255) NOT NULL DEFAULT 'My Canvas',
  data JSONB NOT NULL,
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, canvas_name)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_id ON canvas_data(user_id);
CREATE INDEX IF NOT EXISTS idx_last_modified ON canvas_data(last_modified DESC);

-- Insert default empty canvas (optional)
INSERT INTO canvas_data (user_id, canvas_name, data)
VALUES ('default', 'My Canvas', '{
  "sections": {
    "social-problem": {"id": "social-problem", "title": "Social problem", "subtitle": "A problem which is causing disequilibrium in the society.", "items": []},
    "service-portfolio": {"id": "service-portfolio", "title": "Service portfolio", "subtitle": "A list of services/actions/programs that deliver the core value.", "items": []},
    "core-value": {"id": "core-value", "title": "Core value offerings", "subtitle": "The value proposition that aims to eradicate the social problem addressed.", "items": []},
    "beneficiaries": {"id": "beneficiaries", "title": "Beneficiaries", "subtitle": "The target group/vulnerable segment who will be benefited.", "items": []},
    "impact": {"id": "impact", "title": "Impact", "subtitle": "A set of matrices to measure the progress of the value offered.", "items": []},
    "network-partners": {"id": "network-partners", "title": "Network partners", "subtitle": "Reference groups/peer-support network who are willing to join the cause.", "items": []},
    "channels": {"id": "channels", "title": "Channels", "subtitle": "Media through which the services will be provided, i.e. online, off-line.", "items": []},
    "costs": {"id": "costs", "title": "Costs", "subtitle": "Sources of expenditure, capital cost, operational cost.", "items": []},
    "revenue-stream": {"id": "revenue-stream", "title": "Revenue stream", "subtitle": "Sources of earnings which will keep the venture sustainable.", "items": []}
  },
  "lastModified": "2025-01-01T00:00:00.000Z"
}'::jsonb)
ON CONFLICT (user_id, canvas_name) DO NOTHING;
