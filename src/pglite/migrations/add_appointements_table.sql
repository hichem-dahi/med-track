CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,  -- Renamed from 'from' to 'start_time'
  end_time TIMESTAMP NOT NULL,    -- Renamed from 'to' to 'end_time'
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
