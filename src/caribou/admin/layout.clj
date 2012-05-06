(ns caribou.admin.layout
  (:use [hiccup core page-helpers]
        [cheshire.core :only (generate-string encode)])
  (:require [caribou.admin.templates :as templates]))


(def layout
  (html [:html
    [:head
      [:meta {:http-equiv "Content-type" :content "text/html; charset=utf-8"}]
      [:title "Interface 3.0"]
      [:link {:href "/favicon.ico" :rel "icon" :type "image/x-icon"}]
      (include-js "/javascripts/ender.js")
      (include-css "/stylesheets/active_admin.css" "/css/caribou.css")]

    [:body.logged_in.admin_model.show

      [:div#wrapper

        [:div#header

          [:h1#site_title "Interface 3.0"]
          [:ul#tabs.header-items.loading]
          [:p#utility_nav.header-item
            [:span.current_user "justin@weareinstrument.com"]
            [:a {:href "/logout"} "Logout"]]]

      [:div#title_bar

        [:div#titlebar_left
          [:span.breadcrumb]
          [:h2#page_title]]

        [:div#titlebar_right
          [:div.action_items]]]

      [:div.flashes]

      [:div#active_admin_content.without_sidebar]


      [:div#footer
        [:p "It looks like Active Admin, but its not."]]


      (include-js

        ;; Include libs

        "/js/easyXDM.js"
        "/js/underscore.extensions.js"
        "/js/inflections.js"
        ;"/js/admin.js"
        "/js/app.js"

        ;; Include Models
        "/js/models/model-data.js"

        ;; Include Collections
        "/js/collections/model-data.js"

        ;; Include Views
        "/js/views/global-nav.js"
        ;"/js/views/tools/action-item.js"
        ;"/js/views/generic/edit.js"
        ;"/js/views/generic/new.js"
        ;"/js/views/generic/sidebar.js"
        ;"/js/views/generic/index.js"
        ;"/js/views/generic/index/footer.js"
        ;"/js/views/generic/view.js"
        ;"/js/views/generic/view/panel.js"
        ;"/js/views/generic/view/panel-attributes-table.js"
        ;"/js/views/generic/form/fieldset.js"
        ;"/js/views/generic/table/header-column.js"
        ;"/js/views/generic/table/row.js"
        ;"/js/views/generic/table/column.js"
        ;"/js/views/global/navigation/tabs.js"
        ;"/js/views/global/navigation/breadcrumb.js"
        ;"/js/views/global/notification/flash.js"
        ;"/js/views/abstract/row-for-model-edit.js")

        ;; Last of all, the router
        "/js/router.js")


      [:script (str "caribou.templates=" (generate-string templates/templates) ";")]
      ;[:script "caribou.admin.init();"]
      ]]]))


