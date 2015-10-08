CREATE TABLE Detailed_problem (
 id INT NOT NULL,
 title VARCHAR(40) NOT NULL, 
 content VARCHAR(255) NOT NULL,
 proposal VARCHAR(255) NOT NULL, /*User can propose a solution*/
 severity INT NOT NULL,
 status VARCHAR(255) NOT NULL, /* not resolved or resolved */
 location BIGINT NOT NULL, /*Latitude and Longtitude of the problem*/
 problem_type_id INT NOT NULL,
 number_of_votus BIGINT,
 datetime TIMESTAMP NOT NULL, /*date of create*/
 first_name VARCHAR(100) NOT NULL,
 last_name VARCHAR(100) NOT NULL,
 number_of_comments INT,
 PRIMARY KEY (id),
);
