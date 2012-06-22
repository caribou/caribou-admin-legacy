(ns caribou.admin.core
  (:use compojure.core
        [ring.middleware reload file stacktrace resource file-info])
  (:require [clojure.string :as string]
            [clojure.java.io :as io]
            [compojure.route :as route]
            [compojure.handler :as handler]))

(defn render-index
  [& args]
  (slurp (io/resource "public/caribou.html")))

(defn admin
  [request]
  {:status 200 :body (render-index)})

(declare app)

(defn init
  []
  (def app (-> admin
               (wrap-resource "public")
               (wrap-file-info)
               (wrap-reload #'app '(caribou.admin.core))
               (wrap-stacktrace))))
