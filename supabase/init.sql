
-- Configuración inicial de la base de datos para Supabase local

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear esquemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS realtime;
CREATE SCHEMA IF NOT EXISTS _realtime;

-- Crear roles necesarios
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'anon') THEN
        CREATE ROLE anon NOLOGIN NOINHERIT;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated NOLOGIN NOINHERIT;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticator') THEN
        CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'your-super-secret-and-long-postgres-password';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'supabase_realtime_admin') THEN
        CREATE ROLE supabase_realtime_admin NOINHERIT LOGIN PASSWORD 'your-super-secret-and-long-postgres-password';
    END IF;
END
$$;

-- Otorgar permisos
GRANT anon, authenticated TO authenticator;
GRANT ALL ON SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated;

-- Crear tablas para la aplicación de alertas
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'supervisor', 'technical', 'driver', 'press')),
    shift TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active BOOLEAN DEFAULT true,
    requires_password BOOLEAN DEFAULT false,
    password_hash TEXT,
    prensa_id UUID
);

CREATE TABLE IF NOT EXISTS prensas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    assigned_to_driver UUID REFERENCES users(id),
    assigned_to_driver_name TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
    shift TEXT NOT NULL,
    user_id UUID REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    prensa_id UUID REFERENCES prensas(id),
    prensa_name TEXT,
    user_id UUID NOT NULL REFERENCES users(id),
    username TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('active', 'working', 'cancelled', 'resolved')),
    shift TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS prensa_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    prensa_ids UUID[] DEFAULT '{}',
    assigned_to_driver UUID REFERENCES users(id),
    assigned_to_driver_name TEXT
);

CREATE TABLE IF NOT EXISTS alert_buttons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    image TEXT,
    color TEXT NOT NULL,
    allowed_roles TEXT[] DEFAULT '{}'
);

-- Insertar datos iniciales
-- Crear usuario admin con contraseña encriptada (12345678)
INSERT INTO users (id, username, role, shift, requires_password, password_hash, active) VALUES 
('00000000-0000-0000-0000-000000000001', 'admin', 'admin', '1 shift', true, crypt('12345678', gen_salt('bf')), true)
ON CONFLICT (id) DO UPDATE SET 
    password_hash = crypt('12345678', gen_salt('bf')),
    active = true,
    requires_password = true;

-- Verificar que el usuario admin existe
INSERT INTO users (id, username, role, shift, requires_password, password_hash, active) VALUES 
('00000000-0000-0000-0000-000000000001', 'admin', 'admin', '1 shift', true, crypt('12345678', gen_salt('bf')), true)
ON CONFLICT (username) DO UPDATE SET 
    password_hash = crypt('12345678', gen_salt('bf')),
    active = true,
    requires_password = true,
    role = 'admin';

INSERT INTO prensas (id, name, status, shift) VALUES 
('10000000-0000-0000-0000-000000000001', 'Press 1', 'active', '1 shift'),
('10000000-0000-0000-0000-000000000002', 'Press 2', 'active', '1 shift'),
('10000000-0000-0000-0000-000000000003', 'Press 3', 'active', '2 shift'),
('10000000-0000-0000-0000-000000000004', 'Press 4', 'active', '2 shift')
ON CONFLICT (id) DO NOTHING;

INSERT INTO alert_buttons (id, name, color, allowed_roles) VALUES 
('20000000-0000-0000-0000-000000000001', 'Mechanical', '#ef4444', '{admin,supervisor,press}'),
('20000000-0000-0000-0000-000000000002', 'Electrical', '#f97316', '{admin,supervisor,press}'),
('20000000-0000-0000-0000-000000000003', 'Quality', '#eab308', '{admin,supervisor,press}'),
('20000000-0000-0000-0000-000000000004', 'Material', '#22c55e', '{admin,supervisor,driver}'),
('20000000-0000-0000-0000-000000000005', 'Other', '#6366f1', '{admin,supervisor,press,driver}'),
('20000000-0000-0000-0000-000000000006', 'Cancel', '#eab308', '{admin,supervisor,press,driver}')
ON CONFLICT (id) DO NOTHING;

-- Habilitar Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE prensas ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prensa_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_buttons ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (por ahora permisivas para desarrollo)
DROP POLICY IF EXISTS "Allow all operations" ON users;
DROP POLICY IF EXISTS "Allow all operations" ON prensas;
DROP POLICY IF EXISTS "Allow all operations" ON alerts;
DROP POLICY IF EXISTS "Allow all operations" ON prensa_blocks;
DROP POLICY IF EXISTS "Allow all operations" ON alert_buttons;

CREATE POLICY "Allow all operations" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON prensas FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON alerts FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON prensa_blocks FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON alert_buttons FOR ALL USING (true);

-- Configurar realtime
GRANT USAGE ON SCHEMA realtime TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA realtime TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA realtime TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA realtime TO anon, authenticated;

-- Mostrar información del usuario admin creado
DO $$
BEGIN
    RAISE NOTICE 'Usuario admin creado exitosamente:';
    RAISE NOTICE 'Username: admin';
    RAISE NOTICE 'Password: 12345678';
    RAISE NOTICE 'Role: admin';
END
$$;
