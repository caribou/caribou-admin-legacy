(defproject antler/caribou-admin "0.7.2"
  :description "Flexible and adaptive admin for caribou-api"
  :url "http://github.com/antler/caribou-admin"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.3.0"]
                 [swank-clojure "1.4.2"]
                 [com.novemberain/pantomime "1.4.0"]
                 [compojure "1.1.3"]]
  :ring {:handler caribou.admin.core/app
         :servlet-name "caribou-admin"
         :init caribou.admin.core/init
         :port 33553}
  :resources-path "resources")
