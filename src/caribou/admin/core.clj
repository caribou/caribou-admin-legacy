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
  (try 
    (let [resource (io/resource (str "public" (:uri request)))]
      {:status 200
       :body (slurp resource)
       :headers {"Content-Type" (mime/mime-type-of (:uri request))}})
    (catch Exception e
      {:status 200 :body (render-index)})))

(declare app)

(defn init
  []
  (def app admin)
  (if-let [swank-port (System/getProperty "admin-swank-port")]
    (swank/start-server :host "127.0.0.1" :port (Integer/parseInt swank-port))))