docker build -t antrancs/multi-client:latest -t antrancs/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t antrancs/multi-server:latest -t antrancs/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t antrancs/multi-worker:latest -t antrancs/multi-worker:$SHA -f ./worker/Dockerfile ./worker
docker push antrancs/multi-client:latest
docker push antrancs/multi-server:latest
docker push antrancs/multi-worker:latest

docker push antrancs/multi-client:$SHA
docker push antrancs/multi-server:$SHA
docker push antrancs/multi-worker:$SHA

kubectl apply -f k8s
kubectl set image deployments/server-deployment server=antrancs/multi-server:$SHA
kubectl set image deployments/client-deployment client=antrancs/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=antrancs/multi-worker:$SHA