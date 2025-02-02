CREATE TABLE executions (
    id SERIAL PRIMARY KEY,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL
);

ALTER TABLE executions ADD COLUMN end_time TIMESTAMP NULL;



CREATE TABLE movements (
    id SERIAL PRIMARY KEY,
    execution_id INT REFERENCES executions(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    position_x FLOAT,
    position_y FLOAT,
    angle FLOAT,
    scale FLOAT
);
