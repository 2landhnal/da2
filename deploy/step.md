kubectl create secret generic ssl-crt --from-file=./ssl/server.crt
kubectl create secret generic ssl-key --from-file=./ssl/server.key
kubectl create secret generic firebase-adminsdk-secret --from-file=firebase-adminsdk.json

kubectl create secret generic my-secret --from-env-file=.env
