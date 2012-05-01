(ns caribou.admin.core
  (:use compojure.core
        [cheshire.core :only (generate-string encode)]
        [hiccup core page-helpers])
  (:require [compojure.route :as route]
            [compojure.handler :as handler]
            [caribou.admin.templates :as templates]))


(defn render-index
  []

  (html [:html
    [:head
      [:meta {:http-equiv "Content-type" :content "text/html; charset=utf-8"}]
      [:title "Interface 3.0"]
      [:link {:href "/favicon.ico" :rel "icon" :type "image/x-icon"}]
      (include-js
        "/js/easyXDM.js"
        "/js/json2.js"
        "/js/jquery.js"
        "/js/jquery-ui-1.8.2/jquery-ui.min.js"
        "/js/jquery.tmpl.js"
        "/js/underscore.js"
        "/js/underscore-extensions.js"
        "/js/backbone.js"
        "/js/inflections.js"
        "/js/amplify.store.js"
        "/js/history.adapter.jquery.js"
        "/js/history.js"
        "/js/sherpa.js"
        "/js/caribou.js"
        "/js/admin.js")
      (include-css "/stylesheets/active_admin.css")]

    [:body.logged_in.admin_model.show

      [:div#wrapper

        [:div#header

          [:h1#site_title "Interface 3.0"]
          [:ul#tabs.header-items]
          [:p#utility_nav.header-item
            [:span.current_user "justin@weareinstrument.com"]
            [:a {:href "#"} "Logout"]]]

      [:div#title_bar

        [:div#titlebar_left
          [:span.breadcrumb]
          [:h2#page_title]]

        [:div#titlebar_right
          [:div.action_items]]]

      [:div.flashes]

      [:div#active_admin_content.without_sidebar]


      [:div#footer
        [:p "Props to Active Admin"]]


      [:script (str "caribou.templates=" (generate-string templates/templates) ";")]
      [:script "$(document).ready(caribou.admin.init);"]

      (include-js
        "/js/views/tools/action-item.js"
        "/js/views/generic/edit.js"
        "/js/views/generic/edit/sidebar.js"
        "/js/views/generic/index.js"
        "/js/views/generic/index/footer.js"
        "/js/views/generic/view.js"
        "/js/views/generic/view/panel.js"
        "/js/views/generic/view/panel-attributes-table.js"
        "/js/views/generic/form/fieldset.js"
        "/js/views/generic/table/header-column.js"
        "/js/views/generic/table/row.js"
        "/js/views/generic/table/column.js"
        "/js/views/global/navigation/tabs.js"
        "/js/views/global/navigation/breadcrumb.js"
        "/js/views/global/notification/flash.js"
        "/js/views/abstract/row-for-model-edit.js")
      (slurp "public/templates.html")]]]))



(defroutes admin-routes
  (route/files "/" {:root "public"})
  (route/not-found (render-index)))

(def app (handler/site admin-routes))

(defn init
  [])
