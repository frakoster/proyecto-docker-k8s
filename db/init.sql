CREATE TABLE executions (
    id SERIAL PRIMARY KEY,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movements (
    id SERIAL PRIMARY KEY,
    execution_id INT REFERENCES executions(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    position_x FLOAT,
    position_y FLOAT,
    angle FLOAT,
    scale FLOAT
);
