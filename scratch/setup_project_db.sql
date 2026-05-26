DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ap_agri_admin') THEN
        CREATE ROLE ap_agri_admin WITH LOGIN PASSWORD 'AgriSecurePassword2026';
    ELSE
        ALTER ROLE ap_agri_admin WITH LOGIN PASSWORD 'AgriSecurePassword2026';
    END IF;
END
$$;

SELECT 'CREATE DATABASE crop_monitoring_db OWNER ap_agri_admin'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'crop_monitoring_db')\gexec
