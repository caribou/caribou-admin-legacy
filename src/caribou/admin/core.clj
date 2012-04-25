(ns caribou.admin.core
  (:use compojure.core)
  (:require [compojure.route :as route]
            [compojure.handler :as handler]))

(defn render-index
  [& args]
  (slurp "public/caribou.html"))

(defroutes admin-routes
  (route/files "/" {:root "public"})
  (route/not-found (render-index)))

(declare app)

(defn init
  []
  (def app (handler/site admin-routes)))