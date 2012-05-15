(ns caribou.admin.core
  (:use compojure.core
        [ring.middleware reload file stacktrace])
  (:require [clojure.string :as string]
            [clojure.java.io :as io]
            [compojure.route :as route]
            [compojure.handler :as handler]))

(defn render-index
  [& args]
  (slurp (io/resource "public/caribou.html")))

(defroutes admin-routes
  (route/resources "/")
  (route/not-found (render-index)))

(declare app)

(defn init
  []
  (def app (-> (handler/site admin-routes)
               (wrap-stacktrace))))
