# Step 1

`kubectl create -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/master/bundle.yaml`

Expected output

```
customresourcedefinition.apiextensions.k8s.io/alertmanagerconfigs.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/alertmanagers.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/podmonitors.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/probes.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/prometheuses.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/prometheusrules.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/servicemonitors.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/thanosrulers.monitoring.coreos.com created
clusterrolebinding.rbac.authorization.k8s.io/prometheus-operator created
clusterrole.rbac.authorization.k8s.io/prometheus-operator created
deployment.apps/prometheus-operator created
serviceaccount/prometheus-operator created
service/prometheus-operator created
```

Verify

`kubectl get deploy`

Expected output

```
NAME READY UP-TO-DATE AVAILABLE AGE
prometheus-operator 1/1 1 1 3m21s
```

# Step 2

```
mkdir operator_k8s
cd operator_k8s
vi prom_rbac.yaml
```

Paste this into file

```
apiVersion: v1
kind: ServiceAccount
metadata:
  name: prometheus
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
- apiGroups: [""]
  resources:
  - nodes
  - nodes/metrics
  - services
  - endpoints
  - pods
  verbs: ["get", "list", "watch"]
- apiGroups: [""]
  resources:
  - configmaps
  verbs: ["get"]
- apiGroups:
  - networking.k8s.io
  resources:
  - ingresses
  verbs: ["get", "list", "watch"]
- nonResourceURLs: ["/metrics"]
  verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: prometheus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: prometheus
subjects:
- kind: ServiceAccount
  name: prometheus
  namespace: default
```

Then exit (ESC + :x) and apply

`kubectl apply -f prom_rbac.yaml`

Expected output

```
serviceaccount/prometheus created
clusterrole.rbac.authorization.k8s.io/prometheus created
clusterrolebinding.rbac.authorization.k8s.io/prometheus created
```

# Step 3

`vi prometheus.yaml`

Then paste this

```
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: prometheus
  labels:
    app: prometheus
spec:
  image: quay.io/prometheus/prometheus:v2.22.1
  nodeSelector:
    kubernetes.io/os: linux
  replicas: 2
  resources:
    requests:
      memory: 400Mi
  securityContext:
    fsGroup: 2000
    runAsNonRoot: true
    runAsUser: 1000
  serviceAccountName: prometheus
  version: v2.22.1
  serviceMonitorSelector: {}
```

Then exit (ESC + :x) and apply

`kubectl apply -f prometheus.yaml`

Expected output

`prometheus.monitoring.coreos.com/prometheus created`

Verify

`kubectl get prometheus`

Expected output

```
NAME         VERSION   REPLICAS   AGE
prometheus   v2.22.1   2          32s
```

Check pods

`kubectl get pod`

Expected output

```
NAME                                   READY   STATUS    RESTARTS   AGE
prometheus-operator-79cd654746-mdfp6   1/1     Running   0          33m
prometheus-prometheus-0                2/2     Running   1          57s
prometheus-prometheus-1                2/2     Running   1          57s
```

# Step 4

`vi prom_svc.yaml`

Paste this

```
apiVersion: v1
kind: Service
metadata:
  name: prometheus
  labels:
    app: prometheus
spec:
  ports:
  - name: web
    port: 9090
    targetPort: web
  selector:
    app.kubernetes.io/name: prometheus
  sessionAffinity: ClientIP
```

Then exit (ESC + :x) and apply

`kubectl apply -f prom_svc.yaml`

`service/prometheus created`

Check your work:

`kubectl get service`

```
NAME                  TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
kubernetes            ClusterIP   10.245.0.1       <none>        443/TCP    27h
prometheus            ClusterIP   10.245.106.105   <none>        9090/TCP   26h
prometheus-operated   ClusterIP   None             <none>        9090/TCP   8m52s
prometheus-operator   ClusterIP   None             <none>        8080/TCP   41m
```

# Step 5

`vi prometheus_servicemonitor.yaml`

Paste this

```
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: prometheus-self
  labels:
    app: prometheus
spec:
  endpoints:
  - interval: 30s
    port: web
  selector:
    matchLabels:
      app: prometheus
```

Then exit (ESC + :x) and apply

`kubectl apply -f prometheus_servicemonitor.yaml`

`servicemonitor.monitoring.coreos.com/prometheus-self created`

# Step 6

You can find the remain steps here:

```
https://grafana.com/docs/grafana-cloud/monitor-infrastructure/kubernetes-monitoring/configuration/config-other-methods/prometheus/prometheus-operator/#create-a-kubernetes-secret-to-store-grafana-cloud-credentials
```

Good lucks!
