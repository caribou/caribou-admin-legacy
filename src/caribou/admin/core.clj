(ns caribou.admin.core
  (:use compojure.core
        [ring.middleware reload file stacktrace])
  (:require [clojure.string :as string]
            [clojure.java.io :as io]
            [compojure.route :as route]
            [compojure.handler :as handler]))

(def file-separator
  (str (.get (java.lang.System/getProperties) "file.separator")))

(defn pathify
  [paths]
  (string/join file-separator paths))

(defn file-exists?
  [path]
  (.exists (io/file path)))

(defn which-public
  []
  (let [admin-path (pathify ["admin" "public"])]
    (if (file-exists? admin-path)
      admin-path
      "public")))

(defn render-index
  [& args]
  (slurp (pathify [(which-public) "caribou.html"])))

(defroutes admin-routes
  (route/files "/" {:root (which-public)})
  (route/not-found (render-index)))

(declare app)

(defn init
  []
  (def app (-> (handler/site admin-routes)
               (wrap-reload 'caribou.admin.core)
               (wrap-file "public")
               (wrap-stacktrace))))
