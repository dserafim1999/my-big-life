CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;

CREATE TABLE IF NOT EXISTS locations (
  location_id SERIAL PRIMARY KEY,
  label TEXT,
  -- Point representative of the location
  centroid GEOGRAPHY(POINTZ, 4326) NOT NULL,
  -- Cluster of points that derived the location
  point_cluster geography(LINESTRINGZ, 4326) NOT NULL
);

CREATE TABLE IF NOT EXISTS trips (
  trip_id SERIAL PRIMARY KEY,

  start_location TEXT,
  end_location TEXT,

  start_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  end_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,

  bounds geography(POLYGONZ, 4326) NOT NULL,
  points geography(LINESTRINGZ, 4326) NOT NULL,
  -- Length of timestamps must be the same as the lenght of points
  timestamps TIMESTAMP WITHOUT TIME ZONE[] NULL
);

CREATE TABLE IF NOT EXISTS stays (
  stay_id SERIAL PRIMARY KEY,
  -- trip_id SERIAL REFERENCES trips(trip_id),
  -- location_label TEXT REFERENCES locations(label),
  location_label TEXT NOT NULL,
  start_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  end_date TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS canonical_trips (
  canonical_id SERIAL PRIMARY KEY,

  -- start_location TEXT NOT NULL,
  -- end_location TEXT NOT NULL,

  bounds geography(POLYGONZ, 4326) NOT NULL,
  points geography(LINESTRINGZ, 4326) NOT NULL
);

CREATE TABLE IF NOT EXISTS canonical_trips_relations (
  canonical_trip SERIAL REFERENCES canonical_trips(canonical_id) ON DELETE CASCADE,
  trip SERIAL REFERENCES trips(trip_id) ON DELETE CASCADE
  );
