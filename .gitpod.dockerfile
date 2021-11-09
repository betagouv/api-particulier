FROM gitpod/workspace-postgres

RUN sudo apt install postgresql-common -y
RUN sudo sh /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y

RUN sudo sh -c "echo 'deb [signed-by=/usr/share/keyrings/timescale.keyring] https://packagecloud.io/timescale/timescaledb/ubuntu/ $(lsb_release -c -s) main' > /etc/apt/sources.list.d/timescaledb.list"
RUN wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/timescale.keyring
RUN sudo apt-get update

# Now install appropriate package for PG version
RUN sudo apt install timescaledb-2-postgresql-13 -y
