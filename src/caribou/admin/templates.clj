(ns caribou.admin.templates
  (:use [hiccup core]))


(def templates

  {
    :tools {

            :action-item (html [:a {:href "#"} "{{ label }}"])}


    :form {

            :fields {

                     :boolean (html [:label { :for "{{ modelSlug }}_{{ fieldSlug }}" }
                                      [:input { :type   "checkbox"
                                                :id     "{{ modelSlug }}_{{ fieldSlug }}"
                                                :name   "{{ modelSlug }}[{{ fieldSlug }}]"
                                                :value  "true" }]])


                     :string  (html [:label { :for "{{ modelSlug }}_{{ fieldSlug }}" } "{{ fieldName }}<abbr title=\"required\">*</abbr>"]
                                      [:input { :type   "text"
                                                :id     "{{ modelSlug }}_{{ fieldSlug }}"
                                                :name   "{{ modelSlug }}[{{ fieldSlug }}]"
                                                :maxlength "255"
                                                :value  "{{ value }}" }])


                     :slug    (html [:label { :for "{{ modelSlug }}_{{ fieldSlug }}" } "{{ fieldName }}<abbr title=\"required\">*</abbr>"]
                                      [:input { :type   "text"
                                                :name   "{{ modelSlug }}[{{ fieldSlug }}]"
                                                :value  "{{ value }}" }])


                     :integer (html [:label { :for "{{ modelSlug }}_{{ fieldSlug }}" } "{{ fieldName }}<abbr title=\"required\">*</abbr>"]
                                      [:input { :type   "text"
                                                :name   "{{ modelSlug }}[{{ fieldSlug }}]"
                                                :value  "{{ value }}" }])


                     :decimal (html [:label { :for "{{ modelSlug }}_{{ fieldSlug }}" } "{{ fieldName }}<abbr title=\"required\">*</abbr>"]
                                      [:input { :type   "text"
                                                :name   "{{ modelSlug }}[{{ fieldSlug }}]"
                                                :value  "{{ value }}" }])


                     :text    (html [:label { :for "{{ modelSlug }}_{{ fieldSlug }}" } "{{ fieldName }}<abbr title=\"required\">*</abbr>"]
                                      [:textarea { :type "text" :name "{{ modelSlug }}[{{ fieldSlug }}]" } "{{ value }}" ])


                     :timestamp (html [:label { :for "{{ modelSlug }}_{{ fieldSlug }}" } "{{ fieldName }}<abbr title=\"required\">*</abbr>"]
                                        [:input { :type   "text"
                                                  :name   "{{ modelSlug }}[{{ fieldSlug }}]"
                                                  :value  "{{ value }}" }])


                     :address (html [:input { :type "hidden"
                                              :name "{{ modelSlug }}[{{ fieldSlug }}]"}]

                                    [:label { :for "{{ modelSlug }}_{{ fieldSlug }}" } "{{ fieldName }}<abbr title=\"required\">*</abbr>"]

                                    [:input { :type   "text"
                                              :name   "{{ modelSlug }}[{{ fieldSlug }}][address]"
                                              :value  "{{ value }}" }]

                                    [:input { :type   "text"
                                              :name   "{{ modelSlug }}[{{ fieldSlug }}][address_two]"
                                              :value  "{{ value }}" }]

                                    [:input { :type   "text"
                                              :name   "{{ modelSlug }}[{{ fieldSlug }}][city]"
                                              :value  "{{ value }}" }]

                                    [:input { :type   "text"
                                              :name   "{{ modelSlug }}[{{ fieldSlug }}][state]"
                                              :value  "{{ value }}" }]

                                    [:input { :type   "text"
                                              :name   "{{ modelSlug }}[{{ fieldSlug }}][postal_code]"
                                              :value  "{{ value }}" }]

                                    [:input { :type   "text"
                                              :name   "{{ modelSlug }}[{{ fieldSlug }}][country]"
                                              :value  "{{ value }}" }]
                                    )


                     :part    (html [:label { :for "{{ modelSlug }}_{{ fieldSlug }}" } "{{ fieldName }}<abbr title=\"required\">*</abbr>"]
                                      [:textarea { :type "text" :name "{{ modelSlug }}[{{ fieldSlug }}]" } "{{ value }}" ])


                     :link    (html [:label { :for "{{ modelSlug }}_{{ fieldSlug }}" } "{{ fieldName }}<abbr title=\"required\">*</abbr>"]
                                      [:textarea { :type "text" :name "{{ modelSlug }}[{{ fieldSlug }}]" } "{{ value }}" ])


                     :asset   (html [:div
                                      [:label.fileinput-buttons { :for "{{ modelSlug }}_{{ fieldSlug }}" }
                                                                [:span "{{ fildName }}"]]

                                      [:input { :type   "hidden"
                                                :name   "{{ modelSlug }}[{{ fieldSlug }}]"
                                                :value  "{{ value }}" }]

                                      [:span.update "Choose Asset"]
                                      [:span#_thumbnail]
                                     ])}}


    :generic {

            :index {

                     :main (html [:div#main_content
                                   [:div.paginated_collection
                                     [:div.paginated_collection_contents
                                       [:div.index_content
                                         [:div.index_as_table
                                           [:table.index_table {:border 0 :cellspacing 0 :cellpadding 0}
                                             [:thead
                                               [:tr

                                                 ;; ------------------------------
                                                 ;; Header columns populated by js
                                                 ;; ------------------------------

                                                 ]]

                                             [:tbody

                                               ;; --------------------
                                               ;; Rows populated by js
                                               ;; --------------------

                                               ]]]]]]])

                     :sidebar (html [:div#sidebar
                                     ;{{tmpl({viewSpec: viewSpec, viewData: viewData}) \"#sidebarForGenericList\"}}\""}})
                                     ])}


      :edit {
                     :main (html [:div#main_content
                                   [:form { :accept-charset "UTF-8" :action "{{ action }}" :class "formtastic {{ model }}" :id "{{ model }}_edit" }

                                     ;; Placeholder div, populated by js
                                     [:div { :style "margin:0;padding:0;display:inline"}]

                                     ;; -------------------------
                                     ;; Fieldsets populated by js
                                     ;; -------------------------

                                     [:fieldset.buttons
                                       [:ol
                                         [:li.commit.button
                                           [:a.button { :href "#" } "{{ action }} {{ label }}"]]
                                         [:li.cancel
                                           [:a { :href "#" } "Cancel"]]]]]])

             }}})
