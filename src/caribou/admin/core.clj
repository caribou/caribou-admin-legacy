(ns caribou.admin.core
  (:require [clojure.string :as string]
            [clojure.java.io :as io]
            [pantomime.mime :as mime]
            [swank.swank :as swank]))

(defn render-index
  [& args]
  (slurp (io/resource "public/caribou.html")))

(defn admin
  [request]
  (if-let [resource (io/resource (str "public" (:uri request)))]
    {:status 200
     :body (slurp resource)
     :headers {"Content-Type" (mime/mime-type-of (:uri request))}}
    {:status 200 :body (render-index)}))

(declare app)

(defn init
  []
  (def app admin)
  (if-not (System/getProperty "environment")
    (swank/start-server :host "127.0.0.1" :port 9903)))
