(defproject antler/caribou-admin "0.3.6"
  :description "Flexible and adaptive admin for caribou-api"
  :url "http://github.com/antler/caribou-admin"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.3.0"]
                 [compojure "1.0.4"]
                 [ring/ring-core "1.1.0"
                  :exclusions [org.clojure/clojure
                               clj-stacktrace
                               hiccup]]]
  :ring {:handler caribou.admin.core/app
         :servlet-name "caribou-admin"
         :init caribou.admin.core/init
         :port 33553}
  :resources-path "resources"
  :repositories {"snapshots" {:url "http://battlecat:8080/nexus/content/repositories/snapshots" 
                              :username "deployment" :password "deployment"}
                 "releases"  {:url "http://battlecat:8080/nexus/content/repositories/releases" 
                              :username "deployment" :password "deployment"}})

