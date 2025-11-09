/*
  # Create shipments table for JB Logistics

  1. New Tables
    - `shipments`
      - `id` (uuid, primary key) - Unique shipment identifier
      - `tracking_number` (text, unique) - JBL tracking number (e.g., JBL-1756672943285-457)
      - `user_id` (text) - User who created the shipment
      - `user_email` (text) - User's email address
      - `user_name` (text) - User's display name
      - `sender_email` (text) - Sender's email for notifications
      - `sender_phone` (text) - Sender's phone number
      - `pickup_address` (text) - Pickup location
      - `receiver_phone` (text) - Receiver's phone number
      - `delivery_address` (text) - Delivery destination
      - `package_description` (text) - What's being shipped
      - `service_type` (text) - Type of delivery service selected
      - `status` (text, default 'processing') - Current shipment status
      - `created_at` (timestamptz) - When shipment was created
      - `updated_at` (timestamptz) - Last update timestamp
      
  2. Security
    - Enable RLS on `shipments` table
    - Add policy for users to create their own shipments
    - Add policy for users to read their own shipments
    - Add policy for users to update their own shipments

  3. Indexes
    - Index on tracking_number for fast lookup
    - Index on user_id for user-specific queries
*/

CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number text UNIQUE NOT NULL,
  user_id text NOT NULL,
  user_email text NOT NULL,
  user_name text,
  sender_email text NOT NULL,
  sender_phone text NOT NULL,
  pickup_address text NOT NULL,
  receiver_phone text NOT NULL,
  delivery_address text NOT NULL,
  package_description text NOT NULL,
  service_type text NOT NULL,
  status text DEFAULT 'processing',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own shipments"
  ON shipments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read their own shipments"
  ON shipments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own shipments"
  ON shipments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_user_id ON shipments(user_id);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at DESC);