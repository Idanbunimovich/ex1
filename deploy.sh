chmod 400 idanFire2021.pem
ssh -i "idanFire2021.pem" ec2-user@ec2-18-214-87-2.compute-1.amazonaws.com "bash start.sh"
