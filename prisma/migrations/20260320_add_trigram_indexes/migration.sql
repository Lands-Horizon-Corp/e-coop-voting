-- Enable the fuzzy search extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN index for combined name searching (First + Last)
CREATE INDEX IF NOT EXISTS "member_search_name_idx" ON "EventAttendees" 
USING GIN (("firstName" || ' ' || "lastName") gin_trgm_ops);

-- Create GIN index for Passbook Number searching
CREATE INDEX IF NOT EXISTS "member_search_passbook_idx" ON "EventAttendees" 
USING GIN ("passbookNumber" gin_trgm_ops);

-- Add standard B-Tree index for common filters to narrow down the search set
CREATE INDEX IF NOT EXISTS "EventAttendees_eventId_registered_idx" ON "EventAttendees"("eventId", "registered");